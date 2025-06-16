package com.letz.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ChatBotResponse {
    private String response;
    private double confidence;
    private List<String> suggestions;
} 