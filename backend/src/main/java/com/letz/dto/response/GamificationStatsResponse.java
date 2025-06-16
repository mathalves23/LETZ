package com.letz.dto.response;

import com.letz.entity.Badge;
import com.letz.entity.Achievement;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class GamificationStatsResponse {
    private Long userId;
    private int totalPoints;
    private int level;
    private String levelName;
    private int pointsToNextLevel;
    private List<Badge> badges;
    private List<Achievement> achievements;
    private int streak;
    private int rank;
    private int weeklyPoints;
    private int monthlyPoints;
} 