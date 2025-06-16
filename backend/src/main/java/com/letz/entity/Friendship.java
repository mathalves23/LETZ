package com.letz.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * Entidade que representa uma relação de amizade entre usuários
 */
@Entity
@Table(name = "friendships")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Friendship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requester_id", nullable = false)
    private User requester; // Quem enviou a solicitação

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "addressee_id", nullable = false)
    private User addressee; // Quem recebeu a solicitação

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private FriendshipStatus status = FriendshipStatus.PENDING;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    private LocalDateTime acceptedAt;

    // Método para aceitar a amizade
    public void accept() {
        this.status = FriendshipStatus.ACCEPTED;
        this.acceptedAt = LocalDateTime.now();
    }

    // Método para rejeitar a amizade
    public void reject() {
        this.status = FriendshipStatus.REJECTED;
    }

    // Método para bloquear
    public void block() {
        this.status = FriendshipStatus.BLOCKED;
    }

    // Verificar se os usuários são amigos
    public boolean areFriends() {
        return this.status == FriendshipStatus.ACCEPTED;
    }

    public enum FriendshipStatus {
        PENDING("Pendente"),
        ACCEPTED("Aceito"),
        REJECTED("Rejeitado"),
        BLOCKED("Bloqueado");

        private final String displayName;

        FriendshipStatus(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }
} 