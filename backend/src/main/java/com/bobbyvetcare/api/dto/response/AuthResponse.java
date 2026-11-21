package com.bobbyvetcare.api.dto.response;

public record AuthResponse(
    String token,
    String tokenType,
    UserResponse user
) {}
