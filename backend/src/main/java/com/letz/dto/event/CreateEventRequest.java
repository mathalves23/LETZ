package com.letz.dto.event;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO para requisição de criação de evento
 */
@Data
public class CreateEventRequest {

    @NotBlank(message = "Título é obrigatório")
    private String title;

    private String description;

    @NotBlank(message = "Tipo do evento é obrigatório")
    private String type;

    @NotNull(message = "Data de início é obrigatória")
    @Future(message = "Data de início deve ser no futuro")
    private LocalDateTime startDateTime;

    private LocalDateTime endDateTime;

    @NotBlank(message = "Local é obrigatório")
    private String location;

    private String address;

    private Double latitude;

    private Double longitude;

    private Integer maxParticipants;

    private Boolean isPrivate = true;

    private Boolean requiresApproval = false;

    private BigDecimal totalCost;

    private Boolean hasCostSharing = false;
} 