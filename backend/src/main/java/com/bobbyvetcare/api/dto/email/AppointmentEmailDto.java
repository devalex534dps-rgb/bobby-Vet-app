package com.bobbyvetcare.api.dto.email;

import com.bobbyvetcare.api.entity.AppointmentEntity;
import com.bobbyvetcare.api.entity.PatientEntity;
import com.bobbyvetcare.api.entity.TutorEntity;
import com.bobbyvetcare.api.entity.UserEntity;
import com.bobbyvetcare.api.entity.enums.AppointmentSpecialty;
import java.time.LocalDate;
import java.time.LocalTime;

public record AppointmentEmailDto(
    String appointmentId,
    String folio,
    String tutorFullName,
    String tutorEmail,
    String patientName,
    String patientSpecies,
    String patientBreed,
    String veterinarianFullName,
    LocalDate scheduledDate,
    LocalTime startTime,
    LocalTime endTime,
    AppointmentSpecialty specialty,
    String notes
) {

    public static AppointmentEmailDto fromEntity(AppointmentEntity appointment) {
        PatientEntity patient = appointment.getPaciente();
        TutorEntity tutor = patient != null ? patient.getTutor() : null;
        UserEntity vet = appointment.getVeterinario();

        return new AppointmentEmailDto(
            appointment.getId(),
            appointment.getFolio(),
            tutor != null ? tutor.getFullName() : "Tutor",
            tutor != null ? tutor.getEmail() : null,
            patient != null ? patient.getName() : "Paciente",
            patient != null && patient.getSpecies() != null ? patient.getSpecies().name() : "",
            patient != null ? patient.getBreed() : "",
            vet != null ? vet.getFullName() : "Veterinario asignado",
            appointment.getScheduledDate(),
            appointment.getStartTime(),
            appointment.getEndTime(),
            appointment.getSpecialty(),
            appointment.getNotes()
        );
    }
}
