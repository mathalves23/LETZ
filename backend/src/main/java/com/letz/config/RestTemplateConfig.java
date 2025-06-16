package com.letz.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;

/**
 * Configuração do RestTemplate para chamadas HTTP externas
 */
@Configuration
public class RestTemplateConfig {

    @Bean
    public RestTemplate restTemplate() {
        HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory();
        
        // Timeouts configurados para APIs externas
        factory.setConnectTimeout((int) Duration.ofSeconds(10).toMillis());
        factory.setConnectionRequestTimeout((int) Duration.ofSeconds(10).toMillis());
        
        return new RestTemplate(factory);
    }
} 