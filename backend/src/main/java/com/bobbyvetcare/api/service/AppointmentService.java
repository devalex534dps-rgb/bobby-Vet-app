package com.bobbyvetcare.api.service;

import com.bobbyvetcare.api.dto.email.AppointmentEmailDto;
import com.bobbyvetcare.api.dto.request.AppointmentCreateRequest;
import com.bobbyvetcare.api.dto.request.AppointmentStatusUpdateRequest;
import com.bobbyvetcare.api.dto.response.AppointmentResponse;
import com.bobbyvetcare.api.dto.response.PageResponse;
import com.bobbyvetcare.api.entity.AppointmentEntity;
import com.bobbyvetcare.api.entity.PatientEntity;
import com.bobbyvetcare.api.entity.UserEntity;
import com.bobbyvetcare.api.entity.enums.AppointmentStatus;
import com.bobbyvetcare.api.exception.BadRequestException;
import com.bobbyvetcare.api.exception.BusinessConflictException;
import com.bobbyvetcare.api.exception.ResourceNotFoundException;
import com.bobbyvetcare.api.repository.AppointmentRepository;
import com.bobbyvetcare.api.repository.ConsultationRepository;
import com.bobbyvetcare.api.repository.PatientRepository;
import com.bobbyvetcare.api.repository.UserRepository;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Year;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class AppointmentService {

    private static final Logger log = LoggerFactory.getLogger(AppointmentService.class);

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final ConsultationRepository consultationRepository;
    private final EmailService emailService;
    private final WhatsAppService whatsAppService;
    private final SmsService smsService;

    private final Set<String> sent24HourReminders = ConcurrentHashMap.newKeySet();
    private final Set<String> sent2HourReminders = ConcurrentHashMap.newKeySet();

    public AppointmentService(
        AppointmentRepository appointmentRepository,
        PatientRepository patientRepository,
        UserRepository userRepository,
        ConsultationRepository consultationRepository,
        EmailService emailService,
        WhatsAppService whatsAppService,
        SmsService smsService
    ) {
        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
        this.userRepository = userRepository;
        this.consultationRepository = consultationRepository;
        this.emailService = emailService;
        this.whatsAppService = whatsAppService;
        this.smsService = smsService;
    }

    public PageResponse<AppointmentResponse> getAppointments(
        AppointmentStatus status,
        LocalDate date,
        String q,
        int page,
        int size
    ) {
        String normalizedQ = (q != null && !q.isBlank()) ? q.trim() : null;
        Page<AppointmentEntity> result = appointmentRepository.searchAppointments(
            status,
            date,
            normalizedQ,
            PageRequest.of(page, size)
        );
        return new PageResponse<>(
            result.getContent().stream().map(this::toResponse).toList(),
            result.getNumber(),
            result.getSize(),
            result.getTotalElements(),
            result.getTotalPages()
        );
    }

    public AppointmentResponse getAppointmentById(String id) {
        AppointmentEntity appointment = appointmentRepository.findDetailedById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Cita no encontrada: " + id));
        return toResponse(appointment);
    }

    @Transactional
    public AppointmentResponse createAppointment(AppointmentCreateRequest request) {
        if (!request.endTime().isAfter(request.startTime())) {
            throw new BadRequestException("La hora de fin debe ser posterior a la hora de inicio");
        }

        PatientEntity patient = patientRepository.findByIdAndDeletedAtIsNull(request.pacienteId().trim())
            .orElseThrow(() -> new ResourceNotFoundException("Paciente no encontrado: " + request.pacienteId()));

        UserEntity vet = userRepository.findById(request.veterinarioId().trim())
            .orElseThrow(() -> new ResourceNotFoundException("Veterinario no encontrado: " + request.veterinarioId()));

        if (!Boolean.TRUE.equals(vet.getActive())) {
            throw new BadRequestException("El veterinario seleccionado no está activo");
        }

        AppointmentEntity appointment = new AppointmentEntity();
        appointment.setFolio(generateUniqueFolio());
        appointment.setPaciente(patient);
        appointment.setVeterinario(vet);
        appointment.setScheduledDate(request.scheduledDate());
        appointment.setStartTime(request.startTime());
        appointment.setEndTime(request.endTime());
        appointment.setSpecialty(request.specialty());
        appointment.setStatus(AppointmentStatus.confirmed);
        appointment.setNotes(request.notes() != null ? request.notes().trim() : null);

        AppointmentEntity saved = appointmentRepository.save(appointment);
        AppointmentResponse response = toResponse(saved);
        String tutorPhone = extractTutorPhone(saved);

        emailService.sendAppointmentConfirmation(AppointmentEmailDto.fromEntity(saved));
        whatsAppService.sendAppointmentConfirmation(response, tutorPhone);
        smsService.sendAppointmentConfirmation(response, tutorPhone);
        return response;
    }

    @Transactional
    public AppointmentResponse updateAppointmentStatus(String id, AppointmentStatusUpdateRequest request) {
        AppointmentEntity appointment = appointmentRepository.findDetailedById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Cita no encontrada: " + id));

        AppointmentStatus previousStatus = appointment.getStatus();
        if (previousStatus == AppointmentStatus.completed
            && request.status() == AppointmentStatus.cancelled) {
            throw new BusinessConflictException("No se puede cancelar una cita que ya fue completada");
        }

        appointment.setStatus(request.status());
        AppointmentEntity saved = appointmentRepository.save(appointment);
        AppointmentResponse response = toResponse(saved);
        String tutorPhone = extractTutorPhone(saved);

        if (previousStatus != AppointmentStatus.confirmed && saved.getStatus() == AppointmentStatus.confirmed) {
            emailService.sendAppointmentConfirmation(AppointmentEmailDto.fromEntity(saved));
            if (previousStatus == AppointmentStatus.cancelled) {
                whatsAppService.sendAppointmentRescheduled(response, tutorPhone);
                smsService.sendAppointmentRescheduled(response, tutorPhone);
            } else {
                whatsAppService.sendAppointmentConfirmation(response, tutorPhone);
                smsService.sendAppointmentConfirmation(response, tutorPhone);
            }
        } else if (previousStatus != AppointmentStatus.cancelled && saved.getStatus() == AppointmentStatus.cancelled) {
            whatsAppService.sendAppointmentCancellation(response, tutorPhone);
            smsService.sendAppointmentCancellation(response, tutorPhone);
        }

        return response;
    }

    @Transactional
    public AppointmentResponse rescheduleAppointment(String id, AppointmentCreateRequest request) {
        if (!request.endTime().isAfter(request.startTime())) {
            throw new BadRequestException("La hora de fin debe ser posterior a la hora de inicio");
        }

        AppointmentEntity appointment = appointmentRepository.findDetailedById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Cita no encontrada: " + id));

        if (appointment.getStatus() == AppointmentStatus.completed) {
            throw new BusinessConflictException("No se puede reprogramar una cita que ya fue completada");
        }

        appointment.setScheduledDate(request.scheduledDate());
        appointment.setStartTime(request.startTime());
        appointment.setEndTime(request.endTime());
        appointment.setSpecialty(request.specialty());
        appointment.setStatus(AppointmentStatus.confirmed);
        if (request.notes() != null) {
            appointment.setNotes(request.notes().trim());
        }

        AppointmentEntity saved = appointmentRepository.save(appointment);
        AppointmentResponse response = toResponse(saved);
        String tutorPhone = extractTutorPhone(saved);
        whatsAppService.sendAppointmentRescheduled(response, tutorPhone);
        smsService.sendAppointmentRescheduled(response, tutorPhone);
        return response;
    }

    public AppointmentResponse sendAppointmentReminder(String id) {
        AppointmentEntity appointment = appointmentRepository.findDetailedById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Cita no encontrada: " + id));

        if (appointment.getStatus() == AppointmentStatus.cancelled
            || appointment.getStatus() == AppointmentStatus.completed) {
            throw new BusinessConflictException(
                "No se puede enviar recordatorio para una cita en estado: " + appointment.getStatus()
            );
        }

        AppointmentResponse response = toResponse(appointment);
        String tutorPhone = extractTutorPhone(appointment);
        emailService.sendAppointmentReminder(AppointmentEmailDto.fromEntity(appointment));
        whatsAppService.sendAppointmentReminder(response, tutorPhone);
        smsService.sendAppointmentReminder(response, tutorPhone);
        return response;
    }

    @Scheduled(cron = "${app.automation.reminder-cron:0 */10 * * * *}")
    public void triggerAutomatedReminders() {
        process24HourReminders();
        process2HourReminders();
    }

    @Transactional(readOnly = true)
    public int process24HourReminders() {
        LocalDateTime now = LocalDateTime.now();
        LocalDate today = now.toLocalDate();
        LocalDate tomorrow = today.plusDays(1);
        LocalDate dayAfterTomorrow = today.plusDays(2);

        List<AppointmentEntity> candidateAppointments = appointmentRepository
            .findByStatusAndScheduledDateIn(
                AppointmentStatus.confirmed,
                List.of(today, tomorrow, dayAfterTomorrow)
            );

        int sentCount = 0;
        for (AppointmentEntity appointment : candidateAppointments) {
            if (appointment.getScheduledDate() == null || appointment.getStartTime() == null) {
                continue;
            }
            LocalDateTime appointmentTime = LocalDateTime.of(appointment.getScheduledDate(), appointment.getStartTime());
            long minutesUntil = Duration.between(now, appointmentTime).toMinutes();

            // Ventana 24 horas antes: entre 23 horas (1380m) y 25 horas (1500m)
            if (minutesUntil >= 1380 && minutesUntil <= 1500) {
                if (sent24HourReminders.add(appointment.getId())) {
                    AppointmentResponse response = toResponse(appointment);
                    String tutorPhone = extractTutorPhone(appointment);
                    log.info(
                        "[AUTOMATION_24H_WHATSAPP] Disparando recordatorio 24h citaId={}, folio={}, tutor={}, phone={}, fechaHora={}",
                        appointment.getId(),
                        appointment.getFolio(),
                        response.tutorName(),
                        tutorPhone,
                        appointmentTime
                    );
                    whatsAppService.sendAppointmentReminder24h(response, tutorPhone);
                    smsService.sendAppointmentReminder24h(response, tutorPhone);
                    emailService.sendAppointmentReminder(AppointmentEmailDto.fromEntity(appointment));
                    sentCount++;
                }
            }
        }
        return sentCount;
    }

    @Transactional(readOnly = true)
    public int process2HourReminders() {
        LocalDateTime now = LocalDateTime.now();
        LocalDate today = now.toLocalDate();
        LocalDate tomorrow = today.plusDays(1);

        List<AppointmentEntity> candidateAppointments = appointmentRepository
            .findByStatusAndScheduledDateIn(
                AppointmentStatus.confirmed,
                List.of(today, tomorrow)
            );

        int sentCount = 0;
        for (AppointmentEntity appointment : candidateAppointments) {
            if (appointment.getScheduledDate() == null || appointment.getStartTime() == null) {
                continue;
            }
            LocalDateTime appointmentTime = LocalDateTime.of(appointment.getScheduledDate(), appointment.getStartTime());
            long minutesUntil = Duration.between(now, appointmentTime).toMinutes();

            // Ventana 2 horas antes: entre 90m (1h 30m) y 150m (2h 30m)
            if (minutesUntil >= 90 && minutesUntil <= 150) {
                if (sent2HourReminders.add(appointment.getId())) {
                    AppointmentResponse response = toResponse(appointment);
                    String tutorPhone = extractTutorPhone(appointment);
                    log.info(
                        "[AUTOMATION_2H_WHATSAPP] Disparando recordatorio 2h citaId={}, folio={}, tutor={}, phone={}, fechaHora={}",
                        appointment.getId(),
                        appointment.getFolio(),
                        response.tutorName(),
                        tutorPhone,
                        appointmentTime
                    );
                    whatsAppService.sendAppointmentReminder2h(response, tutorPhone);
                    smsService.sendAppointmentReminder2h(response, tutorPhone);
                    sentCount++;
                }
            }
        }
        return sentCount;
    }

    @Scheduled(cron = "${app.mail.reminder-cron:0 0 8 * * *}")
    public void sendUpcomingAppointmentReminders() {
        LocalDate targetDate = LocalDate.now().plusDays(1);
        List<AppointmentEntity> upcomingAppointments = appointmentRepository
            .findByScheduledDateAndStatusOrderByStartTimeAsc(targetDate, AppointmentStatus.confirmed);

        log.info(
            "[EMAIL_REMINDER_BATCH] Procesando recordatorios programados para fecha={} (citas={})",
            targetDate,
            upcomingAppointments.size()
        );

        for (AppointmentEntity appointment : upcomingAppointments) {
            AppointmentResponse response = toResponse(appointment);
            String tutorPhone = extractTutorPhone(appointment);
            emailService.sendAppointmentReminder(AppointmentEmailDto.fromEntity(appointment));
            whatsAppService.sendAppointmentReminder(response, tutorPhone);
            smsService.sendAppointmentReminder(response, tutorPhone);
        }
    }

    private String extractTutorPhone(AppointmentEntity appointment) {
        if (appointment == null || appointment.getPaciente() == null || appointment.getPaciente().getTutor() == null) {
            return null;
        }
        return appointment.getPaciente().getTutor().getPhone();
    }

    @Transactional
    public void deleteAppointment(String id) {
        AppointmentEntity appointment = appointmentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Cita no encontrada: " + id));
        if (consultationRepository.existsByCita_Id(id)) {
            throw new BusinessConflictException("No se puede eliminar la cita porque tiene una consulta clínica asociada");
        }
        appointmentRepository.delete(appointment);
    }

    private String generateUniqueFolio() {
        String suffix = UUID.randomUUID().toString().replace("-", "").substring(0, 6).toUpperCase();
        return "BVC-" + Year.now().getValue() + "-" + suffix;
    }

    public AppointmentResponse toResponse(AppointmentEntity appointment) {
        PatientEntity patient = appointment.getPaciente();
        UserEntity vet = appointment.getVeterinario();
        return new AppointmentResponse(
            appointment.getId(),
            appointment.getFolio(),
            patient.getId(),
            patient.getName(),
            patient.getSpecies(),
            patient.getBreed(),
            patient.getTutor().getFullName(),
            vet.getId(),
            vet.getFullName(),
            appointment.getScheduledDate(),
            appointment.getStartTime(),
            appointment.getEndTime(),
            appointment.getSpecialty(),
            appointment.getStatus(),
            appointment.getNotes()
        );
    }
}
