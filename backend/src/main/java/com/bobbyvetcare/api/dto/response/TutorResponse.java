package com.bobbyvetcare.api.dto.response;

public record TutorResponse(
    String id,
    String fullName,
    String phone,
    String email,
    String address
) {}
