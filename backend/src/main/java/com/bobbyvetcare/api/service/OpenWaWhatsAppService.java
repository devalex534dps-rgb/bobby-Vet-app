package com.bobbyvetcare.api.service;

import com.bobbyvetcare.api.config.OpenWaConfig;
import com.bobbyvetcare.api.dto.notification.ConsultationNotificationDto;
import com.bobbyvetcare.api.dto.response.AppointmentResponse;
import com.bobbyvetcare.api.entity.enums.AppointmentSpecialty;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;

/**
 * Servicio asíncrono para el envío de notificaciones de citas vía OpenWA (Baileys REST API).
 */
@Service
public class OpenWaWhatsAppService {

    private static final Logger log = LoggerFactory.getLogger(OpenWaWhatsAppService.class);

    private static final String LOG_PREFIX_WHATSAPP = "WHATSAPP_EVENT";
    private static final String LOG_PREFIX_APPOINTMENT = "APPOINTMENT_EVENT";
    private static final String LOG_PREFIX_CONSULTATION = "CONSULTATION_EVENT";

    private static final String EVENT_APPOINTMENT_CREATED = "APPOINTMENT_CREATED";
    private static final String EVENT_CONFIRMATION = "WHATSAPP_APPOINTMENT_CONFIRMATION";
    private static final String EVENT_REMINDER = "WHATSAPP_APPOINTMENT_REMINDER";
    private static final String EVENT_CANCELLED = "WHATSAPP_APPOINTMENT_CANCELLED";
    private static final String EVENT_RESCHEDULED = "WHATSAPP_APPOINTMENT_RESCHEDULED";
    private static final String EVENT_CONSULTATION_CREATED = "CONSULTATION_CREATED";
    private static final String EVENT_CONSULTATION_COMPLETED = "CONSULTATION_COMPLETED";

    private static final DateTimeFormatter DATE_FORMATTER =
        DateTimeFormatter.ofPattern("dd 'de' MMMM 'de' yyyy", Locale.forLanguageTag("es-MX"));
    private static final DateTimeFormatter DATE_TIME_FORMATTER =
        DateTimeFormatter.ofPattern("dd 'de' MMMM 'de' yyyy 'a las' HH:mm 'hrs'", Locale.forLanguageTag("es-MX"));
    private static final DateTimeFormatter TIME_FORMATTER =
        DateTimeFormatter.ofPattern("HH:mm");

    private final OpenWaConfig openWaConfig;
    private final RestClient restClient;

    public OpenWaWhatsAppService(
        OpenWaConfig openWaConfig,
        @Qualifier("openWaRestClient") RestClient restClient
    ) {
        this.openWaConfig = openWaConfig;
        this.restClient = restClient;
    }

    @Async("whatsAppTaskExecutor")
    public void sendAppointmentCreated(AppointmentResponse appointment, String tutorPhone) {
        if (!canSendMessage(appointment, tutorPhone, EVENT_APPOINTMENT_CREATED, LOG_PREFIX_APPOINTMENT)) {
            return;
        }
        String body = buildConfirmationMessage(appointment);
        dispatchWhatsAppMessage(
            LOG_PREFIX_APPOINTMENT,
            appointment.id(),
            appointment.folio(),
            tutorPhone,
            EVENT_APPOINTMENT_CREATED,
            body
        );
    }

    @Async("whatsAppTaskExecutor")
    public void sendAppointmentConfirmation(AppointmentResponse appointment, String tutorPhone) {
        if (!canSendMessage(appointment, tutorPhone, EVENT_CONFIRMATION, LOG_PREFIX_WHATSAPP)) {
            return;
        }
        String body = buildConfirmationMessage(appointment);
        dispatchWhatsAppMessage(
            LOG_PREFIX_WHATSAPP,
            appointment.id(),
            appointment.folio(),
            tutorPhone,
            EVENT_CONFIRMATION,
            body
        );
    }

    @Async("whatsAppTaskExecutor")
    public void sendAppointmentReminder(AppointmentResponse appointment, String tutorPhone) {
        if (!canSendMessage(appointment, tutorPhone, EVENT_REMINDER, LOG_PREFIX_WHATSAPP)) {
            return;
        }
        String body = buildReminderMessage(appointment);
        dispatchWhatsAppMessage(
            LOG_PREFIX_WHATSAPP,
            appointment.id(),
            appointment.folio(),
            tutorPhone,
            EVENT_REMINDER,
            body
        );
    }

