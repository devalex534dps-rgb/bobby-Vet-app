package com.bobbyvetcare.api.dto.request;

import com.bobbyvetcare.api.entity.enums.AppointmentStatus;
import jakarta.validation.constraints.NotNull;

public record AppointmentStatusUpdateRequest(
    @NotNull(message = "El estado de la cita es obligatorio")
    AppointmentStatus status
) {}
