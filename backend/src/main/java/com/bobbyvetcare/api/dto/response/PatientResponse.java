package com.bobbyvetcare.api.dto.response;

import com.bobbyvetcare.api.entity.enums.Gender;
import com.bobbyvetcare.api.entity.enums.Species;
import java.math.BigDecimal;

public record PatientResponse(
    String id,
    String tutorId,
    String name,
    Species species,
    String breed,
    Gender gender,
    String ageLabel,
    BigDecimal weightKg,
    String clinicalStatus,
    String photoUrl,
    String ownerName,
    String ownerContact
) {}
