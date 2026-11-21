package com.bobbyvetcare.api.dto.response;

import com.bobbyvetcare.api.entity.enums.AppointmentSpecialty;
import com.bobbyvetcare.api.entity.enums.AppointmentStatus;
import com.bobbyvetcare.api.entity.enums.Species;
import java.time.LocalDate;
import java.time.LocalTime;

public record AppointmentResponse(
    String id,
    String folio,
    String pacienteId,
    String pacienteName,
    Species species,
    String breed,
    String tutorName,
    String veterinarioId,
    String veterinarioName,
    LocalDate scheduledDate,
    LocalTime startTime,
    LocalTime endTime,
    AppointmentSpecialty specialty,
    AppointmentStatus status,
    String notes
) {}
