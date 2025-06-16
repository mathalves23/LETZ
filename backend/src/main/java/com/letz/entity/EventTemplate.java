package com.letz.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "event_templates")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Event.EventType type;

    @Column(name = "default_duration_hours")
    private Integer defaultDurationHours;

    @Column(name = "default_max_participants")
    private Integer defaultMaxParticipants;

    @Column(name = "estimated_cost", precision = 10, scale = 2)
    private BigDecimal estimatedCost;

    @Column(name = "is_public")
    private Boolean isPublic = true;

    @Column(name = "is_system_template")
    private Boolean isSystemTemplate = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    @Column(name = "usage_count")
    private Long usageCount = 0L;

    @Column(name = "rating")
    private Double rating = 0.0;

    @Column(name = "rating_count")
    private Long ratingCount = 0L;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Enumerated(EnumType.STRING)
    private TemplateCategory category;

    // Lista de itens padrão do template (JSON)
    @Column(name = "default_items", columnDefinition = "TEXT")
    private String defaultItems;

    // Configurações padrão (JSON)
    @Column(name = "default_settings", columnDefinition = "TEXT")
    private String defaultSettings;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum TemplateCategory {
        POPULAR,           // Mais populares
        SEASONAL,          // Sazonais (Natal, Ano Novo, etc.)
        CASUAL,            // Eventos casuais
        FORMAL,            // Eventos formais
        OUTDOOR,           // Ao ar livre
        INDOOR,            // Ambiente fechado
        FAMILY,            // Familiar
        FRIENDS,           // Entre amigos
        WORK,              // Corporativo
        CELEBRATION,       // Comemorações
        SPORTS,            // Esportivos
        CULTURAL,          // Culturais
        FOOD               // Gastronômicos
    }
} 