package com.bobbyvetcare.api.service;

import com.bobbyvetcare.api.dto.response.FolioLookupResponse;
import com.bobbyvetcare.api.dto.response.FolioLookupResponse.ConsultationSummary;
import com.bobbyvetcare.api.dto.response.FolioLookupResponse.NextAppointmentSummary;
import com.bobbyvetcare.api.entity.AppointmentEntity;
import com.bobbyvetcare.api.entity.PatientEntity;
import com.bobbyvetcare.api.entity.ServiceEntity;
import com.bobbyvetcare.api.entity.enums.AppointmentStatus;
import com.bobbyvetcare.api.exception.ResourceNotFoundException;
import com.bobbyvetcare.api.repository.AppointmentRepository;
import com.bobbyvetcare.api.repository.ConsultationRepository;
import java.time.LocalDate;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class PublicPortalService {

    private final AppointmentRepository appointmentRepository;
    private final ConsultationRepository consultationRepository;

    public PublicPortalService(
        AppointmentRepository appointmentRepository,
        ConsultationRepository consultationRepository
    ) {
        this.appointmentRepository = appointmentRepository;
        this.consultationRepository = consultationRepository;
    }

    public FolioLookupResponse lookupByFolio(String folio) {
        String normalizedFolio = folio.trim().toUpperCase();
        AppointmentEntity appointment = appointmentRepository.findByFolioIgnoreCase(normalizedFolio)
            .or(() -> {
                if (normalizedFolio.startsWith("BOB-")) {
                    String bvcCandidate = "BVC-" + normalizedFolio.substring(4);
                    return appointmentRepository.findByFolioIgnoreCase(bvcCandidate);
                }
                return java.util.Optional.empty();
            })
            .orElseThrow(() -> new ResourceNotFoundException("No se encontró ningún expediente con el folio: " + normalizedFolio));

        PatientEntity patient = appointment.getPaciente();

        NextAppointmentSummary nextAppointment = appointmentRepository
            .findFirstByPaciente_IdAndScheduledDateGreaterThanEqualAndStatusNotOrderByScheduledDateAscStartTimeAsc(
                patient.getId(),
                LocalDate.now(),
                AppointmentStatus.cancelled
            )
            .map(next -> new NextAppointmentSummary(
                next.getScheduledDate(),
                next.getStartTime(),
                next.getEndTime(),
                next.getVeterinario().getFullName(),
                next.getSpecialty(),
                next.getStatus()
            ))
            .orElse(null);

        List<ConsultationSummary> consultations = consultationRepository
            .findByPaciente_IdOrderByStartedAtDesc(patient.getId())
            .stream()
            .map(c -> new ConsultationSummary(
                c.getId(),
                c.getStartedAt(),
                c.getReason(),
                c.getDiagnosis(),
                c.getTreatment(),
                c.getVeterinario().getFullName(),
                c.getServicios().stream().map(ServiceEntity::getName).toList()
            ))
            .toList();

        return new FolioLookupResponse(
            appointment.getFolio(),
            patient.getName(),
            patient.getSpecies(),
            patient.getBreed(),
            patient.getTutor().getFullName(),
            nextAppointment,
            consultations
        );
    }
}
