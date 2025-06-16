package com.letz.dto.achievement;

import com.letz.entity.Achievement;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AchievementResponse {
    
    private Long id;
    private String code;
    private String name;
    private String description;
    private String iconUrl;
    private Achievement.AchievementType type;
    private Achievement.AchievementRarity rarity;
    private Integer pointsRequired;
    private Integer eventsRequired;
    private Integer friendsRequired;
    private Integer pointsReward;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Status do usuário em relação a esta conquista
    private Boolean isUnlocked;
    private LocalDateTime unlockedAt;
    private Integer progressValue;
    private Boolean isFeatured;
    
    // Estatísticas da conquista
    private Long totalUnlocks;
    private Double rarityPercentage;
} 