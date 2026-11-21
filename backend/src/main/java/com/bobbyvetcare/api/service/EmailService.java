package com.bobbyvetcare.api.service;

import com.bobbyvetcare.api.dto.email.AppointmentEmailDto;
import com.bobbyvetcare.api.dto.email.EmailType;
import com.bobbyvetcare.api.entity.enums.AppointmentSpecialty;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;
import org.springframework.web.util.HtmlUtils;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private static final String CONFIRMATION_TEMPLATE = "templates/email/appointment-confirmation.html";
    private static final String REMINDER_TEMPLATE = "templates/email/appointment-reminder.html";

    private static final DateTimeFormatter DATE_FORMATTER =
        DateTimeFormatter.ofPattern("dd 'de' MMMM 'de' yyyy", Locale.forLanguageTag("es-MX"));
    private static final DateTimeFormatter TIME_FORMATTER =
        DateTimeFormatter.ofPattern("HH:mm");

    private final JavaMailSender mailSender;

    @Value("${app.mail.from:no-reply@bobbyvetcare.com}")
    private String fromAddress;

    @Value("${app.mail.from-name:Bobby VetCare}")
    private String fromName;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async("mailTaskExecutor")
    public void sendAppointmentConfirmation(AppointmentEmailDto data) {
        if (!isValidRecipient(data, EmailType.APPOINTMENT_CONFIRMATION)) {
            return;
        }

        String subject = "Confirmación de cita [" + safeText(data.folio()) + "] - Bobby VetCare";
        sendTemplatedAppointmentEmail(
            data,
            EmailType.APPOINTMENT_CONFIRMATION,
            subject,
            CONFIRMATION_TEMPLATE
        );
    }

    @Async("mailTaskExecutor")
    public void sendAppointmentReminder(AppointmentEmailDto data) {
        if (!isValidRecipient(data, EmailType.APPOINTMENT_REMINDER)) {
            return;
        }

        String subject = "Recordatorio de cita [" + safeText(data.folio()) + "] - Bobby VetCare";
        sendTemplatedAppointmentEmail(
            data,
            EmailType.APPOINTMENT_REMINDER,
            subject,
            REMINDER_TEMPLATE
        );
    }

    private void sendTemplatedAppointmentEmail(
        AppointmentEmailDto data,
        EmailType emailType,
        String subject,
        String templatePath
    ) {
        String recipient = data.tutorEmail().trim();
        log.info(
            "[EMAIL_EVENT_START] type={}, appointmentId={}, folio={}, to={}",
            emailType,
            data.appointmentId(),
            data.folio(),
            recipient
        );

        try {
            String htmlBody = renderTemplate(templatePath, buildTemplateVariables(data));
            String plainTextBody = buildPlainTextFallback(data, emailType);

            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(
                mimeMessage,
                MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                StandardCharsets.UTF_8.name()
            );

            helper.setFrom(resolveEffectiveFromAddress(), fromName);
            helper.setTo(recipient);
            helper.setSubject(subject);
            helper.setText(plainTextBody, htmlBody);

            mailSender.send(mimeMessage);

            log.info(
                "[EMAIL_EVENT_SUCCESS] type={}, appointmentId={}, folio={}, to={}, subject=\"{}\"",
                emailType,
                data.appointmentId(),
                data.folio(),
                recipient,
                subject
            );
        } catch (MailException | MessagingException | IOException ex) {
            log.error(
                "[EMAIL_EVENT_FAILURE] type={}, appointmentId={}, folio={}, to={}, error={}",
                emailType,
                data.appointmentId(),
                data.folio(),
                recipient,
                ex.getMessage(),
                ex
            );
        } catch (Exception ex) {
            log.error(
                "[EMAIL_EVENT_UNEXPECTED_ERROR] type={}, appointmentId={}, folio={}, to={}, error={}",
                emailType,
                data.appointmentId(),
                data.folio(),
                recipient,
                ex.getMessage(),
                ex
            );
        }
    }

    private boolean isValidRecipient(AppointmentEmailDto data, EmailType emailType) {
        if (data == null) {
            log.warn("[EMAIL_EVENT_SKIPPED] type={}, reason=Datos de cita nulos", emailType);
            return false;
        }
        if (data.tutorEmail() == null || data.tutorEmail().isBlank()) {
            log.warn(
                "[EMAIL_EVENT_SKIPPED] type={}, appointmentId={}, folio={}, reason=El tutor no tiene correo electrónico registrado",
                emailType,
                data.appointmentId(),
                data.folio()
            );
            return false;
        }
        return true;
    }

    private String resolveEffectiveFromAddress() {
        if (fromAddress != null && !fromAddress.isBlank()) {
            return fromAddress.trim();
        }
        return "no-reply@localhost";
    }

    private Map<String, String> buildTemplateVariables(AppointmentEmailDto data) {
        String formattedDate = data.scheduledDate() != null
            ? data.scheduledDate().format(DATE_FORMATTER)
            : "Por confirmar";
        String formattedStart = data.startTime() != null
            ? data.startTime().format(TIME_FORMATTER)
            : "--:--";
        String formattedEnd = data.endTime() != null
            ? data.endTime().format(TIME_FORMATTER)
            : "--:--";
        String notes = (data.notes() != null && !data.notes().isBlank())
            ? data.notes().trim()
            : "Sin observaciones adicionales";

        return Map.ofEntries(
            Map.entry("tutorFullName", escapeHtml(data.tutorFullName())),
            Map.entry("patientName", escapeHtml(data.patientName())),
            Map.entry("patientSpecies", escapeHtml(data.patientSpecies())),
            Map.entry("patientBreed", escapeHtml(data.patientBreed())),
            Map.entry("folio", escapeHtml(data.folio())),
            Map.entry("scheduledDate", escapeHtml(formattedDate)),
            Map.entry("startTime", escapeHtml(formattedStart)),
            Map.entry("endTime", escapeHtml(formattedEnd)),
            Map.entry("specialty", escapeHtml(formatSpecialty(data.specialty()))),
            Map.entry("veterinarianFullName", escapeHtml(data.veterinarianFullName())),
            Map.entry("notes", escapeHtml(notes))
        );
    }

    private String renderTemplate(String templatePath, Map<String, String> variables) throws IOException {
        ClassPathResource resource = new ClassPathResource(templatePath);
        String content;
        try (InputStream inputStream = resource.getInputStream()) {
            content = StreamUtils.copyToString(inputStream, StandardCharsets.UTF_8);
        }
        for (Map.Entry<String, String> entry : variables.entrySet()) {
            content = content.replace("{{" + entry.getKey() + "}}", entry.getValue());
        }
        return content;
    }

    private String buildPlainTextFallback(AppointmentEmailDto data, EmailType emailType) {
        String heading = emailType == EmailType.APPOINTMENT_CONFIRMATION
            ? "Confirmación de tu cita en Bobby VetCare"
            : "Recordatorio de tu próxima cita en Bobby VetCare";
        String formattedDate = data.scheduledDate() != null
            ? data.scheduledDate().format(DATE_FORMATTER)
            : "Por confirmar";
        String formattedStart = data.startTime() != null
            ? data.startTime().format(TIME_FORMATTER)
            : "--:--";
        String formattedEnd = data.endTime() != null
            ? data.endTime().format(TIME_FORMATTER)
            : "--:--";
        String notes = (data.notes() != null && !data.notes().isBlank())
            ? data.notes().trim()
            : "Sin observaciones adicionales";

        return """
            %s

            Hola %s,

            Paciente: %s (%s - %s)
            Folio: %s
            Fecha: %s
            Horario: %s - %s hrs
            Especialidad: %s
            Veterinario: %s
            Notas: %s

            Bobby VetCare
            """.formatted(
            heading,
            safeText(data.tutorFullName()),
            safeText(data.patientName()),
            safeText(data.patientSpecies()),
            safeText(data.patientBreed()),
            safeText(data.folio()),
            formattedDate,
            formattedStart,
            formattedEnd,
            formatSpecialty(data.specialty()),
            safeText(data.veterinarianFullName()),
            notes
        );
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

    private String escapeHtml(String value) {
        return HtmlUtils.htmlEscape(safeText(value));
    }

    private String safeText(String value) {
        return value != null ? value : "";
    }
}
