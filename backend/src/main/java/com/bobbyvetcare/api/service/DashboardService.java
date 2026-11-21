package com.bobbyvetcare.api.service;

import com.bobbyvetcare.api.dto.response.DashboardSummaryResponse;
import com.bobbyvetcare.api.dto.response.DashboardSummaryResponse.RecentConsultationSummary;
import com.bobbyvetcare.api.dto.response.DashboardSummaryResponse.UpcomingAppointmentSummary;
import com.bobbyvetcare.api.entity.enums.AppointmentStatus;
import com.bobbyvetcare.api.entity.enums.ConsultationStatus;
import com.bobbyvetcare.api.repository.AppointmentRepository;
import com.bobbyvetcare.api.repository.ConsultationRepository;
import com.bobbyvetcare.api.repository.PatientRepository;
import java.time.LocalDate;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class DashboardService {

    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;
    private final ConsultationRepository consultationRepository;

    public DashboardService(
        PatientRepository patientRepository,
        AppointmentRepository appointmentRepository,
        ConsultationRepository consultationRepository
    ) {
        this.patientRepository = patientRepository;
        this.appointmentRepository = appointmentRepository;
        this.consultationRepository = consultationRepository;
    }

    public DashboardSummaryResponse getSummary() {
        LocalDate today = LocalDate.now();
        long totalPacientes = patientRepository.countByDeletedAtIsNull();
        long citasHoy = appointmentRepository.countByScheduledDate(today);
        long consultasActivas = consultationRepository.countByStatus(ConsultationStatus.active);

        List<UpcomingAppointmentSummary> upcomingAppointments = appointmentRepository
            .findTop5ByScheduledDateGreaterThanEqualAndStatusNotOrderByScheduledDateAscStartTimeAsc(
                today,
                AppointmentStatus.cancelled
            )
            .stream()
            .map(a -> new UpcomingAppointmentSummary(
                a.getId(),
                a.getPaciente().getName(),
                a.getVeterinario().getFullName(),
                a.getScheduledDate(),
                a.getStartTime(),
                a.getSpecialty(),
                a.getStatus()
            ))
            .toList();

        List<RecentConsultationSummary> recentConsultations = consultationRepository
            .findTop5ByOrderByStartedAtDesc()
            .stream()
            .map(c -> new RecentConsultationSummary(
                c.getId(),
                c.getPaciente().getId(),
                c.getPaciente().getName(),
                c.getReason(),
                c.getDiagnosis(),
                c.getStatus(),
                c.getStartedAt()
            ))
            .toList();

        return new DashboardSummaryResponse(
            totalPacientes,
            citasHoy,
            consultasActivas,
            upcomingAppointments,
            recentConsultations
        );
    }
}