    @Async("whatsAppTaskExecutor")
    public void sendAppointmentReminder24h(AppointmentResponse appointment, String tutorPhone) {
        if (!canSendMessage(appointment, tutorPhone, EVENT_REMINDER + "_24H", LOG_PREFIX_WHATSAPP)) {
            return;
        }
        String body = buildReminder24hMessage(appointment);
        dispatchWhatsAppMessage(
            LOG_PREFIX_WHATSAPP,
            appointment.id(),
            appointment.folio(),
            tutorPhone,
            EVENT_REMINDER + "_24H",
            body
        );
    }

    @Async("whatsAppTaskExecutor")
    public void sendAppointmentReminder2h(AppointmentResponse appointment, String tutorPhone) {
        if (!canSendMessage(appointment, tutorPhone, EVENT_REMINDER + "_2H", LOG_PREFIX_WHATSAPP)) {
            return;
        }
        String body = buildReminder2hMessage(appointment);
        dispatchWhatsAppMessage(
            LOG_PREFIX_WHATSAPP,
            appointment.id(),
            appointment.folio(),
            tutorPhone,
            EVENT_REMINDER + "_2H",
            body
        );
    }

    @Async("whatsAppTaskExecutor")
    public void sendAppointmentCancellation(AppointmentResponse appointment, String tutorPhone) {
        if (!canSendMessage(appointment, tutorPhone, EVENT_CANCELLED, LOG_PREFIX_WHATSAPP)) {
            return;
        }
        String body = buildCancellationMessage(appointment);
        dispatchWhatsAppMessage(
            LOG_PREFIX_WHATSAPP,
            appointment.id(),
            appointment.folio(),
            tutorPhone,
            EVENT_CANCELLED,
            body
        );
    }

    @Async("whatsAppTaskExecutor")
    public void sendAppointmentRescheduled(AppointmentResponse appointment, String tutorPhone) {
        if (!canSendMessage(appointment, tutorPhone, EVENT_RESCHEDULED, LOG_PREFIX_WHATSAPP)) {
            return;
        }
        String body = buildRescheduledMessage(appointment);
        dispatchWhatsAppMessage(
            LOG_PREFIX_WHATSAPP,
            appointment.id(),
            appointment.folio(),
            tutorPhone,
            EVENT_RESCHEDULED,
            body
        );
    }

    @Async("whatsAppTaskExecutor")
    public void sendConsultationCreated(ConsultationNotificationDto consultation) {
        if (!canSendConsultationMessage(consultation, EVENT_CONSULTATION_CREATED)) {
            return;
        }
        String body = buildConsultationCreatedMessage(consultation);
        dispatchWhatsAppMessage(
            LOG_PREFIX_CONSULTATION,
            consultation.consultationId(),
            safeFolio(consultation.appointmentFolio()),
            consultation.tutorPhone(),
            EVENT_CONSULTATION_CREATED,
            body
        );
    }

    @Async("whatsAppTaskExecutor")
    public void sendConsultationCompleted(ConsultationNotificationDto consultation) {
        if (!canSendConsultationMessage(consultation, EVENT_CONSULTATION_COMPLETED)) {
            return;
        }
        String body = buildConsultationCompletedMessage(consultation);
        dispatchWhatsAppMessage(
            LOG_PREFIX_CONSULTATION,
            consultation.consultationId(),
            safeFolio(consultation.appointmentFolio()),
            consultation.tutorPhone(),
            EVENT_CONSULTATION_COMPLETED,
            body
        );
    }

