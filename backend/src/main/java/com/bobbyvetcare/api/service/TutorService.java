package com.bobbyvetcare.api.service;

import com.bobbyvetcare.api.dto.request.TutorRequest;
import com.bobbyvetcare.api.dto.response.TutorResponse;
import com.bobbyvetcare.api.entity.TutorEntity;
import com.bobbyvetcare.api.entity.UserEntity;
import com.bobbyvetcare.api.exception.ResourceNotFoundException;
import com.bobbyvetcare.api.repository.TutorRepository;
import com.bobbyvetcare.api.repository.UserRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class TutorService {

    private final TutorRepository tutorRepository;
    private final UserRepository userRepository;

    public TutorService(TutorRepository tutorRepository, UserRepository userRepository) {
        this.tutorRepository = tutorRepository;
        this.userRepository = userRepository;
    }

    public List<TutorResponse> getTutors(String q) {
        String normalizedQ = (q != null && !q.isBlank()) ? q.trim() : null;
        return tutorRepository.searchActiveTutors(normalizedQ)
            .stream()
            .map(this::toResponse)
            .toList();
    }

    public TutorResponse getTutorById(String id) {
        TutorEntity tutor = tutorRepository.findByIdAndDeletedAtIsNull(id)
            .orElseThrow(() -> new ResourceNotFoundException("Tutor no encontrado: " + id));
        return toResponse(tutor);
    }

    @Transactional
    public TutorResponse createTutor(TutorRequest request) {
        TutorEntity tutor = new TutorEntity();
        if (request.usuarioId() != null && !request.usuarioId().isBlank()) {
            UserEntity user = userRepository.findById(request.usuarioId().trim())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + request.usuarioId()));
            tutor.setUsuario(user);
        }
        tutor.setFullName(request.fullName().trim());
        tutor.setPhone(request.phone().trim());
        tutor.setEmail(request.email() != null ? request.email().trim().toLowerCase() : null);
        tutor.setAddress(request.address() != null ? request.address().trim() : null);

        return toResponse(tutorRepository.save(tutor));
    }

    @Transactional
    public TutorResponse updateTutor(String id, TutorRequest request) {
        TutorEntity tutor = tutorRepository.findByIdAndDeletedAtIsNull(id)
            .orElseThrow(() -> new ResourceNotFoundException("Tutor no encontrado: " + id));
        tutor.setFullName(request.fullName().trim());
        tutor.setPhone(request.phone().trim());
        tutor.setEmail(request.email() != null ? request.email().trim().toLowerCase() : null);
        tutor.setAddress(request.address() != null ? request.address().trim() : null);

        return toResponse(tutorRepository.save(tutor));
    }

    @Transactional
    public void softDeleteTutor(String id) {
        TutorEntity tutor = tutorRepository.findByIdAndDeletedAtIsNull(id)
            .orElseThrow(() -> new ResourceNotFoundException("Tutor no encontrado: " + id));
        tutor.setDeletedAt(LocalDateTime.now());
        tutorRepository.save(tutor);
    }

    public TutorResponse toResponse(TutorEntity tutor) {
        return new TutorResponse(
            tutor.getId(),
            tutor.getFullName(),
            tutor.getPhone(),
            tutor.getEmail(),
            tutor.getAddress()
        );
    }
}
