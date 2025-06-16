package com.letz.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "event_reviews", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"event_id", "user_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventReview {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Min(value = 1, message = "Avaliação deve ser entre 1 e 5")
    @Max(value = 5, message = "Avaliação deve ser entre 1 e 5")
    @Column(name = "overall_rating", nullable = false)
    private Integer overallRating;
    
    @Min(value = 1)
    @Max(value = 5)
    @Column(name = "organization_rating")
    private Integer organizationRating; // Organização do evento
    
    @Min(value = 1)
    @Max(value = 5)
    @Column(name = "location_rating")
    private Integer locationRating; // Local do evento
    
    @Min(value = 1)
    @Max(value = 5)
    @Column(name = "value_rating")
    private Integer valueRating; // Custo-benefício
    
    @Min(value = 1)
    @Max(value = 5)
    @Column(name = "food_rating")
    private Integer foodRating; // Comida (se aplicável)
    
    @Min(value = 1)
    @Max(value = 5)
    @Column(name = "entertainment_rating")
    private Integer entertainmentRating; // Entretenimento
    
    @Size(max = 1000, message = "Comentário deve ter no máximo 1000 caracteres")
    @Column(name = "comment", length = 1000)
    private String comment;
    
    @Column(name = "would_recommend", nullable = false)
    private Boolean wouldRecommend;
    
    @Column(name = "would_attend_again", nullable = false)
    private Boolean wouldAttendAgain;
    
    @ElementCollection
    @CollectionTable(name = "review_tags", joinColumns = @JoinColumn(name = "review_id"))
    @Column(name = "tag")
    private List<String> tags; // Tags como "divertido", "bem organizado", etc.
    
    @Column(name = "helpful_count", nullable = false)
    private Integer helpfulCount = 0;
    
    @Column(name = "not_helpful_count", nullable = false)
    private Integer notHelpfulCount = 0;
    
    @Column(name = "is_verified", nullable = false)
    private Boolean isVerified = false; // Se o usuário realmente participou
    
    @Column(name = "is_anonymous", nullable = false)
    private Boolean isAnonymous = false;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ReviewStatus status = ReviewStatus.ACTIVE;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Enum
    public enum ReviewStatus {
        ACTIVE("Ativo"),
        HIDDEN("Oculto"),
        REPORTED("Reportado"),
        DELETED("Deletado");
        
        private final String displayName;
        
        ReviewStatus(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
    
    // Métodos auxiliares
    public Double getAverageRating() {
        int count = 0;
        int total = 0;
        
        if (overallRating != null) {
            total += overallRating;
            count++;
        }
        if (organizationRating != null) {
            total += organizationRating;
            count++;
        }
        if (locationRating != null) {
            total += locationRating;
            count++;
        }
        if (valueRating != null) {
            total += valueRating;
            count++;
        }
        if (foodRating != null) {
            total += foodRating;
            count++;
        }
        if (entertainmentRating != null) {
            total += entertainmentRating;
            count++;
        }
        
        return count > 0 ? (double) total / count : 0.0;
    }
    
    public void markAsHelpful() {
        this.helpfulCount++;
    }
    
    public void markAsNotHelpful() {
        this.notHelpfulCount++;
    }
    
    public boolean isPositive() {
        return overallRating != null && overallRating >= 4;
    }
    
    public boolean isNegative() {
        return overallRating != null && overallRating <= 2;
    }
    
    public int getHelpfulnessScore() {
        return helpfulCount - notHelpfulCount;
    }
} 