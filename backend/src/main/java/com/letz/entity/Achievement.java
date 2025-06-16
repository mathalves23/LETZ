package com.letz.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "achievements")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Achievement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String code;

    @Column(nullable = false)
    private String name;

    @Column(length = 500)
    private String description;

    @Column(name = "icon_url")
    private String iconUrl;

    @Enumerated(EnumType.STRING)
    private AchievementType type;

    @Enumerated(EnumType.STRING)
    private AchievementRarity rarity;

    @Column(name = "points_required")
    private Integer pointsRequired;

    @Column(name = "events_required")
    private Integer eventsRequired;

    @Column(name = "friends_required")
    private Integer friendsRequired;

    @Column(name = "points_reward")
    private Integer pointsReward;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Métodos auxiliares
    public Integer getPoints() {
        return pointsReward != null ? pointsReward : 0;
    }

    public enum AchievementType {
        SOCIAL,           // Relacionado a amizades
        ORGANIZER,        // Relacionado a organização de eventos
        PARTICIPANT,      // Relacionado a participação
        FINANCIAL,        // Relacionado a contribuições financeiras
        STREAK,           // Relacionado a sequências
        SPECIAL,          // Conquistas especiais
        SEASONAL          // Conquistas sazonais
    }

    public enum AchievementRarity {
        COMMON,           // Bronze - Fácil de conseguir
        UNCOMMON,         // Prata - Moderadamente difícil
        RARE,             // Ouro - Difícil
        EPIC,             // Platina - Muito difícil
        LEGENDARY         // Diamante - Extremamente raro
    }
} 