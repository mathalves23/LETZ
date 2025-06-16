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

/**
 * Entidade que representa um item que deve ser levado ao evento
 */
@Entity
@Table(name = "event_items")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class EventItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @Column(nullable = false)
    private String name;

    private String description;

    @Builder.Default
    private Integer quantity = 1;

    private String category; // Ex: Bebida, Comida, Utensílios, etc.

    @Builder.Default
    private Boolean isRequired = false;

    // Para itens que são dinheiro
    @Builder.Default
    private Boolean isMonetary = false;

    private BigDecimal estimatedCost;

    // Responsável pelo item
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to_id")
    private User assignedTo;

    @Builder.Default
    private Boolean isCompleted = false;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    private LocalDateTime completedAt;

    // Métodos auxiliares
    public void assignTo(User user) {
        this.assignedTo = user;
    }

    public void markAsCompleted() {
        this.isCompleted = true;
        this.completedAt = LocalDateTime.now();
    }

    public void markAsIncomplete() {
        this.isCompleted = false;
        this.completedAt = null;
    }

    public boolean isAssigned() {
        return this.assignedTo != null;
    }
} 