package com.letz.dto.template;

import com.letz.entity.Event;
import com.letz.entity.EventTemplate;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventTemplateRequest {

    @NotBlank(message = "Nome do template é obrigatório")
    private String name;

    private String description;

    @NotNull(message = "Tipo do evento é obrigatório")
    private Event.EventType type;

    private Integer defaultDurationHours;

    private Integer defaultMaxParticipants;

    private BigDecimal estimatedCost;

    private Boolean isPublic = true;

    @NotNull(message = "Categoria é obrigatória")
    private EventTemplate.TemplateCategory category;

    private String imageUrl;

    private String defaultItems; // JSON string

    private String defaultSettings; // JSON string
} 