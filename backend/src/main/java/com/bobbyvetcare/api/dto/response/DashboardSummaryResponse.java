package com.bobbyvetcare.api.dto.response;

import com.bobbyvetcare.api.entity.enums.AppointmentSpecialty;
import com.bobbyvetcare.api.entity.enums.AppointmentStatus;
import com.bobbyvetcare.api.entity.enums.ConsultationStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public record DashboardSummaryResponse(
    long totalPacientes,
    long citasHoy,
    long consultasActivas,
    List<UpcomingAppointmentSummary> upcomingAppointments,
    List<RecentConsultationSummary> recentConsultations
) {
    public record UpcomingAppointmentSummary(
        String id,
        String pacienteName,
        String veterinarioName,
        LocalDate scheduledDate,
        LocalTime startTime,
        AppointmentSpecialty specialty,
        AppointmentStatus status
    ) {}

    public record RecentConsultationSummary(
        String id,
        String pacienteId,
        String pacienteName,
        String reason,
        String diagnosis,
        ConsultationStatus status,
        LocalDateTime startedAt
    ) {}
}
