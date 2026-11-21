package com.bobbyvetcare.api.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record ServiceRequest(
    @NotBlank(message = "El nombre del servicio es obligatorio")
    @Size(max = 120, message = "El nombre no puede exceder 120 caracteres")
    String name,

    @NotBlank(message = "La categoría es obligatoria")
    @Size(max = 60, message = "La categoría no puede exceder 60 caracteres")
    String category,

    @NotNull(message = "El precio es obligatorio")
    @DecimalMin(value = "0.00", message = "El precio no puede ser negativo")
    BigDecimal price,

    @Size(max = 255, message = "La descripción no puede exceder 255 caracteres")
    String description
) {}
