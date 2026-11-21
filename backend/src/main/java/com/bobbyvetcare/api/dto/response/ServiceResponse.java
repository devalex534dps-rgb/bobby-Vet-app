package com.bobbyvetcare.api.dto.response;

import java.math.BigDecimal;

public record ServiceResponse(
    String id,
    String name,
    String category,
    BigDecimal price,
    String description
) {}