    private void dispatchWhatsAppMessage(
        String logPrefix,
        String entityId,
        String folio,
        String rawPhone,
        String eventType,
        String messageBody
    ) {
        String chatId = formatOpenWaChatId(rawPhone);
        if (chatId == null) {
            log.warn(
                "[{}_SKIPPED] type={}, entityId={}, folio={}, rawPhone={}, reason=Número telefónico inválido para formato OpenWA",
                logPrefix,
                eventType,
                entityId,
                folio,
                rawPhone
            );
            return;
        }

        log.info(
            "[{}_START] type={}, entityId={}, folio={}, to={}, sessionId={}",
            logPrefix,
            eventType,
            entityId,
            folio,
            chatId,
            openWaConfig.getSessionId()
        );

        try {
            Map<String, String> payload = Map.of(
                "chatId", chatId,
                "text", messageBody
            );

            ResponseEntity<String> response = restClient.post()
                .uri(openWaConfig.getSendTextEndpointUrl())
                .contentType(MediaType.APPLICATION_JSON)
                .header("X-API-Key", openWaConfig.getApiKey())
                .body(payload)
                .retrieve()
                .toEntity(String.class);

            log.info(
                "[{}_SUCCESS] type={}, entityId={}, folio={}, to={}, statusCode={}, response={}",
                logPrefix,
                eventType,
                entityId,
                folio,
                chatId,
                response.getStatusCode().value(),
                response.getBody()
            );
        } catch (RestClientResponseException ex) {
            log.error(
                "[{}_FAILURE] type={}, entityId={}, folio={}, to={}, statusCode={}, responseBody={}, error={}",
                logPrefix,
                eventType,
                entityId,
                folio,
                chatId,
                ex.getStatusCode().value(),
                ex.getResponseBodyAsString(),
                ex.getMessage(),
                ex
            );
        } catch (RestClientException ex) {
            log.error(
                "[{}_FAILURE] type={}, entityId={}, folio={}, to={}, error={}",
                logPrefix,
                eventType,
                entityId,
                folio,
                chatId,
                ex.getMessage(),
                ex
            );
        } catch (Exception ex) {
            log.error(
                "[{}_UNEXPECTED_ERROR] type={}, entityId={}, folio={}, to={}, error={}",
                logPrefix,
                eventType,
                entityId,
                folio,
                chatId,
                ex.getMessage(),
                ex
            );
        }
    }

    private boolean canSendMessage(
        AppointmentResponse appointment,
        String tutorPhone,
        String eventType,
        String logPrefix
    ) {
        if (appointment == null) {
            log.warn("[{}_SKIPPED] type={}, reason=Datos de cita nulos", logPrefix, eventType);
            return false;
        }
        return hasValidConfigAndPhone(appointment.id(), appointment.folio(), tutorPhone, eventType, logPrefix);
    }

    private boolean canSendConsultationMessage(ConsultationNotificationDto consultation, String eventType) {
        if (consultation == null) {
            log.warn("[{}_SKIPPED] type={}, reason=Datos de consulta nulos", LOG_PREFIX_CONSULTATION, eventType);
            return false;
        }
        return hasValidConfigAndPhone(
            consultation.consultationId(),
            safeFolio(consultation.appointmentFolio()),
            consultation.tutorPhone(),
            eventType,
            LOG_PREFIX_CONSULTATION
        );
    }

    private boolean hasValidConfigAndPhone(
        String entityId,
        String folio,
        String tutorPhone,
        String eventType,
        String logPrefix
    ) {
        if (!openWaConfig.isConfigured()) {
            log.warn(
                "[{}_SKIPPED] type={}, entityId={}, folio={}, reason=Credenciales o configuración de OpenWA incompleta",
                logPrefix,
                eventType,
                entityId,
                folio
            );
            return false;
        }
        if (tutorPhone == null || tutorPhone.isBlank()) {
            log.warn(
                "[{}_SKIPPED] type={}, entityId={}, folio={}, reason=El tutor no tiene teléfono registrado",
                logPrefix,
                eventType,
                entityId,
                folio
            );
            return false;
        }
        return true;
    }

    private String formatOpenWaChatId(String rawPhone) {
        if (rawPhone == null || rawPhone.isBlank()) {
            return null;
        }
        String trimmed = rawPhone.trim();
        if (trimmed.endsWith("@g.us")) {
            return trimmed;
        }
        if (trimmed.startsWith("whatsapp:")) {
            trimmed = trimmed.substring("whatsapp:".length()).trim();
        }
        if (trimmed.endsWith("@c.us")) {
            trimmed = trimmed.substring(0, trimmed.length() - "@c.us".length());
        } else if (trimmed.endsWith("@s.whatsapp.net")) {
            trimmed = trimmed.substring(0, trimmed.length() - "@s.whatsapp.net".length());
        }

        String digits = trimmed.replaceAll("[^0-9]", "");
        if (digits.isEmpty()) {
            return null;
        }
        if ((digits.startsWith("044") || digits.startsWith("045")) && digits.length() == 13) {
            digits = digits.substring(3);
        }
        if (digits.length() == 10) {
            digits = "52" + digits;
        }
        if (digits.length() < 10 || digits.length() > 15) {
            return null;
        }
        return digits + "@c.us";
    }

