package com.bobbyvetcare.api.dto.response;

public record UserResponse(
    String id,
    String fullName,
    String email,
    String phone,
    String role,
    String avatarUrl,
    boolean active
) {}
