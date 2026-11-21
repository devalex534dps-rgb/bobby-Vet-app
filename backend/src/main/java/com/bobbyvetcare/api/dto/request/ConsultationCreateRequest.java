package com.bobbyvetcare.api.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

public record ConsultationCreateRequest(
    String citaId,

    @NotBlank(message = "El paciente es obligatorio")
    String pacienteId,

    @NotBlank(message = "El motivo de consulta es obligatorio")
    @Size(max = 255, message = "El motivo no puede exceder 255 caracteres")
    String reason,

    String diagnosis,

    String treatment,

    @Size(max = 255, message = "Los signos vitales no pueden exceder 255 caracteres")
    String vitals,

    List<String> servicioIds
) {}
