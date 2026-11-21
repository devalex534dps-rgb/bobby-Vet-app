package com.bobbyvetcare.api.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserUpdateRequest(
    @NotBlank(message = "El nombre completo es obligatorio")
    @Size(max = 120, message = "El nombre no puede exceder 120 caracteres")
    String fullName,

    @Size(max = 30, message = "El teléfono no puede exceder 30 caracteres")
    String phone,

    @NotBlank(message = "El rol es obligatorio")
    String roleName,

    Boolean active
) {}
