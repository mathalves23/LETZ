package com.letz.dto.report;

import com.letz.dto.event.EventResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventReportResponse {
    private EventResponse event;
    private ParticipationStats participationStats;
    private FinancialStats financialStats;
    private List<ItemCompletionStats> itemStats;
    private List<ParticipantFeedback> feedback;
    private Map<String, Object> analytics;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ParticipationStats {
        private int totalParticipants;
        private int confirmedParticipants;
        private int pendingParticipants;
        private int declinedParticipants;
        private double participationRate;
        private LocalDateTime lastJoin;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FinancialStats {
        private BigDecimal totalBudget;
        private BigDecimal totalSpent;
        private BigDecimal remainingBudget;
        private BigDecimal averageContribution;
        private List<ExpenseBreakdown> expenses;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ExpenseBreakdown {
        private String category;
        private BigDecimal amount;
        private String description;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ItemCompletionStats {
        private String itemName;
        private String category;
        private boolean isCompleted;
        private String assignedTo;
        private LocalDateTime completedAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ParticipantFeedback {
        private String participantName;
        private int rating;
        private String comment;
        private LocalDateTime submittedAt;
    }
} 