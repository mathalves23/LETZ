package com.letz.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "tickets")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ticket {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(name = "ticket_code", unique = true, nullable = false)
    private String ticketCode;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "ticket_type", nullable = false)
    private TicketType ticketType;
    
    @Column(name = "price", precision = 10, scale = 2)
    private BigDecimal price;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private TicketStatus status;
    
    @Column(name = "qr_code")
    private String qrCode;
    
    @Column(name = "seat_number")
    private String seatNumber;
    
    @Column(name = "valid_from")
    private LocalDateTime validFrom;
    
    @Column(name = "valid_until")
    private LocalDateTime validUntil;
    
    @Column(name = "checked_in_at")
    private LocalDateTime checkedInAt;
    
    @Column(name = "checked_in_by")
    private String checkedInBy;
    
    @Column(name = "special_notes")
    private String specialNotes;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Enums
    public enum TicketType {
        FREE("Gratuito"),
        PAID("Pago"),
        VIP("VIP"),
        EARLY_BIRD("Promocional"),
        STUDENT("Estudante"),
        SENIOR("Idoso"),
        GROUP("Grupo");
        
        private final String displayName;
        
        TicketType(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
    
    public enum TicketStatus {
        PENDING("Pendente"),
        CONFIRMED("Confirmado"),
        CANCELLED("Cancelado"),
        USED("Utilizado"),
        EXPIRED("Expirado"),
        REFUNDED("Reembolsado");
        
        private final String displayName;
        
        TicketStatus(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
    
    // Métodos auxiliares
    public boolean isValid() {
        LocalDateTime now = LocalDateTime.now();
        return status == TicketStatus.CONFIRMED && 
               (validFrom == null || now.isAfter(validFrom)) &&
               (validUntil == null || now.isBefore(validUntil));
    }
    
    public boolean canCheckIn() {
        return isValid() && checkedInAt == null;
    }
    
    public void checkIn(String checkedInBy) {
        if (!canCheckIn()) {
            throw new IllegalStateException("Ticket não pode ser usado para check-in");
        }
        this.checkedInAt = LocalDateTime.now();
        this.checkedInBy = checkedInBy;
        this.status = TicketStatus.USED;
    }
} 