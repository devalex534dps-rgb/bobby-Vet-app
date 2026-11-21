package com.bobbyvetcare.api.dto.response;

import com.bobbyvetcare.api.entity.enums.ConsultationStatus;
import java.time.LocalDateTime;
import java.util.List;

public record ConsultationResponse(
    String id,
    String citaId,
    String pacienteId,
    String pacienteName,
    String veterinarioId,
    String veterinarioName,
    ConsultationStatus status,
    String reason,
    String diagnosis,
    String treatment,
    String vitals,
    LocalDateTime startedAt,
    LocalDateTime finishedAt,
    List<ServiceResponse> servicios
) {}
