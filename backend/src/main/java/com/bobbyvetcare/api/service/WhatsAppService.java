package com.bobbyvetcare.api.service;

import com.bobbyvetcare.api.config.WhatsAppConfig;
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
public class WhatsAppService {

    private static final Logger log = LoggerFactory.getLogger(WhatsAppService.class);

    private static final String EVENT_CONFIRMATION = "WHATSAPP_APPOINTMENT_CONFIRMATION";
    private static final String EVENT_REMINDER = "WHATSAPP_APPOINTMENT_REMINDER";
    private static final String EVENT_CANCELLED = "WHATSAPP_APPOINTMENT_CANCELLED";
    private static final String EVENT_RESCHEDULED = "WHATSAPP_APPOINTMENT_RESCHEDULED";

    private static final DateTimeFormatter DATE_FORMATTER =
        DateTimeFormatter.ofPattern("dd 'de' MMMM 'de' yyyy", Locale.forLanguageTag("es-MX"));
    private static final DateTimeFormatter TIME_FORMATTER =
        DateTimeFormatter.ofPattern("HH:mm");

    private final WhatsAppConfig whatsAppConfig;
    private final RestTemplate restTemplate;

    public WhatsAppService(
        WhatsAppConfig whatsAppConfig,
        @Qualifier("whatsAppRestTemplate") RestTemplate restTemplate
    ) {
        this.whatsAppConfig = whatsAppConfig;
        this.restTemplate = restTemplate;
    }

    @Async("whatsAppTaskExecutor")
    public void sendAppointmentConfirmation(AppointmentResponse appointment, String tutorPhone) {
        if (!canSendMessage(appointment, tutorPhone, EVENT_CONFIRMATION)) {
            return;
        }
        String body = buildConfirmationMessage(appointment);
        dispatchWhatsAppMessage(appointment, tutorPhone, EVENT_CONFIRMATION, body);
    }

    @Async("whatsAppTaskExecutor")
    public void sendAppointmentReminder(AppointmentResponse appointment, String tutorPhone) {
        if (!canSendMessage(appointment, tutorPhone, EVENT_REMINDER)) {
            return;
        }
        String body = buildReminderMessage(appointment);
        dispatchWhatsAppMessage(appointment, tutorPhone, EVENT_REMINDER, body);
    }

    @Async("whatsAppTaskExecutor")
    public void sendAppointmentCancellation(AppointmentResponse appointment, String tutorPhone) {
        if (!canSendMessage(appointment, tutorPhone, EVENT_CANCELLED)) {
            return;
        }
        String body = buildCancellationMessage(appointment);
        dispatchWhatsAppMessage(appointment, tutorPhone, EVENT_CANCELLED, body);
    }

    @Async("whatsAppTaskExecutor")
    public void sendAppointmentRescheduled(AppointmentResponse appointment, String tutorPhone) {
        if (!canSendMessage(appointment, tutorPhone, EVENT_RESCHEDULED)) {
            return;
        }
        String body = buildRescheduledMessage(appointment);
        dispatchWhatsAppMessage(appointment, tutorPhone, EVENT_RESCHEDULED, body);
    }

    private void dispatchWhatsAppMessage(
        AppointmentResponse appointment,
        String rawPhone,
        String eventType,
        String messageBody
    ) {
        String formattedTo = formatWhatsAppRecipient(rawPhone);
        log.info(
            "[WHATSAPP_EVENT_START] type={}, appointmentId={}, folio={}, to={}",
            eventType,
            appointment.id(),
            appointment.folio(),
            formattedTo
        );

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            headers.setBasicAuth(
                whatsAppConfig.getAccountSid(),
                whatsAppConfig.getAuthToken(),
                StandardCharsets.UTF_8
            );

            MultiValueMap<String, String> payload = new LinkedMultiValueMap<>();
            payload.add("From", whatsAppConfig.getFormattedFromAddress());
            payload.add("To", formattedTo);
            payload.add("Body", messageBody);

            HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(payload, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(
                whatsAppConfig.getMessagesEndpointUrl(),
                requestEntity,
                String.class
            );

            log.info(
                "[WHATSAPP_EVENT_SUCCESS] type={}, appointmentId={}, folio={}, to={}, statusCode={}",
                eventType,
                appointment.id(),
                appointment.folio(),
                formattedTo,
                response.getStatusCode().value()
            );
        } catch (RestClientException ex) {
            log.error(
                "[WHATSAPP_EVENT_FAILURE] type={}, appointmentId={}, folio={}, to={}, error={}",
                eventType,
                appointment.id(),
                appointment.folio(),
                formattedTo,
                ex.getMessage(),
                ex
            );
        } catch (Exception ex) {
            log.error(
                "[WHATSAPP_EVENT_UNEXPECTED_ERROR] type={}, appointmentId={}, folio={}, to={}, error={}",
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
            log.warn("[WHATSAPP_EVENT_SKIPPED] type={}, reason=Datos de cita nulos", eventType);
            return false;
        }
        if (!whatsAppConfig.isConfigured()) {
            log.warn(
                "[WHATSAPP_EVENT_SKIPPED] type={}, appointmentId={}, folio={}, reason=Credenciales de Twilio WhatsApp no configuradas",
                eventType,
                appointment.id(),
                appointment.folio()
            );
            return false;
        }
        if (tutorPhone == null || tutorPhone.isBlank()) {
            log.warn(
                "[WHATSAPP_EVENT_SKIPPED] type={}, appointmentId={}, folio={}, reason=El tutor no tiene teléfono registrado",
                eventType,
                appointment.id(),
                appointment.folio()
            );
            return false;
        }
        return true;
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

    private String formatWhatsAppRecipient(String rawPhone) {
        String trimmed = rawPhone.trim();
        if (trimmed.startsWith("whatsapp:")) {
            trimmed = trimmed.substring("whatsapp:".length()).trim();
        }
        String digitsAndPlus = trimmed.replaceAll("[^0-9+]", "");
        if (!digitsAndPlus.startsWith("+")) {
            if (digitsAndPlus.length() == 10) {
                digitsAndPlus = "+52" + digitsAndPlus;
            } else {
                digitsAndPlus = "+" + digitsAndPlus;
            }
        }
        return "whatsapp:" + digitsAndPlus;
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
