package com.bobbyvetcare.api.controller;

import com.bobbyvetcare.api.dto.request.AppointmentCreateRequest;
import com.bobbyvetcare.api.dto.request.AppointmentStatusUpdateRequest;
import com.bobbyvetcare.api.dto.response.AppointmentResponse;
import com.bobbyvetcare.api.dto.response.PageResponse;
import com.bobbyvetcare.api.entity.enums.AppointmentStatus;
import com.bobbyvetcare.api.service.AppointmentService;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.Map;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @GetMapping
    public ResponseEntity<PageResponse<AppointmentResponse>> getAppointments(
        @RequestParam(required = false) AppointmentStatus status,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
        @RequestParam(required = false) String q,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(appointmentService.getAppointments(status, date, q, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AppointmentResponse> getAppointmentById(@PathVariable String id) {
        return ResponseEntity.ok(appointmentService.getAppointmentById(id));
    }

    @PostMapping
    public ResponseEntity<AppointmentResponse> createAppointment(@Valid @RequestBody AppointmentCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(appointmentService.createAppointment(request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<AppointmentResponse> updateAppointmentStatus(
        @PathVariable String id,
        @Valid @RequestBody AppointmentStatusUpdateRequest request
    ) {
        return ResponseEntity.ok(appointmentService.updateAppointmentStatus(id, request));
    }

    @PutMapping("/{id}/reschedule")
    public ResponseEntity<AppointmentResponse> rescheduleAppointment(
        @PathVariable String id,
        @Valid @RequestBody AppointmentCreateRequest request
    ) {
        return ResponseEntity.ok(appointmentService.rescheduleAppointment(id, request));
    }

    @PostMapping("/{id}/reminder")
    public ResponseEntity<AppointmentResponse> sendAppointmentReminder(@PathVariable String id) {
        return ResponseEntity.ok(appointmentService.sendAppointmentReminder(id));
    }

    @PostMapping("/reminders/trigger-24h")
    public ResponseEntity<Map<String, Object>> trigger24hReminders() {
        int count = appointmentService.process24HourReminders();
        return ResponseEntity.ok(Map.of("status", "ok", "dispatched", count, "type", "24_HOURS"));
    }

    @PostMapping("/reminders/trigger-2h")
    public ResponseEntity<Map<String, Object>> trigger2hReminders() {
        int count = appointmentService.process2HourReminders();
        return ResponseEntity.ok(Map.of("status", "ok", "dispatched", count, "type", "2_HOURS"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable String id) {
        appointmentService.deleteAppointment(id);
        return ResponseEntity.noContent().build();
    }
}
