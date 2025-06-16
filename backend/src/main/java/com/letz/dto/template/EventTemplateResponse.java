package com.letz.dto.template;

import com.letz.dto.user.UserResponse;
import com.letz.entity.Event;
import com.letz.entity.EventTemplate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventTemplateResponse {

    private Long id;
    private String name;
    private String description;
    private Event.EventType type;
    private Integer defaultDurationHours;
    private Integer defaultMaxParticipants;
    private BigDecimal estimatedCost;
    private Boolean isPublic;
    private Boolean isSystemTemplate;
    private UserResponse createdBy;
    private Long usageCount;
    private Double rating;
    private Long ratingCount;
    private String imageUrl;
    private EventTemplate.TemplateCategory category;
    private String defaultItems;
    private String defaultSettings;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 