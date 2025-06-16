package com.letz.controller;

import com.letz.service.ExternalApiService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Controller para integração com APIs externas
 */
@RestController
@RequestMapping("/external")
@RequiredArgsConstructor
@Tag(name = "APIs Externas", description = "Integração com serviços externos como Maps, Weather, Push Notifications")
public class ExternalApiController {

    private final ExternalApiService externalApiService;

    // ============================================
    // GOOGLE MAPS ENDPOINTS
    // ============================================

    @GetMapping("/maps/geocode")
    @Operation(summary = "Geocodificar endereço", description = "Converte endereço em coordenadas geográficas")
    public ResponseEntity<Map<String, Object>> geocodeAddress(@RequestParam String address) {
        Map<String, Object> result = externalApiService.geocodeAddress(address);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/maps/places/nearby")
    @Operation(summary = "Buscar locais próximos", description = "Encontra pontos de interesse próximos a uma localização")
    public ResponseEntity<Map<String, Object>> findNearbyPlaces(
            @RequestParam double latitude,
            @RequestParam double longitude,
            @RequestParam(defaultValue = "restaurant") String type,
            @RequestParam(defaultValue = "1000") int radius) {
        
        Map<String, Object> result = externalApiService.findNearbyPlaces(latitude, longitude, type, radius);
        return ResponseEntity.ok(result);
    }

    // ============================================
    // WEATHER ENDPOINTS
    // ============================================

    @GetMapping("/weather/current")
    @Operation(summary = "Obter clima atual", description = "Informações meteorológicas atuais para uma localização")
    public ResponseEntity<Map<String, Object>> getCurrentWeather(
            @RequestParam double latitude,
            @RequestParam double longitude) {
        
        Map<String, Object> result = externalApiService.getWeatherInfo(latitude, longitude);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/weather/event-suitability")
    @Operation(summary = "Verificar adequabilidade climática", description = "Analisa se o clima é adequado para um evento")
    public ResponseEntity<Map<String, Object>> checkEventWeatherSuitability(
            @RequestParam double latitude,
            @RequestParam double longitude,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime eventDate,
            @RequestParam String eventType) {
        
        Map<String, Object> result = externalApiService.checkEventWeatherSuitability(
            latitude, longitude, eventDate, eventType);
        return ResponseEntity.ok(result);
    }

    // ============================================
    // PUSH NOTIFICATIONS ENDPOINTS
    // ============================================

    @PostMapping("/push/send")
    @Operation(summary = "Enviar notificação push", description = "Envia notificação push para um dispositivo")
    public ResponseEntity<Map<String, Object>> sendPushNotification(@RequestBody Map<String, Object> request) {
        String endpoint = (String) request.get("endpoint");
        String p256dh = (String) request.get("p256dh");
        String auth = (String) request.get("auth");
        String title = (String) request.get("title");
        String body = (String) request.get("body");
        Map<String, Object> data = (Map<String, Object>) request.getOrDefault("data", Map.of());
        
        Map<String, Object> result = externalApiService.sendPushNotification(
            endpoint, p256dh, auth, title, body, data);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/push/send-bulk")
    @Operation(summary = "Enviar notificações em massa", description = "Envia notificação push para múltiplos dispositivos")
    public ResponseEntity<Map<String, Object>> sendBulkPushNotifications(@RequestBody Map<String, Object> request) {
        List<Map<String, String>> subscriptions = (List<Map<String, String>>) request.get("subscriptions");
        String title = (String) request.get("title");
        String body = (String) request.get("body");
        Map<String, Object> data = (Map<String, Object>) request.getOrDefault("data", Map.of());
        
        Map<String, Object> result = externalApiService.sendBulkPushNotifications(
            subscriptions, title, body, data);
        return ResponseEntity.ok(result);
    }

    // ============================================
    // STATUS AND UTILITIES
    // ============================================

    @GetMapping("/status")
    @Operation(summary = "Status das APIs", description = "Verifica o status de configuração das APIs externas")
    public ResponseEntity<Map<String, Object>> getApiStatus() {
        Map<String, Object> result = externalApiService.getApiStatus();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/health")
    @Operation(summary = "Health check", description = "Verifica a saúde das integrações externas")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        // Teste rápido de conectividade
        try {
            Map<String, Object> status = externalApiService.getApiStatus();
            return ResponseEntity.ok(Map.of(
                "status", "healthy",
                "timestamp", LocalDateTime.now(),
                "apis", status
            ));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of(
                "status", "degraded",
                "timestamp", LocalDateTime.now(),
                "error", e.getMessage()
            ));
        }
    }
} 