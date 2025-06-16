package com.letz.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.time.DayOfWeek;
import java.util.Set;
import java.util.List;

@Entity
@Table(name = "recurring_events")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecurringEvent {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "template_event_id", nullable = false)
    private Event templateEvent; // Evento modelo
    
    @Enumerated(EnumType.STRING)
    @Column(name = "recurrence_type", nullable = false)
    private RecurrenceType recurrenceType;
    
    @Column(name = "recurrence_interval", nullable = false)
    private Integer recurrenceInterval = 1; // A cada X períodos
    
    @ElementCollection(targetClass = DayOfWeek.class)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "recurring_event_days", joinColumns = @JoinColumn(name = "recurring_event_id"))
    @Column(name = "day_of_week")
    private Set<DayOfWeek> daysOfWeek; // Para recorrência semanal
    
    @Column(name = "day_of_month")
    private Integer dayOfMonth; // Para recorrência mensal (dia específico)
    
    @Column(name = "week_of_month")
    private Integer weekOfMonth; // Para recorrência mensal (primeira segunda, etc.)
    
    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;
    
    @Column(name = "end_date")
    private LocalDateTime endDate; // Quando parar a recorrência
    
    @Column(name = "max_occurrences")
    private Integer maxOccurrences; // Máximo de ocorrências
    
    @Column(name = "current_occurrences", nullable = false)
    private Integer currentOccurrences = 0;
    
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
    
    @OneToMany(mappedBy = "recurringEvent", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Event> generatedEvents; // Eventos gerados
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Enums
    public enum RecurrenceType {
        DAILY("Diário"),
        WEEKLY("Semanal"),
        MONTHLY("Mensal"),
        YEARLY("Anual"),
        CUSTOM("Personalizado");
        
        private final String displayName;
        
        RecurrenceType(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
    
    // Métodos auxiliares
    public boolean canGenerateMore() {
        if (!isActive) return false;
        
        LocalDateTime now = LocalDateTime.now();
        
        // Verificar se passou da data final
        if (endDate != null && now.isAfter(endDate)) {
            return false;
        }
        
        // Verificar se atingiu o máximo de ocorrências
        if (maxOccurrences != null && currentOccurrences >= maxOccurrences) {
            return false;
        }
        
        return true;
    }
    
    public LocalDateTime getNextOccurrence() {
        LocalDateTime lastEventDate = startDate;
        
        // Se já temos eventos gerados, pegar a data do último
        if (generatedEvents != null && !generatedEvents.isEmpty()) {
            lastEventDate = generatedEvents.stream()
                .map(Event::getStartDateTime)
                .max(LocalDateTime::compareTo)
                .orElse(startDate);
        }
        
        return calculateNextDate(lastEventDate);
    }
    
    private LocalDateTime calculateNextDate(LocalDateTime fromDate) {
        switch (recurrenceType) {
            case DAILY:
                return fromDate.plusDays(recurrenceInterval);
                
            case WEEKLY:
                return fromDate.plusWeeks(recurrenceInterval);
                
            case MONTHLY:
                if (dayOfMonth != null) {
                    return fromDate.plusMonths(recurrenceInterval).withDayOfMonth(dayOfMonth);
                } else {
                    return fromDate.plusMonths(recurrenceInterval);
                }
                
            case YEARLY:
                return fromDate.plusYears(recurrenceInterval);
                
            default:
                return fromDate.plusDays(recurrenceInterval);
        }
    }
    
    public void incrementOccurrences() {
        this.currentOccurrences++;
    }
    
    public boolean shouldStop() {
        return !canGenerateMore();
    }
} 