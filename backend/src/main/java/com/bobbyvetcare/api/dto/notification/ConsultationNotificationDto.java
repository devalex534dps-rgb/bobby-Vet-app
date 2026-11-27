package com.bobbyvetcare.api.dto.notification;

import com.bobbyvetcare.api.entity.AppointmentEntity;
import com.bobbyvetcare.api.entity.ConsultationEntity;
import com.bobbyvetcare.api.entity.PatientEntity;
import com.bobbyvetcare.api.entity.TutorEntity;
import com.bobbyvetcare.api.entity.UserEntity;
import java.time.LocalDateTime;

/**
 * Datos desacoplados de la sesión JPA para enviar notificaciones asíncronas de consultas médicas.
 */
public record ConsultationNotificationDto(
    String consultationId,
    String appointmentFolio,
    String patientName,
    String tutorName,
    String tutorPhone,
    String veterinarianName,
    LocalDateTime consultationDate,
    String diagnosis,
    String recommendation
) {

    public static ConsultationNotificationDto fromEntity(ConsultationEntity consultation) {
        PatientEntity patient = consultation.getPaciente();
        TutorEntity tutor = patient != null ? patient.getTutor() : null;
        UserEntity vet = consultation.getVeterinario();
        AppointmentEntity appointment = consultation.getCita();

        return new ConsultationNotificationDto(
            consultation.getId(),
            appointment != null ? appointment.getFolio() : null,
            patient != null ? patient.getName() : "Mascota",
            tutor != null ? tutor.getFullName() : "Tutor",
            tutor != null ? tutor.getPhone() : null,
            vet != null ? vet.getFullName() : "Médico veterinario",
            consultation.getFinishedAt() != null ? consultation.getFinishedAt() : consultation.getStartedAt(),
            consultation.getDiagnosis(),
            consultation.getTreatment()
        );
    }
}
