package com.bobbyvetcare.api.controller;

import com.bobbyvetcare.api.dto.request.TutorRequest;
import com.bobbyvetcare.api.dto.response.TutorResponse;
import com.bobbyvetcare.api.service.TutorService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/tutors")
public class TutorController {

    private final TutorService tutorService;

    public TutorController(TutorService tutorService) {
        this.tutorService = tutorService;
    }

    @GetMapping
    public ResponseEntity<List<TutorResponse>> getTutors(@RequestParam(required = false) String q) {
        return ResponseEntity.ok(tutorService.getTutors(q));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TutorResponse> getTutorById(@PathVariable String id) {
        return ResponseEntity.ok(tutorService.getTutorById(id));
    }

    @PostMapping
    public ResponseEntity<TutorResponse> createTutor(@Valid @RequestBody TutorRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(tutorService.createTutor(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TutorResponse> updateTutor(
        @PathVariable String id,
        @Valid @RequestBody TutorRequest request
    ) {
        return ResponseEntity.ok(tutorService.updateTutor(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> softDeleteTutor(@PathVariable String id) {
        tutorService.softDeleteTutor(id);
        return ResponseEntity.noContent().build();
    }
}
