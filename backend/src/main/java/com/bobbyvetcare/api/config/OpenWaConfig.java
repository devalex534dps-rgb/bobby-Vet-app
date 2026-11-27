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
import org.springframework.web.client.RestClient;

/**
 * Configuración de integración con la API REST local de OpenWA (motor Baileys)
 * y su ejecutor asíncrono dedicado para notificaciones de WhatsApp.
 */
@Configuration
@EnableAsync
public class OpenWaConfig {

    private static final Logger log = LoggerFactory.getLogger(OpenWaConfig.class);

    @Value("${openwa.base-url:${OPENWA_BASE_URL:http://localhost:2785}}")
    private String baseUrl;

    @Value("${openwa.api-key:${OPENWA_API_KEY:}}")
    private String apiKey;

    @Value("${openwa.session-id:${OPENWA_SESSION_ID:}}")
    private String sessionId;

    @Value("${openwa.connect-timeout-ms:5000}")
    private int connectTimeoutMs;

    @Value("${openwa.read-timeout-ms:10000}")
    private int readTimeoutMs;

    @Bean(name = "openWaRestClient")
    public RestClient openWaRestClient() {
        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(connectTimeoutMs);
        requestFactory.setReadTimeout(readTimeoutMs);

        log.info(
            "Cliente OpenWA WhatsApp configurado [configured={}, baseUrl={}, sessionId={}]",
            isConfigured(),
            getNormalizedBaseUrl(),
            sessionId != null && !sessionId.isBlank() ? sessionId.trim() : "NO_CONFIGURADO"
        );
        return RestClient.builder()
            .requestFactory(requestFactory)
            .build();
    }

    @Bean(name = "whatsAppTaskExecutor")
    public Executor whatsAppTaskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(2);
        executor.setMaxPoolSize(5);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("bobby-whatsapp-async-");
        executor.setWaitForTasksToCompleteOnShutdown(true);
        executor.setAwaitTerminationSeconds(15);
        executor.initialize();
        return executor;
    }

    public boolean isConfigured() {
        return baseUrl != null && !baseUrl.isBlank()
            && apiKey != null && !apiKey.isBlank()
            && sessionId != null && !sessionId.isBlank();
    }

    public String getNormalizedBaseUrl() {
        String normalized = baseUrl != null ? baseUrl.trim() : "";
        while (normalized.endsWith("/")) {
            normalized = normalized.substring(0, normalized.length() - 1);
        }
        return normalized;
    }

    public String getSendTextEndpointUrl() {
        String normalizedBase = getNormalizedBaseUrl();
        String prefix = normalizedBase.endsWith("/api") ? normalizedBase : normalizedBase + "/api";
        return prefix + "/sessions/" + getSessionId() + "/messages/send-text";
    }

    public String getApiKey() {
        return apiKey != null ? apiKey.trim() : "";
    }

    public String getSessionId() {
        return sessionId != null ? sessionId.trim() : "";
    }
}