    private String buildConfirmationMessage(AppointmentResponse appointment) {
        return """
            *Bobby VetCare - Confirmación de Cita*

            Hola *%s*, tu cita ha sido confirmada exitosamente.

            • *Folio:* %s
            • *Paciente:* %s (%s - %s)
            • *Fecha:* %s
            • *Horario:* %s - %s hrs
            • *Especialidad:* %s
            • *Veterinario:* %s

            Te recomendamos acudir 10 minutos antes de tu cita.
            """.formatted(
            safeText(appointment.tutorName()),
            safeText(appointment.folio()),
            safeText(appointment.pacienteName()),
            appointment.species() != null ? appointment.species().name() : "",
            safeText(appointment.breed()),
            formatDate(appointment),
            formatStartTime(appointment),
            formatEndTime(appointment),
            formatSpecialty(appointment.specialty()),
            safeText(appointment.veterinarioName())
        ).trim();
    }

    private String buildReminderMessage(AppointmentResponse appointment) {
        return """
            *Bobby VetCare - Recordatorio de Cita*

            Hola *%s*, te recordamos la próxima cita médica de tu mascota.

            • *Folio:* %s
            • *Paciente:* %s (%s - %s)
            • *Fecha:* %s
            • *Horario:* %s - %s hrs
            • *Especialidad:* %s
            • *Veterinario:* %s

            Por favor llega 10 minutos antes y trae su cartilla de vacunación si aplica.
            """.formatted(
            safeText(appointment.tutorName()),
            safeText(appointment.folio()),
            safeText(appointment.pacienteName()),
            appointment.species() != null ? appointment.species().name() : "",
            safeText(appointment.breed()),
            formatDate(appointment),
            formatStartTime(appointment),
            formatEndTime(appointment),
            formatSpecialty(appointment.specialty()),
            safeText(appointment.veterinarioName())
        ).trim();
    }

    private String buildReminder24hMessage(AppointmentResponse appointment) {
        return """
            *Bobby VetCare - Recordatorio de Cita (Mañana / 24 Horas)*

            Hola *%s*, te recordamos que tienes una cita médica programada para *mañana* para tu mascota.

            • *Folio:* %s
            • *Paciente:* %s (%s - %s)
            • *Fecha:* %s
            • *Horario:* %s - %s hrs
            • *Especialidad:* %s
            • *Veterinario:* %s

            Por favor acude 10 minutos antes con su cartilla de vacunación. Si necesitas reprogramar, infórmanos con anticipación.
            """.formatted(
            safeText(appointment.tutorName()),
            safeText(appointment.folio()),
            safeText(appointment.pacienteName()),
            appointment.species() != null ? appointment.species().name() : "",
            safeText(appointment.breed()),
            formatDate(appointment),
            formatStartTime(appointment),
            formatEndTime(appointment),
            formatSpecialty(appointment.specialty()),
            safeText(appointment.veterinarioName())
        ).trim();
    }

    private String buildReminder2hMessage(AppointmentResponse appointment) {
        return """
            *Bobby VetCare - Recordatorio de Próxima Cita (En 2 Horas)*

            Hola *%s*, te recordamos que la cita médica de tu mascota es *hoy en 2 horas* a las *%s hrs*.

            • *Folio:* %s
            • *Paciente:* %s (%s - %s)
            • *Horario:* %s - %s hrs
            • *Especialidad:* %s
            • *Veterinario:* %s

            ¡Te esperamos en clínica 10 minutos antes del horario indicado!
            """.formatted(
            safeText(appointment.tutorName()),
            formatStartTime(appointment),
            safeText(appointment.folio()),
            safeText(appointment.pacienteName()),
            appointment.species() != null ? appointment.species().name() : "",
            safeText(appointment.breed()),
            formatStartTime(appointment),
            formatEndTime(appointment),
            formatSpecialty(appointment.specialty()),
            safeText(appointment.veterinarioName())
        ).trim();
    }

    private String buildCancellationMessage(AppointmentResponse appointment) {
        return """
            *Bobby VetCare - Aviso de Cancelación de Cita*

            Hola *%s*, te informamos que la siguiente cita ha sido *cancelada*:

            • *Folio:* %s
            • *Paciente:* %s (%s - %s)
            • *Fecha:* %s
            • *Horario:* %s - %s hrs
            • *Especialidad:* %s
            • *Veterinario:* %s

            Si deseas agendar una nueva fecha, contáctanos o ingresa al portal de Bobby VetCare.
            """.formatted(
            safeText(appointment.tutorName()),
            safeText(appointment.folio()),
            safeText(appointment.pacienteName()),
            appointment.species() != null ? appointment.species().name() : "",
            safeText(appointment.breed()),
            formatDate(appointment),
            formatStartTime(appointment),
            formatEndTime(appointment),
            formatSpecialty(appointment.specialty()),
            safeText(appointment.veterinarioName())
        ).trim();
    }

