package com.letz.dto.event;

import com.letz.dto.user.UserResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO para resposta de evento
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventResponse {

    private Long id;
    private String title;
    private String description;
    private String type;
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
    private String location;
    private String address;
    private Double latitude;
    private Double longitude;
    private UserResponse organizer;
    private Integer maxParticipants;
    private Boolean isPrivate;
    private Boolean requiresApproval;
    private BigDecimal totalCost;
    private Boolean hasCostSharing;
    private String inviteCode;
    private String status;
    private Integer totalParticipants;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Métodos auxiliares
    public String getInviteLink() {
        return "/invite/" + this.inviteCode;
    }

    public boolean isUpcoming() {
        return this.startDateTime.isAfter(LocalDateTime.now());
    }

    public boolean isOngoing() {
        LocalDateTime now = LocalDateTime.now();
        return now.isAfter(this.startDateTime) && 
               (this.endDateTime == null || now.isBefore(this.endDateTime));
    }

    public boolean isFinished() {
        return this.endDateTime != null && LocalDateTime.now().isAfter(this.endDateTime);
    }

    public boolean hasReachedMaxCapacity() {
        return maxParticipants != null && totalParticipants >= maxParticipants;
    }
} 