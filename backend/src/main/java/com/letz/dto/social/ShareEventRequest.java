package com.letz.dto.social;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShareEventRequest {
    
    private Long eventId;
    private List<String> platforms; // "facebook", "instagram", "whatsapp", "twitter", "linkedin"
    private String customMessage;
    private Boolean includeEventImage;
    private Boolean includeLocation;
    private Boolean includeDateTime;
    private List<String> tags;
    
    // Configurações específicas por plataforma
    private FacebookShareConfig facebook;
    private InstagramShareConfig instagram;
    private WhatsAppShareConfig whatsapp;
    private TwitterShareConfig twitter;
    private LinkedInShareConfig linkedin;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FacebookShareConfig {
        private String pageId;
        private Boolean shareToTimeline;
        private Boolean shareToPage;
        private List<String> targetAudience;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InstagramShareConfig {
        private Boolean shareAsStory;
        private Boolean shareAsPost;
        private List<String> hashtags;
        private String storyTemplate;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WhatsAppShareConfig {
        private List<String> contactNumbers;
        private List<String> groupIds;
        private Boolean includeInviteLink;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TwitterShareConfig {
        private List<String> hashtags;
        private List<String> mentions;
        private Boolean includeThread;
        private Integer maxTweets;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LinkedInShareConfig {
        private Boolean shareToProfile;
        private Boolean shareToCompany;
        private String companyId;
        private List<String> targetConnections;
    }
} 