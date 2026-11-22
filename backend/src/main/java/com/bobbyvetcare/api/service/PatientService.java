package com.bobbyvetcare.api.service;

import com.bobbyvetcare.api.dto.request.PatientCreateRequest;
import com.bobbyvetcare.api.dto.request.PatientUpdateRequest;
import com.bobbyvetcare.api.dto.response.PageResponse;
import com.bobbyvetcare.api.dto.response.PatientResponse;
import com.bobbyvetcare.api.entity.PatientEntity;
import com.bobbyvetcare.api.entity.TutorEntity;
import com.bobbyvetcare.api.entity.enums.Species;
import com.bobbyvetcare.api.exception.BadRequestException;
import com.bobbyvetcare.api.exception.ResourceNotFoundException;
import com.bobbyvetcare.api.repository.PatientRepository;
import com.bobbyvetcare.api.repository.TutorRepository;
import java.time.LocalDateTime;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class PatientService {

    private final PatientRepository patientRepository;
    private final TutorRepository tutorRepository;

    public PatientService(PatientRepository patientRepository, TutorRepository tutorRepository) {
        this.patientRepository = patientRepository;
        this.tutorRepository = tutorRepository;
    }

    public PageResponse<PatientResponse> getPatients(Species species, String status, String q, int page, int size) {
        String normalizedStatus = (status != null && !status.isBlank()) ? status.trim() : null;
        String normalizedQ = (q != null && !q.isBlank()) ? q.trim() : null;

        Page<PatientEntity> result = patientRepository.searchPatients(
            species,
            normalizedStatus,
            normalizedQ,
            PageRequest.of(page, size)
        );
        return new PageResponse<>(
            result.getContent().stream().map(this::toResponse).toList(),
            result.getNumber(),
            result.getSize(),
            result.getTotalElements(),
            result.getTotalPages()
        );
    }

    public PatientResponse getPatientById(String id) {
        PatientEntity patient = patientRepository.findByIdAndDeletedAtIsNull(id)
            .orElseThrow(() -> new ResourceNotFoundException("Paciente no encontrado: " + id));
        return toResponse(patient);
    }

    @Transactional
    public PatientResponse createPatient(PatientCreateRequest request) {
        TutorEntity tutor = resolveOrCreateTutor(request);

        PatientEntity patient = new PatientEntity();
        patient.setTutor(tutor);
        patient.setName(request.name().trim());
        patient.setSpecies(request.species());
        patient.setBreed(request.breed().trim());
        patient.setGender(request.gender());
        patient.setAgeLabel(request.ageLabel() != null ? request.ageLabel().trim() : null);
        patient.setWeightKg(request.weightKg());
        patient.setClinicalStatus(
            (request.clinicalStatus() != null && !request.clinicalStatus().isBlank())
                ? request.clinicalStatus().trim()
                : "Al día"
        );
        patient.setPhotoUrl(request.photoUrl());

        return toResponse(patientRepository.save(patient));
    }

    @Transactional
    public PatientResponse updatePatient(String id, PatientUpdateRequest request) {
        PatientEntity patient = patientRepository.findByIdAndDeletedAtIsNull(id)
            .orElseThrow(() -> new ResourceNotFoundException("Paciente no encontrado: " + id));

        patient.setName(request.name().trim());
        patient.setSpecies(request.species());
        patient.setBreed(request.breed().trim());
        patient.setGender(request.gender());
        patient.setAgeLabel(request.ageLabel() != null ? request.ageLabel().trim() : null);
        patient.setWeightKg(request.weightKg());
        if (request.clinicalStatus() != null && !request.clinicalStatus().isBlank()) {
            patient.setClinicalStatus(request.clinicalStatus().trim());
        }
        if (request.photoUrl() != null) {
            patient.setPhotoUrl(request.photoUrl());
        }
        if (request.ownerName() != null && !request.ownerName().isBlank() && patient.getTutor() != null) {
            patient.getTutor().setFullName(request.ownerName().trim());
        }
        if (request.ownerPhone() != null && !request.ownerPhone().isBlank() && patient.getTutor() != null) {
            patient.getTutor().setPhone(request.ownerPhone().trim());
        }

        return toResponse(patientRepository.save(patient));
    }

    @Transactional
    public void softDeletePatient(String id) {
        PatientEntity patient = patientRepository.findByIdAndDeletedAtIsNull(id)
            .orElseThrow(() -> new ResourceNotFoundException("Paciente no encontrado: " + id));
        patient.setDeletedAt(LocalDateTime.now());
        patientRepository.save(patient);
    }

    private TutorEntity resolveOrCreateTutor(PatientCreateRequest request) {
        if (request.tutorId() != null && !request.tutorId().isBlank()) {
            return tutorRepository.findByIdAndDeletedAtIsNull(request.tutorId().trim())
                .orElseThrow(() -> new ResourceNotFoundException("Tutor no encontrado: " + request.tutorId()));
        }
        if (request.ownerName() == null || request.ownerName().isBlank()
            || request.ownerPhone() == null || request.ownerPhone().isBlank()) {
            throw new BadRequestException("Debe indicar un tutorId existente o proporcionar ownerName y ownerPhone");
        }
        TutorEntity newTutor = new TutorEntity();
        newTutor.setFullName(request.ownerName().trim());
        newTutor.setPhone(request.ownerPhone().trim());
        newTutor.setEmail(request.ownerEmail() != null ? request.ownerEmail().trim().toLowerCase() : null);
        return tutorRepository.save(newTutor);
    }

    public PatientResponse toResponse(PatientEntity patient) {
        TutorEntity tutor = patient.getTutor();
        return new PatientResponse(
            patient.getId(),
            tutor.getId(),
            patient.getName(),
            patient.getSpecies(),
            patient.getBreed(),
            patient.getGender(),
            patient.getAgeLabel(),
            patient.getWeightKg(),
            patient.getClinicalStatus(),
            patient.getPhotoUrl(),
            tutor.getFullName(),
            tutor.getPhone()
        );
    }
}
