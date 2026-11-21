package com.bobbyvetcare.api.config;

import java.util.concurrent.Executor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.web.client.RestTemplate;

@Configuration
@EnableAsync
@SuppressWarnings("removal")
public class SmsConfig {

    private static final Logger log = LoggerFactory.getLogger(SmsConfig.class);

    private static final String TWILIO_API_BASE_URL = "https://api.twilio.com/2010-04-01/Accounts/";

    @Value("${twilio.account-sid:${TWILIO_ACCOUNT_SID:}}")
    private String accountSid;

    @Value("${twilio.auth-token:${TWILIO_AUTH_TOKEN:}}")
    private String authToken;

    @Value("${twilio.phone-number:${TWILIO_PHONE_NUMBER:}}")
    private String phoneNumber;

    @Value("${twilio.connect-timeout-ms:5000}")
    private int connectTimeoutMs;

    @Value("${twilio.read-timeout-ms:10000}")
    private int readTimeoutMs;

    @Bean(name = "smsRestTemplate")
    public RestTemplate smsRestTemplate() {
        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(connectTimeoutMs);
        requestFactory.setReadTimeout(readTimeoutMs);

        log.info(
            "Cliente Twilio SMS configurado [configured={}, fromNumber={}]",
            isConfigured(),
            phoneNumber != null && !phoneNumber.isBlank() ? phoneNumber : "NO_CONFIGURADO"
        );
        return new RestTemplate(requestFactory);
    }

    @Bean(name = "smsTaskExecutor")
    public Executor smsTaskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(2);
        executor.setMaxPoolSize(5);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("bobby-sms-async-");
        executor.setWaitForTasksToCompleteOnShutdown(true);
        executor.setAwaitTerminationSeconds(15);
        executor.initialize();
        return executor;
    }

    public boolean isConfigured() {
        return accountSid != null && !accountSid.isBlank()
            && authToken != null && !authToken.isBlank()
            && phoneNumber != null && !phoneNumber.isBlank();
    }

    public String getMessagesEndpointUrl() {
        return TWILIO_API_BASE_URL + accountSid.trim() + "/Messages.json";
    }

    public String getAccountSid() {
        return accountSid != null ? accountSid.trim() : "";
    }

    public String getAuthToken() {
        return authToken != null ? authToken.trim() : "";
    }

    public String getFormattedFromNumber() {
        String raw = phoneNumber != null ? phoneNumber.trim() : "";
        if (raw.startsWith("whatsapp:")) {
            raw = raw.substring("whatsapp:".length()).trim();
        }
        return raw;
    }
}
