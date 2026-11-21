package com.bobbyvetcare.api.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record TutorRequest(
    String usuarioId,

    @NotBlank(message = "El nombre del tutor es obligatorio")
    @Size(max = 120, message = "El nombre no puede exceder 120 caracteres")
    String fullName,

    @NotBlank(message = "El teléfono es obligatorio")
    @Size(max = 30, message = "El teléfono no puede exceder 30 caracteres")
    String phone,

    @Email(message = "El correo electrónico no tiene un formato válido")
    @Size(max = 150, message = "El correo no puede exceder 150 caracteres")
    String email,

    String address
) {}
