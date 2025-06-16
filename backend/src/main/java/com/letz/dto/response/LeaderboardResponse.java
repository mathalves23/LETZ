package com.letz.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LeaderboardResponse {
    private Long userId;
    private String username;
    private String name;
    private int points;
    private int level;
    private String levelName;
    private int badges;
    private int achievements;
    private int eventsCreated;
    private int eventsAttended;
    private String profilePicture;
} 