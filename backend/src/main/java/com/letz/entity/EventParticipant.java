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
 * Entidade que representa a participação de um usuário em um evento
 */
@Entity
@Table(name = "event_participants")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class EventParticipant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ParticipationStatus status = ParticipationStatus.PENDING;

    @Builder.Default
    private Boolean hasAttended = false;

    private String notes; // Observações do participante

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    private LocalDateTime confirmedAt;

    // Métodos para mudar status
    public void confirm() {
        this.status = ParticipationStatus.CONFIRMED;
        this.confirmedAt = LocalDateTime.now();
    }

    public void decline() {
        this.status = ParticipationStatus.DECLINED;
    }

    public void markAsAttended() {
        this.hasAttended = true;
    }

    public enum ParticipationStatus {
        PENDING("Pendente"),
        CONFIRMED("Confirmado"),
        DECLINED("Recusado"),
        CANCELLED("Cancelado");

        private final String displayName;

        ParticipationStatus(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }
} 