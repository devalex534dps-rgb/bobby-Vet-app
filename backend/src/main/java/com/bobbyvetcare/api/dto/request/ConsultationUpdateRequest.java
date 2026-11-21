package com.bobbyvetcare.api.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

public record ConsultationUpdateRequest(
    @Size(max = 255, message = "El motivo no puede exceder 255 caracteres")
    String reason,

    @NotBlank(message = "El diagnóstico es obligatorio")
    String diagnosis,

    String treatment,

    @Size(max = 255, message = "Los signos vitales no pueden exceder 255 caracteres")
    String vitals,

    List<String> servicioIds
) {}
