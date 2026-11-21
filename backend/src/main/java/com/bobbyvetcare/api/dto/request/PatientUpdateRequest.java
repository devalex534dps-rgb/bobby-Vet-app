package com.bobbyvetcare.api.dto.request;

import com.bobbyvetcare.api.entity.enums.Gender;
import com.bobbyvetcare.api.entity.enums.Species;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record PatientUpdateRequest(
    @NotBlank(message = "El nombre del paciente es obligatorio")
    @Size(max = 80, message = "El nombre del paciente no puede exceder 80 caracteres")
    String name,

    @NotNull(message = "La especie es obligatoria")
    Species species,

    @NotBlank(message = "La raza es obligatoria")
    @Size(max = 80, message = "La raza no puede exceder 80 caracteres")
    String breed,

    Gender gender,

    @Size(max = 40, message = "La edad no puede exceder 40 caracteres")
    String ageLabel,

    @DecimalMin(value = "0.01", message = "El peso debe ser mayor a 0")
    BigDecimal weightKg,

    String clinicalStatus,

    String photoUrl,

    @Size(max = 120, message = "El nombre del tutor no puede exceder 120 caracteres")
    String ownerName
) {}
