package com.letz.dto.gamification;

import com.letz.dto.achievement.AchievementResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserStatsResponse {
    
    // Informações básicas do usuário
    private Long userId;
    private String firstName;
    private String lastName;
    private String profilePicture;
    
    // Estatísticas de gamificação
    private Integer totalPoints;
    private Integer currentLevel;
    private Integer pointsToNextLevel;
    private Double progressToNextLevel; // 0-100%
    
    // Conquistas
    private Long totalAchievements;
    private Long commonAchievements;
    private Long uncommonAchievements;
    private Long rareAchievements;
    private Long epicAchievements;
    private Long legendaryAchievements;
    private List<AchievementResponse> recentAchievements;
    private List<AchievementResponse> featuredAchievements;
    
    // Estatísticas gerais
    private Integer eventsCreated;
    private Integer eventsAttended;
    private Integer totalFriends;
    private Integer rankingPosition;
    private Integer totalUsers;
    
    // Badges especiais
    private List<String> specialBadges;
    
    // Progresso para próximas conquistas
    private List<AchievementProgressResponse> nextAchievements;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AchievementProgressResponse {
        private Long achievementId;
        private String name;
        private String description;
        private String iconUrl;
        private Integer currentProgress;
        private Integer requiredProgress;
        private Double progressPercentage;
        private String progressType; // "EVENTS", "FRIENDS", "POINTS"
    }
} 