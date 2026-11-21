package com.bobbyvetcare.api.dto.response;

import com.bobbyvetcare.api.entity.enums.AppointmentSpecialty;
import com.bobbyvetcare.api.entity.enums.AppointmentStatus;
import com.bobbyvetcare.api.entity.enums.Species;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public record FolioLookupResponse(
    String folio,
    String pacienteName,
    Species species,
    String breed,
    String tutorName,
    NextAppointmentSummary nextAppointment,
    List<ConsultationSummary> consultations
) {
    public record NextAppointmentSummary(
        LocalDate scheduledDate,
        LocalTime startTime,
        LocalTime endTime,
        String veterinarioName,
        AppointmentSpecialty specialty,
        AppointmentStatus status
    ) {}

    public record ConsultationSummary(
        String id,
        LocalDateTime startedAt,
        String reason,
        String diagnosis,
        String treatment,
        String veterinarioName,
        List<String> servicios
    ) {}
}
