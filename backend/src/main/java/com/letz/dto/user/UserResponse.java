package com.letz.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO para resposta de usuário
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String username;
    private String phoneNumber;
    private String bio;
    private String profilePicture;
    private LocalDateTime birthDate;
    private Boolean isActive;
    private Boolean isEmailVerified;
    
    // Estatísticas de gamificação
    private Integer eventsCreated;
    private Integer eventsAttended;
    private Integer totalFriends;
    private Integer points;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public String getFullName() {
        return firstName + " " + lastName;
    }
} 