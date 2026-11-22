package com.bobbyvetcare.api.service;

import com.bobbyvetcare.api.config.SmsConfig;
import com.bobbyvetcare.api.dto.response.AppointmentResponse;
import com.bobbyvetcare.api.entity.enums.AppointmentSpecialty;
import java.nio.charset.StandardCharsets;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Service
@SuppressWarnings("removal")
public class SmsService {

    private static final Logger log = LoggerFactory.getLogger(SmsService.class);

    private static final String EVENT_CONFIRMATION = "SMS_APPOINTMENT_CONFIRMATION";
    private static final String EVENT_REMINDER = "SMS_APPOINTMENT_REMINDER";
    private static final String EVENT_CANCELLED = "SMS_APPOINTMENT_CANCELLED";
    private static final String EVENT_RESCHEDULED = "SMS_APPOINTMENT_RESCHEDULED";

    private static final DateTimeFormatter DATE_FORMATTER =
        DateTimeFormatter.ofPattern("dd/MM/yyyy", Locale.forLanguageTag("es-MX"));
    private static final DateTimeFormatter TIME_FORMATTER =
        DateTimeFormatter.ofPattern("HH:mm");

    private final SmsConfig smsConfig;
    private final RestTemplate restTemplate;

    public SmsService(
        SmsConfig smsConfig,
        @Qualifier("smsRestTemplate") RestTemplate restTemplate
    ) {
        this.smsConfig = smsConfig;
        this.restTemplate = restTemplate;
    }

    @Async("smsTaskExecutor")
    public void sendAppointmentConfirmation(AppointmentResponse appointment, String tutorPhone) {
        if (!canSendMessage(appointment, tutorPhone, EVENT_CONFIRMATION)) {
            return;
        }
        String body = buildConfirmationMessage(appointment);
        dispatchSmsMessage(appointment, tutorPhone, EVENT_CONFIRMATION, body);
    }

    @Async("smsTaskExecutor")
    public void sendAppointmentReminder(AppointmentResponse appointment, String tutorPhone) {
        if (!canSendMessage(appointment, tutorPhone, EVENT_REMINDER)) {
            return;
        }
        String body = buildReminderMessage(appointment);
        dispatchSmsMessage(appointment, tutorPhone, EVENT_REMINDER, body);
    }

    @Async("smsTaskExecutor")
    public void sendAppointmentReminder24h(AppointmentResponse appointment, String tutorPhone) {
        if (!canSendMessage(appointment, tutorPhone, EVENT_REMINDER + "_24H")) {
            return;
        }
        String body = "Bobby VetCare - Recordatorio 24h [%s]. Hola %s, te recordamos que manana es la cita de %s a las %s hrs. Vet: %s."
            .formatted(
                safeText(appointment.folio()),
                safeText(appointment.tutorName()),
                safeText(appointment.pacienteName()),
                formatStartTime(appointment),
                safeText(appointment.veterinarioName())
            );
        dispatchSmsMessage(appointment, tutorPhone, EVENT_REMINDER + "_24H", body);
    }

    @Async("smsTaskExecutor")
    public void sendAppointmentReminder2h(AppointmentResponse appointment, String tutorPhone) {
        if (!canSendMessage(appointment, tutorPhone, EVENT_REMINDER + "_2H")) {
            return;
        }
        String body = "Bobby VetCare - Recordatorio 2h [%s]. Hola %s, la cita de %s es hoy en 2 horas (%s hrs). Te esperamos 10 min antes."
            .formatted(
                safeText(appointment.folio()),
                safeText(appointment.tutorName()),
                safeText(appointment.pacienteName()),
                formatStartTime(appointment)
            );
        dispatchSmsMessage(appointment, tutorPhone, EVENT_REMINDER + "_2H", body);
    }

    @Async("smsTaskExecutor")
    public void sendAppointmentCancellation(AppointmentResponse appointment, String tutorPhone) {
        if (!canSendMessage(appointment, tutorPhone, EVENT_CANCELLED)) {
            return;
        }
        String body = buildCancellationMessage(appointment);
        dispatchSmsMessage(appointment, tutorPhone, EVENT_CANCELLED, body);
    }

    @Async("smsTaskExecutor")
    public void sendAppointmentRescheduled(AppointmentResponse appointment, String tutorPhone) {
        if (!canSendMessage(appointment, tutorPhone, EVENT_RESCHEDULED)) {
            return;
        }
        String body = buildRescheduledMessage(appointment);
        dispatchSmsMessage(appointment, tutorPhone, EVENT_RESCHEDULED, body);
    }

