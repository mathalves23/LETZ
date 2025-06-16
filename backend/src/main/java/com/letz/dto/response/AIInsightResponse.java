package com.letz.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@Builder
public class AIInsightResponse {
    private String type;
    private String title;
    private String description;
    private double confidence;
    private List<String> insights;
    private Map<String, Object> data;
} 