package com.bobbyvetcare.api.service;

import com.bobbyvetcare.api.dto.notification.ConsultationNotificationDto;
import com.bobbyvetcare.api.dto.request.ConsultationCreateRequest;
import com.bobbyvetcare.api.dto.request.ConsultationUpdateRequest;
import com.bobbyvetcare.api.dto.response.ConsultationResponse;
import com.bobbyvetcare.api.dto.response.PageResponse;
import com.bobbyvetcare.api.dto.response.ServiceResponse;
import com.bobbyvetcare.api.entity.AppointmentEntity;
import com.bobbyvetcare.api.entity.ConsultationEntity;
import com.bobbyvetcare.api.entity.PatientEntity;
import com.bobbyvetcare.api.entity.ServiceEntity;
import com.bobbyvetcare.api.entity.UserEntity;
import com.bobbyvetcare.api.entity.enums.AppointmentStatus;
import com.bobbyvetcare.api.entity.enums.ConsultationStatus;
import com.bobbyvetcare.api.exception.BusinessConflictException;
import com.bobbyvetcare.api.exception.ResourceNotFoundException;
import com.bobbyvetcare.api.repository.AppointmentRepository;
import com.bobbyvetcare.api.repository.ConsultationRepository;
import com.bobbyvetcare.api.repository.PatientRepository;
import com.bobbyvetcare.api.repository.ServiceRepository;
import com.bobbyvetcare.api.repository.UserRepository;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class ConsultationService {

    private final ConsultationRepository consultationRepository;
    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;
    private final ServiceCatalogService serviceCatalogService;
    private final OpenWaWhatsAppService whatsAppService;

    public ConsultationService(
        ConsultationRepository consultationRepository,
        PatientRepository patientRepository,
        AppointmentRepository appointmentRepository,
        UserRepository userRepository,
        ServiceRepository serviceRepository,
        ServiceCatalogService serviceCatalogService,
        OpenWaWhatsAppService whatsAppService
    ) {
        this.consultationRepository = consultationRepository;
        this.patientRepository = patientRepository;
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
        this.serviceRepository = serviceRepository;
        this.serviceCatalogService = serviceCatalogService;
        this.whatsAppService = whatsAppService;
    }

    public PageResponse<ConsultationResponse> getConsultations(
        String pacienteId,
        ConsultationStatus status,
        String q,
        int page,
        int size
    ) {
        String normalizedPacienteId = (pacienteId != null && !pacienteId.isBlank()) ? pacienteId.trim() : null;
        String normalizedQ = (q != null && !q.isBlank()) ? q.trim() : null;

        Page<ConsultationEntity> result = consultationRepository.searchConsultations(
            normalizedPacienteId,
            status,
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

    public ConsultationResponse getConsultationById(String id) {
        ConsultationEntity consultation = consultationRepository.findDetailedById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Consulta no encontrada: " + id));
        return toResponse(consultation);
    }

    @Transactional
    public ConsultationResponse startConsultation(ConsultationCreateRequest request, String veterinarioId) {
        PatientEntity patient = patientRepository.findByIdAndDeletedAtIsNull(request.pacienteId().trim())
            .orElseThrow(() -> new ResourceNotFoundException("Paciente no encontrado: " + request.pacienteId()));

        UserEntity vet = userRepository.findById(veterinarioId)
            .orElseThrow(() -> new ResourceNotFoundException("Veterinario no encontrado: " + veterinarioId));

        ConsultationEntity consultation = new ConsultationEntity();
        consultation.setPaciente(patient);
        consultation.setVeterinario(vet);
        consultation.setStatus(ConsultationStatus.active);
        consultation.setReason(request.reason().trim());
        consultation.setDiagnosis(request.diagnosis());
        consultation.setTreatment(request.treatment());
        consultation.setVitals(request.vitals());

        if (request.citaId() != null && !request.citaId().isBlank()) {
            AppointmentEntity appointment = appointmentRepository.findById(request.citaId().trim())
                .orElseThrow(() -> new ResourceNotFoundException("Cita no encontrada: " + request.citaId()));
            appointment.setStatus(AppointmentStatus.in_progress);
            appointmentRepository.save(appointment);
            consultation.setCita(appointment);
        }

        if (request.servicioIds() != null && !request.servicioIds().isEmpty()) {
            consultation.setServicios(resolveServices(request.servicioIds()));
        }

        ConsultationEntity saved = consultationRepository.save(consultation);
        whatsAppService.sendConsultationCreated(ConsultationNotificationDto.fromEntity(saved));
        return toResponse(saved);
    }

    @Transactional
    public ConsultationResponse updateConsultation(String id, ConsultationUpdateRequest request) {
        ConsultationEntity consultation = consultationRepository.findDetailedById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Consulta no encontrada: " + id));

        applyReportFields(consultation, request);
        return toResponse(consultationRepository.save(consultation));
    }

    @Transactional
    public ConsultationResponse closeConsultation(String id, ConsultationUpdateRequest request) {
        ConsultationEntity consultation = consultationRepository.findDetailedById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Consulta no encontrada: " + id));

        if (consultation.getStatus() == ConsultationStatus.closed) {
            throw new BusinessConflictException("La consulta ya se encuentra cerrada");
        }

        applyReportFields(consultation, request);
        consultation.setStatus(ConsultationStatus.closed);
        consultation.setFinishedAt(LocalDateTime.now());

        if (consultation.getCita() != null) {
            AppointmentEntity appointment = consultation.getCita();
            appointment.setStatus(AppointmentStatus.completed);
            appointmentRepository.save(appointment);
        }

        ConsultationEntity saved = consultationRepository.save(consultation);
        whatsAppService.sendConsultationCompleted(ConsultationNotificationDto.fromEntity(saved));
        return toResponse(saved);
    }

    private void applyReportFields(ConsultationEntity consultation, ConsultationUpdateRequest request) {
        if (request.reason() != null && !request.reason().isBlank()) {
            consultation.setReason(request.reason().trim());
        }
        consultation.setDiagnosis(request.diagnosis().trim());
        consultation.setTreatment(request.treatment() != null ? request.treatment().trim() : null);
        consultation.setVitals(request.vitals() != null ? request.vitals().trim() : null);
        if (request.servicioIds() != null) {
            consultation.setServicios(resolveServices(request.servicioIds()));
        }
    }

    private Set<ServiceEntity> resolveServices(List<String> servicioIds) {
        if (servicioIds.isEmpty()) {
            return new HashSet<>();
        }
        return new HashSet<>(serviceRepository.findByIdIn(servicioIds));
    }

    public ConsultationResponse toResponse(ConsultationEntity consultation) {
        List<ServiceResponse> servicios = consultation.getServicios()
            .stream()
            .map(serviceCatalogService::toResponse)
            .toList();

        return new ConsultationResponse(
            consultation.getId(),
            consultation.getCita() != null ? consultation.getCita().getId() : null,
            consultation.getPaciente().getId(),
            consultation.getPaciente().getName(),
            consultation.getVeterinario().getId(),
            consultation.getVeterinario().getFullName(),
            consultation.getStatus(),
            consultation.getReason(),
            consultation.getDiagnosis(),
            consultation.getTreatment(),
            consultation.getVitals(),
            consultation.getStartedAt(),
            consultation.getFinishedAt(),
            servicios
        );
    }
}
