package com.bobbyvetcare.api.controller;

import com.bobbyvetcare.api.dto.request.ConsultationCreateRequest;
import com.bobbyvetcare.api.dto.request.ConsultationUpdateRequest;
import com.bobbyvetcare.api.dto.response.ConsultationResponse;
import com.bobbyvetcare.api.dto.response.PageResponse;
import com.bobbyvetcare.api.entity.enums.ConsultationStatus;
import com.bobbyvetcare.api.exception.ResourceNotFoundException;
import com.bobbyvetcare.api.repository.UserRepository;
import com.bobbyvetcare.api.service.ConsultationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/consultations")
public class ConsultationController {

    private final ConsultationService consultationService;
    private final UserRepository userRepository;

    public ConsultationController(ConsultationService consultationService, UserRepository userRepository) {
        this.consultationService = consultationService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<PageResponse<ConsultationResponse>> getConsultations(
        @RequestParam(required = false) String pacienteId,
        @RequestParam(required = false) ConsultationStatus status,
        @RequestParam(required = false) String q,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(consultationService.getConsultations(pacienteId, status, q, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ConsultationResponse> getConsultationById(@PathVariable String id) {
        return ResponseEntity.ok(consultationService.getConsultationById(id));
    }

    @PostMapping
    public ResponseEntity<ConsultationResponse> startConsultation(
        @Valid @RequestBody ConsultationCreateRequest request,
        Authentication authentication
    ) {
        String email = authentication.getName();
        String veterinarioId = userRepository.findByEmailIgnoreCase(email)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario autenticado no encontrado: " + email))
            .getId();
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(consultationService.startConsultation(request, veterinarioId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ConsultationResponse> updateConsultation(
        @PathVariable String id,
        @Valid @RequestBody ConsultationUpdateRequest request
    ) {
        return ResponseEntity.ok(consultationService.updateConsultation(id, request));
    }

    @PutMapping("/{id}/close")
    public ResponseEntity<ConsultationResponse> closeConsultation(
        @PathVariable String id,
        @Valid @RequestBody ConsultationUpdateRequest request
    ) {
        return ResponseEntity.ok(consultationService.closeConsultation(id, request));
    }
}
