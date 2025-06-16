package com.letz.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

/**
 * Entidade que representa um evento organizado na aplicação LETZ
 */
@Entity
@Table(name = "events")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EventType type;

    @Column(nullable = false)
    private LocalDateTime startDateTime;

    private LocalDateTime endDateTime;

    // Localização
    @Column(nullable = false)
    private String location;

    private String address;

    private Double latitude;

    private Double longitude;

    // Organizador principal
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organizer_id", nullable = false)
    private User organizer;

    // Configurações do evento
    @Builder.Default
    private Integer maxParticipants = null; // null = sem limite

    @Builder.Default
    private Boolean isPrivate = true;

    @Builder.Default
    private Boolean requiresApproval = false;

    // Custos
    private BigDecimal totalCost;

    @Builder.Default
    private Boolean hasCostSharing = false;

    // Link de convite único
    @Column(unique = true)
    @Builder.Default
    private String inviteCode = UUID.randomUUID().toString();

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private EventStatus status = EventStatus.PLANNED;

    // Relacionamentos
    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private Set<EventParticipant> participants = new HashSet<>();

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private Set<EventAdmin> admins = new HashSet<>();

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private Set<EventItem> items = new HashSet<>();

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private Set<EventExpense> expenses = new HashSet<>();

    // Auditoria
    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
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

    public long getTotalParticipants() {
        return participants.stream()
                .filter(p -> p.getStatus() == EventParticipant.ParticipationStatus.CONFIRMED)
                .count();
    }

    public boolean hasReachedMaxCapacity() {
        return maxParticipants != null && getTotalParticipants() >= maxParticipants;
    }

    public enum EventType {
        CHURRASCO("Churrasco"),
        FESTA_ANIVERSARIO("Festa de Aniversário"),
        JANTAR("Jantar"),
        ALMOCO("Almoço"),
        REUNIAO_CASA("Reunião em Casa"),
        HAPPY_HOUR("Happy Hour"),
        CONFRATERNIZACAO("Confraternização"),
        OUTRO("Outro");

        private final String displayName;

        EventType(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }

    public enum EventStatus {
        PLANNED("Planejado"),
        ACTIVE("Ativo"),
        CANCELLED("Cancelado"),
        FINISHED("Finalizado");

        private final String displayName;

        EventStatus(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }
} 