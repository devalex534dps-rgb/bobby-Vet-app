package com.bobbyvetcare.api.dto.request;

import com.bobbyvetcare.api.entity.enums.AppointmentSpecialty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;

public record AppointmentCreateRequest(
    @NotBlank(message = "El paciente es obligatorio")
    String pacienteId,

    @NotBlank(message = "El veterinario es obligatorio")
    String veterinarioId,

    @NotNull(message = "La fecha programada es obligatoria")
    LocalDate scheduledDate,

    @NotNull(message = "La hora de inicio es obligatoria")
    LocalTime startTime,

    @NotNull(message = "La hora de fin es obligatoria")
    LocalTime endTime,

    @NotNull(message = "La especialidad es obligatoria")
    AppointmentSpecialty specialty,

    String notes
) {}