    private String buildRescheduledMessage(AppointmentResponse appointment) {
        return """
            *Bobby VetCare - Aviso de Cita Reprogramada*

            Hola *%s*, te informamos que tu cita ha sido *reprogramada / actualizada* con los siguientes datos:

            • *Folio:* %s
            • *Paciente:* %s (%s - %s)
            • *Nueva Fecha:* %s
            • *Nuevo Horario:* %s - %s hrs
            • *Especialidad:* %s
            • *Veterinario:* %s

            Te esperamos 10 minutos antes del horario indicado.
            """.formatted(
            safeText(appointment.tutorName()),
            safeText(appointment.folio()),
            safeText(appointment.pacienteName()),
            appointment.species() != null ? appointment.species().name() : "",
            safeText(appointment.breed()),
            formatDate(appointment),
            formatStartTime(appointment),
            formatEndTime(appointment),
            formatSpecialty(appointment.specialty()),
            safeText(appointment.veterinarioName())
        ).trim();
    }

    private String buildConsultationCreatedMessage(ConsultationNotificationDto consultation) {
        return """
            *Bobby VetCare - Inicio de Consulta Médica*

            Hola *%s*, te informamos que se ha iniciado la consulta médica de tu mascota.

            • *Mascota:* %s
            • *Folio de cita:* %s
            • *Fecha de consulta:* %s
            • *Médico veterinario:* %s

            Te mantendremos informado al finalizar la valoración clínica.
            """.formatted(
            safeText(consultation.tutorName()),
            safeText(consultation.patientName()),
            safeFolio(consultation.appointmentFolio()),
            formatConsultationDateTime(consultation.consultationDate()),
            safeText(consultation.veterinarianName())
        ).trim();
    }

    private String buildConsultationCompletedMessage(ConsultationNotificationDto consultation) {
        String diagnosisSummary = summarizeText(consultation.diagnosis(), 240, "Sin diagnóstico registrado");
        String recommendationBlock = (consultation.recommendation() != null && !consultation.recommendation().isBlank())
            ? "\n• *Recomendación / Seguimiento:* " + summarizeText(consultation.recommendation(), 240, "")
            : "";

        return """
            *Bobby VetCare - Consulta Médica Finalizada*

            Hola *%s*, la consulta médica de tu mascota ha concluido exitosamente.

            • *Mascota:* %s
            • *Folio de cita:* %s
            • *Diagnóstico resumido:* %s%s

            Gracias por confiar en *Bobby VetCare*.
            """.formatted(
            safeText(consultation.tutorName()),
            safeText(consultation.patientName()),
            safeFolio(consultation.appointmentFolio()),
            diagnosisSummary,
            recommendationBlock
        ).trim();
    }

    private String formatConsultationDateTime(LocalDateTime dateTime) {
        return dateTime != null ? dateTime.format(DATE_TIME_FORMATTER) : "Por confirmar";
    }

    private String safeFolio(String folio) {
        return (folio != null && !folio.isBlank()) ? folio.trim() : "Consulta directa (sin cita)";
    }

    private String summarizeText(String value, int maxLength, String fallback) {
        if (value == null || value.isBlank()) {
            return fallback;
        }
        String normalized = value.trim().replaceAll("\\s+", " ");
        if (normalized.length() <= maxLength) {
            return normalized;
        }
        return normalized.substring(0, maxLength - 3).trim() + "...";
    }

    private String formatDate(AppointmentResponse appointment) {
        return appointment.scheduledDate() != null
            ? appointment.scheduledDate().format(DATE_FORMATTER)
            : "Por confirmar";
    }

    private String formatStartTime(AppointmentResponse appointment) {
        return appointment.startTime() != null
            ? appointment.startTime().format(TIME_FORMATTER)
            : "--:--";
    }

    private String formatEndTime(AppointmentResponse appointment) {
        return appointment.endTime() != null
            ? appointment.endTime().format(TIME_FORMATTER)
            : "--:--";
    }

    private String formatSpecialty(AppointmentSpecialty specialty) {
        if (specialty == null) {
            return "Consulta General";
        }
        return switch (specialty) {
            case general -> "Consulta General";
            case vacuna -> "Vacunación";
            case cirugia -> "Cirugía";
            case estetica -> "Estética";
            case guardia -> "Guardia / Urgencias";
        };
    }

    private String safeText(String value) {
        return value != null ? value : "";
    }
}
