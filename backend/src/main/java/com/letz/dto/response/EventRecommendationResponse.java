package com.letz.dto.response;

import com.letz.entity.Event;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class EventRecommendationResponse {
    private Event event;
    private double score;
    private List<String> reasons;
    private double confidence;
} 