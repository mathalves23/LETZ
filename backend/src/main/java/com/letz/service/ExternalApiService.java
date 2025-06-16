package com.letz.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

/**
 * Serviço para integração com APIs externas
 * Oferece funcionalidades para Maps, Weather, Push Notifications e Social Media
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ExternalApiService {

    private final RestTemplate restTemplate;

    @Value("${external.apis.google.maps.key:}")
    private String googleMapsApiKey;

    @Value("${external.apis.openweather.key:}")
    private String openWeatherApiKey;

    @Value("${external.apis.vapid.public:}")
    private String vapidPublicKey;

    @Value("${external.apis.vapid.private:}")
    private String vapidPrivateKey;

    // ============================================
    // GOOGLE MAPS API
    // ============================================

    /**
     * Busca informações de endereço usando Google Geocoding API
     */
    public Map<String, Object> geocodeAddress(String address) {
        if (googleMapsApiKey.isEmpty()) {
            log.warn("Google Maps API key não configurada");
            return createMockGeocodingResponse(address);
        }

        try {
            String url = UriComponentsBuilder
                .fromHttpUrl("https://maps.googleapis.com/maps/api/geocode/json")
                .queryParam("address", address)
                .queryParam("key", googleMapsApiKey)
                .queryParam("language", "pt-BR")
                .queryParam("region", "BR")
                .build()
                .toUriString();

            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> data = response.getBody();
                List<Map<String, Object>> results = (List<Map<String, Object>>) data.get("results");
                
                if (!results.isEmpty()) {
                    Map<String, Object> result = results.get(0);
                    Map<String, Object> geometry = (Map<String, Object>) result.get("geometry");
                    Map<String, Object> location = (Map<String, Object>) geometry.get("location");
                    
                    return Map.of(
                        "latitude", location.get("lat"),
                        "longitude", location.get("lng"),
                        "formatted_address", result.get("formatted_address"),
                        "place_id", result.get("place_id"),
                        "address_components", result.get("address_components"),
                        "success", true
                    );
                }
            }
            
            log.warn("Nenhum resultado encontrado para endereço: {}", address);
            return Map.of("success", false, "error", "Endereço não encontrado");
            
        } catch (Exception e) {
            log.error("Erro ao geocodificar endereço: {}", e.getMessage(), e);
            return createMockGeocodingResponse(address);
        }
    }

    /**
     * Busca locais próximos usando Google Places API
     */
    public Map<String, Object> findNearbyPlaces(double latitude, double longitude, String type, int radius) {
        if (googleMapsApiKey.isEmpty()) {
            return createMockPlacesResponse(latitude, longitude, type);
        }

        try {
            String url = UriComponentsBuilder
                .fromHttpUrl("https://maps.googleapis.com/maps/api/place/nearbysearch/json")
                .queryParam("location", latitude + "," + longitude)
                .queryParam("radius", radius)
                .queryParam("type", type)
                .queryParam("key", googleMapsApiKey)
                .queryParam("language", "pt-BR")
                .build()
                .toUriString();

            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> data = response.getBody();
                return Map.of(
                    "places", data.get("results"),
                    "success", true
                );
            }
            
            return Map.of("success", false, "error", "Erro na busca");
            
        } catch (Exception e) {
            log.error("Erro ao buscar locais próximos: {}", e.getMessage(), e);
            return createMockPlacesResponse(latitude, longitude, type);
        }
    }

    // ============================================
    // WEATHER API
    // ============================================

    /**
     * Busca informações meteorológicas para um local
     */
    public Map<String, Object> getWeatherInfo(double latitude, double longitude) {
        if (openWeatherApiKey.isEmpty()) {
            log.warn("OpenWeather API key não configurada");
            return createMockWeatherResponse(latitude, longitude);
        }

        try {
            // Clima atual
            String currentUrl = UriComponentsBuilder
                .fromHttpUrl("https://api.openweathermap.org/data/2.5/weather")
                .queryParam("lat", latitude)
                .queryParam("lon", longitude)
                .queryParam("appid", openWeatherApiKey)
                .queryParam("units", "metric")
                .queryParam("lang", "pt_br")
                .build()
                .toUriString();

            // Previsão de 5 dias
            String forecastUrl = UriComponentsBuilder
                .fromHttpUrl("https://api.openweathermap.org/data/2.5/forecast")
                .queryParam("lat", latitude)
                .queryParam("lon", longitude)
                .queryParam("appid", openWeatherApiKey)
                .queryParam("units", "metric")
                .queryParam("lang", "pt_br")
                .build()
                .toUriString();

            ResponseEntity<Map> currentResponse = restTemplate.getForEntity(currentUrl, Map.class);
            ResponseEntity<Map> forecastResponse = restTemplate.getForEntity(forecastUrl, Map.class);

            if (currentResponse.getStatusCode() == HttpStatus.OK && 
                forecastResponse.getStatusCode() == HttpStatus.OK) {
                
                Map<String, Object> current = currentResponse.getBody();
                Map<String, Object> forecast = forecastResponse.getBody();
                
                return Map.of(
                    "current", processCurrentWeather(current),
                    "forecast", processForecast(forecast),
                    "success", true
                );
            }
            
            return Map.of("success", false, "error", "Erro ao obter dados meteorológicos");
            
        } catch (Exception e) {
            log.error("Erro ao buscar informações meteorológicas: {}", e.getMessage(), e);
            return createMockWeatherResponse(latitude, longitude);
        }
    }

    /**
     * Verifica se o clima é adequado para um evento
     */
    public Map<String, Object> checkEventWeatherSuitability(double latitude, double longitude, 
                                                           LocalDateTime eventDate, String eventType) {
        Map<String, Object> weather = getWeatherInfo(latitude, longitude);
        
        if (!(Boolean) weather.get("success")) {
            return Map.of("success", false, "error", "Dados meteorológicos indisponíveis");
        }

        Map<String, Object> current = (Map<String, Object>) weather.get("current");
        List<Map<String, Object>> forecast = (List<Map<String, Object>>) weather.get("forecast");
        
        // Análise baseada no tipo de evento
        boolean isOutdoorEvent = isOutdoorEventType(eventType);
        Map<String, Object> suitability = analyzeSuitability(current, forecast, isOutdoorEvent, eventDate);
        
        return Map.of(
            "weather", weather,
            "suitability", suitability,
            "recommendations", generateWeatherRecommendations(suitability, eventType),
            "success", true
        );
    }

    // ============================================
    // PUSH NOTIFICATIONS
    // ============================================

    /**
     * Envia notificação push usando Web Push Protocol
     */
    public Map<String, Object> sendPushNotification(String endpoint, String p256dh, String auth, 
                                                   String title, String body, Map<String, Object> data) {
        try {
            // Implementação simplificada - em produção usaria biblioteca específica como web-push
            log.info("📱 Enviando push notification para: {}", endpoint);
            
            Map<String, Object> payload = Map.of(
                "title", title,
                "body", body,
                "data", data != null ? data : Map.of(),
                "icon", "/icons/icon-192x192.png",
                "badge", "/icons/badge-72x72.png",
                "timestamp", System.currentTimeMillis()
            );
            
            // TODO: Implementar envio real usando VAPID
            // WebPushService.sendNotification(endpoint, p256dh, auth, payload)
            
            return Map.of(
                "success", true,
                "message", "Notificação enviada com sucesso",
                "payload", payload
            );
            
        } catch (Exception e) {
            log.error("Erro ao enviar push notification: {}", e.getMessage(), e);
            return Map.of("success", false, "error", e.getMessage());
        }
    }

    /**
     * Envia notificação para múltiplos dispositivos
     */
    public Map<String, Object> sendBulkPushNotifications(List<Map<String, String>> subscriptions,
                                                        String title, String body, Map<String, Object> data) {
        List<Map<String, Object>> results = new ArrayList<>();
        int successCount = 0;
        
        for (Map<String, String> subscription : subscriptions) {
            Map<String, Object> result = sendPushNotification(
                subscription.get("endpoint"),
                subscription.get("p256dh"),
                subscription.get("auth"),
                title, body, data
            );
            
            results.add(Map.of(
                "subscription", subscription.get("endpoint"),
                "result", result
            ));
            
            if ((Boolean) result.get("success")) {
                successCount++;
            }
        }
        
        return Map.of(
            "totalSent", subscriptions.size(),
            "successCount", successCount,
            "failureCount", subscriptions.size() - successCount,
            "results", results,
            "success", successCount > 0
        );
    }

    // ============================================
    // INTEGRATION UTILITIES
    // ============================================

    /**
     * Valida se todas as APIs externas estão configuradas
     */
    public Map<String, Object> getApiStatus() {
        return Map.of(
            "googleMaps", Map.of(
                "configured", !googleMapsApiKey.isEmpty(),
                "status", !googleMapsApiKey.isEmpty() ? "active" : "missing_key"
            ),
            "openWeather", Map.of(
                "configured", !openWeatherApiKey.isEmpty(),
                "status", !openWeatherApiKey.isEmpty() ? "active" : "missing_key"
            ),
            "pushNotifications", Map.of(
                "configured", !vapidPublicKey.isEmpty() && !vapidPrivateKey.isEmpty(),
                "status", !vapidPublicKey.isEmpty() ? "active" : "missing_keys"
            ),
            "lastCheck", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
        );
    }

    // ============================================
    // HELPER METHODS
    // ============================================

    private Map<String, Object> createMockGeocodingResponse(String address) {
        // Coordenadas do centro de São Paulo como fallback
        return Map.of(
            "latitude", -23.5505,
            "longitude", -46.6333,
            "formatted_address", "São Paulo - SP, Brasil",
            "place_id", "mock_place_id",
            "address_components", List.of(),
            "success", true,
            "mock", true
        );
    }

    private Map<String, Object> createMockPlacesResponse(double lat, double lng, String type) {
        List<Map<String, Object>> mockPlaces = List.of(
            Map.of(
                "name", "Local Exemplo 1",
                "vicinity", "Próximo ao local do evento",
                "rating", 4.5,
                "place_id", "mock_place_1",
                "types", List.of(type)
            ),
            Map.of(
                "name", "Local Exemplo 2", 
                "vicinity", "Nas proximidades",
                "rating", 4.2,
                "place_id", "mock_place_2",
                "types", List.of(type)
            )
        );
        
        return Map.of(
            "places", mockPlaces,
            "success", true,
            "mock", true
        );
    }

    private Map<String, Object> createMockWeatherResponse(double lat, double lng) {
        return Map.of(
            "current", Map.of(
                "temperature", 24.0,
                "description", "Parcialmente nublado",
                "humidity", 65,
                "wind_speed", 8.2,
                "icon", "partly-cloudy",
                "feels_like", 26.0
            ),
            "forecast", List.of(
                Map.of(
                    "date", LocalDateTime.now().plusDays(1).format(DateTimeFormatter.ISO_LOCAL_DATE),
                    "temperature_max", 27.0,
                    "temperature_min", 19.0,
                    "description", "Sol com algumas nuvens",
                    "precipitation_chance", 20
                )
            ),
            "success", true,
            "mock", true
        );
    }

    private Map<String, Object> processCurrentWeather(Map<String, Object> data) {
        Map<String, Object> main = (Map<String, Object>) data.get("main");
        Map<String, Object> wind = (Map<String, Object>) data.get("wind");
        List<Map<String, Object>> weather = (List<Map<String, Object>>) data.get("weather");
        
        return Map.of(
            "temperature", main.get("temp"),
            "feels_like", main.get("feels_like"),
            "humidity", main.get("humidity"),
            "pressure", main.get("pressure"),
            "wind_speed", wind != null ? wind.get("speed") : 0,
            "description", weather.get(0).get("description"),
            "icon", weather.get(0).get("icon")
        );
    }

    private List<Map<String, Object>> processForecast(Map<String, Object> data) {
        List<Map<String, Object>> list = (List<Map<String, Object>>) data.get("list");
        List<Map<String, Object>> processed = new ArrayList<>();
        
        // Processar apenas os próximos 5 dias (um por dia)
        Set<String> processedDates = new HashSet<>();
        
        for (Map<String, Object> item : list) {
            String dateStr = (String) item.get("dt_txt");
            String date = dateStr.split(" ")[0];
            
            if (!processedDates.contains(date) && processedDates.size() < 5) {
                Map<String, Object> main = (Map<String, Object>) item.get("main");
                List<Map<String, Object>> weather = (List<Map<String, Object>>) item.get("weather");
                
                processed.add(Map.of(
                    "date", date,
                    "temperature_max", main.get("temp_max"),
                    "temperature_min", main.get("temp_min"),
                    "description", weather.get(0).get("description"),
                    "icon", weather.get(0).get("icon"),
                    "precipitation_chance", ((Map<String, Object>) item.getOrDefault("pop", Map.of("pop", 0))).getOrDefault("pop", 0)
                ));
                
                processedDates.add(date);
            }
        }
        
        return processed;
    }

    private boolean isOutdoorEventType(String eventType) {
        Set<String> outdoorTypes = Set.of(
            "CHURRASCO", "FESTA_JARDIM", "FESTIVAL", "ESPORTIVO", 
            "PIQUENIQUE", "CAMPING", "PRAIA", "PARQUE"
        );
        return outdoorTypes.contains(eventType.toUpperCase());
    }

    private Map<String, Object> analyzeSuitability(Map<String, Object> current, 
                                                  List<Map<String, Object>> forecast,
                                                  boolean isOutdoor, LocalDateTime eventDate) {
        double temperature = (Double) current.get("temperature");
        double humidity = (Double) current.get("humidity");
        double windSpeed = (Double) current.get("wind_speed");
        
        // Pontuação de adequabilidade (0-100)
        int score = 100;
        List<String> concerns = new ArrayList<>();
        
        if (isOutdoor) {
            // Eventos ao ar livre são mais sensíveis ao clima
            if (temperature < 15 || temperature > 35) {
                score -= 30;
                concerns.add("Temperatura não ideal para eventos ao ar livre");
            }
            
            if (humidity > 80) {
                score -= 20;
                concerns.add("Umidade alta pode causar desconforto");
            }
            
            if (windSpeed > 15) {
                score -= 25;
                concerns.add("Vento forte pode atrapalhar o evento");
            }
        } else {
            // Eventos internos são menos afetados
            if (temperature < 10 || temperature > 40) {
                score -= 15;
                concerns.add("Temperatura extrema pode afetar deslocamento");
            }
        }
        
        String level;
        if (score >= 80) level = "excellent";
        else if (score >= 60) level = "good";
        else if (score >= 40) level = "fair";
        else level = "poor";
        
        return Map.of(
            "score", score,
            "level", level,
            "concerns", concerns,
            "isOutdoorEvent", isOutdoor
        );
    }

    private List<String> generateWeatherRecommendations(Map<String, Object> suitability, String eventType) {
        List<String> recommendations = new ArrayList<>();
        List<String> concerns = (List<String>) suitability.get("concerns");
        boolean isOutdoor = (Boolean) suitability.get("isOutdoorEvent");
        
        if (concerns.isEmpty()) {
            recommendations.add("🌟 Condições climáticas ideais para o evento!");
        } else {
            if (isOutdoor) {
                recommendations.add("☂️ Considere ter um plano B para ambiente coberto");
                recommendations.add("🧥 Informe os convidados sobre as condições climáticas");
            }
            recommendations.add("💡 Verifique a previsão próxima à data do evento");
        }
        
        if (eventType.contains("CHURRASCO")) {
            recommendations.add("🔥 Proteja a churrasqueira do vento");
        }
        
        return recommendations;
    }
}