    private void dispatchSmsMessage(
        AppointmentResponse appointment,
        String rawPhone,
        String eventType,
        String messageBody
    ) {
        String formattedTo = formatSmsRecipient(rawPhone);
        log.info(
            "[SMS_EVENT_START] type={}, appointmentId={}, folio={}, to={}",
            eventType,
            appointment.id(),
            appointment.folio(),
            formattedTo
        );

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            headers.setBasicAuth(
                smsConfig.getAccountSid(),
                smsConfig.getAuthToken(),
                StandardCharsets.UTF_8
            );

            MultiValueMap<String, String> payload = new LinkedMultiValueMap<>();
            payload.add("From", smsConfig.getFormattedFromNumber());
            payload.add("To", formattedTo);
            payload.add("Body", messageBody);

            HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(payload, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(
                smsConfig.getMessagesEndpointUrl(),
                requestEntity,
                String.class
            );

            log.info(
                "[SMS_EVENT_SUCCESS] type={}, appointmentId={}, folio={}, to={}, statusCode={}",
                eventType,
                appointment.id(),
                appointment.folio(),
                formattedTo,
                response.getStatusCode().value()
            );
        } catch (RestClientException ex) {
            log.error(
                "[SMS_EVENT_FAILURE] type={}, appointmentId={}, folio={}, to={}, error={}",
                eventType,
                appointment.id(),
                appointment.folio(),
                formattedTo,
                ex.getMessage(),
                ex
            );
        } catch (Exception ex) {
            log.error(
                "[SMS_EVENT_UNEXPECTED_ERROR] type={}, appointmentId={}, folio={}, to={}, error={}",
                eventType,
                appointment.id(),
                appointment.folio(),
                formattedTo,
                ex.getMessage(),
                ex
            );
        }
    }

    private boolean canSendMessage(AppointmentResponse appointment, String tutorPhone, String eventType) {
        if (appointment == null) {
            log.warn("[SMS_EVENT_SKIPPED] type={}, reason=Datos de cita nulos", eventType);
            return false;
        }
        if (!smsConfig.isConfigured()) {
            log.warn(
                "[SMS_EVENT_SKIPPED] type={}, appointmentId={}, folio={}, reason=Credenciales de Twilio SMS no configuradas",
                eventType,
                appointment.id(),
                appointment.folio()
            );
            return false;
        }
        if (tutorPhone == null || tutorPhone.isBlank()) {
            log.warn(
                "[SMS_EVENT_SKIPPED] type={}, appointmentId={}, folio={}, reason=El tutor no tiene teléfono registrado",
                eventType,
                appointment.id(),
                appointment.folio()
            );
            return false;
        }
        return true;
    }

    private String buildConfirmationMessage(AppointmentResponse appointment) {
        return "Bobby VetCare - Cita confirmada [%s]. Hola %s, cita para %s (%s) el %s de %s a %s hrs. Especialidad: %s. Vet: %s."
            .formatted(
                safeText(appointment.folio()),
                safeText(appointment.tutorName()),
                safeText(appointment.pacienteName()),
                appointment.species() != null ? appointment.species().name() : "",
                formatDate(appointment),
                formatStartTime(appointment),
                formatEndTime(appointment),
                formatSpecialty(appointment.specialty()),
                safeText(appointment.veterinarioName())
            );
    }

    private String buildReminderMessage(AppointmentResponse appointment) {
        return "Bobby VetCare - Recordatorio [%s]. Hola %s, te recordamos la cita de %s (%s) el %s de %s a %s hrs. Especialidad: %s. Vet: %s."
            .formatted(
                safeText(appointment.folio()),
                safeText(appointment.tutorName()),
                safeText(appointment.pacienteName()),
                appointment.species() != null ? appointment.species().name() : "",
                formatDate(appointment),
                formatStartTime(appointment),
                formatEndTime(appointment),
                formatSpecialty(appointment.specialty()),
                safeText(appointment.veterinarioName())
            );
    }

    private String buildCancellationMessage(AppointmentResponse appointment) {
        return "Bobby VetCare - Cita cancelada [%s]. Hola %s, la cita de %s (%s) programada el %s a las %s hrs (%s, Vet: %s) ha sido cancelada."
            .formatted(
                safeText(appointment.folio()),
                safeText(appointment.tutorName()),
                safeText(appointment.pacienteName()),
                appointment.species() != null ? appointment.species().name() : "",
                formatDate(appointment),
                formatStartTime(appointment),
                formatSpecialty(appointment.specialty()),
                safeText(appointment.veterinarioName())
            );
    }

    private String buildRescheduledMessage(AppointmentResponse appointment) {
        return "Bobby VetCare - Cita reprogramada [%s]. Hola %s, la cita de %s (%s) fue reprogramada para el %s de %s a %s hrs. Especialidad: %s. Vet: %s."
            .formatted(
                safeText(appointment.folio()),
                safeText(appointment.tutorName()),
                safeText(appointment.pacienteName()),
                appointment.species() != null ? appointment.species().name() : "",
                formatDate(appointment),
                formatStartTime(appointment),
                formatEndTime(appointment),
                formatSpecialty(appointment.specialty()),
                safeText(appointment.veterinarioName())
            );
    }

    private String formatSmsRecipient(String rawPhone) {
        String trimmed = rawPhone.trim();
        if (trimmed.startsWith("whatsapp:")) {
            trimmed = trimmed.substring("whatsapp:".length()).trim();
        }
        String digitsAndPlus = trimmed.replaceAll("[^0-9+]", "");
        if (digitsAndPlus.startsWith("+")) {
            return digitsAndPlus;
        }
        if (digitsAndPlus.startsWith("521") && digitsAndPlus.length() == 13) {
            return "+" + digitsAndPlus;
        }
        if (digitsAndPlus.startsWith("52") && digitsAndPlus.length() == 12) {
            return "+" + digitsAndPlus;
        }
        if (digitsAndPlus.length() == 10) {
            return "+52" + digitsAndPlus;
        }
        return "+" + digitsAndPlus;
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
