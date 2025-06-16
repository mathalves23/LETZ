package com.letz.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Entidade que representa uma conquista/badge do sistema de gamificação
 */
@Entity
@Table(name = "badges")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Badge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private String icon;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BadgeType type;

    @Column(nullable = false)
    private Integer pointsRequired;

    @Builder.Default
    private Integer points = 0; // Pontos que o badge vale

    @Column(nullable = false)
    private String condition; // Condição em formato JSON ou string

    @Builder.Default
    private Boolean isActive = true;

    @OneToMany(mappedBy = "badge", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private Set<UserBadge> userBadges = new HashSet<>();

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    public enum BadgeType {
        ORGANIZER("Organizador"),
        PARTICIPANT("Participante"),
        SOCIAL("Social"),
        MILESTONE("Marco"),
        SPECIAL("Especial");

        private final String displayName;

        BadgeType(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }
} 