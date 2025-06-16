package com.letz.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Table(name = "activity_feed")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityFeed {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // Usuário que fez a ação
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_user_id")
    private User targetUser; // Usuário alvo (para amizades, etc.)
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id")
    private Event event; // Evento relacionado (se aplicável)
    
    @Enumerated(EnumType.STRING)
    @Column(name = "activity_type", nullable = false)
    private ActivityType activityType;
    
    @Column(name = "title", nullable = false)
    private String title;
    
    @Column(name = "description")
    private String description;
    
    @Column(name = "image_url")
    private String imageUrl;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "privacy_level", nullable = false)
    private PrivacyLevel privacyLevel;
    
    @ElementCollection
    @CollectionTable(name = "activity_metadata", joinColumns = @JoinColumn(name = "activity_id"))
    @MapKeyColumn(name = "metadata_key")
    @Column(name = "metadata_value")
    private Map<String, String> metadata;
    
    @Column(name = "likes_count", nullable = false)
    private Integer likesCount = 0;
    
    @Column(name = "comments_count", nullable = false)
    private Integer commentsCount = 0;
    
    @Column(name = "shares_count", nullable = false)
    private Integer sharesCount = 0;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    // Enums
    public enum ActivityType {
        // Eventos
        EVENT_CREATED("criou um evento"),
        EVENT_JOINED("confirmou presença em"),
        EVENT_LEFT("saiu do evento"),
        EVENT_COMPLETED("participou do evento"),
        EVENT_CANCELLED("cancelou o evento"),
        EVENT_UPDATED("atualizou o evento"),
        
        // Social
        FRIEND_REQUEST_SENT("enviou solicitação de amizade para"),
        FRIEND_REQUEST_ACCEPTED("aceitou a amizade de"),
        FRIEND_ADDED("agora é amigo de"),
        
        // Conquistas
        ACHIEVEMENT_UNLOCKED("desbloqueou a conquista"),
        LEVEL_UP("subiu para o nível"),
        BADGE_EARNED("ganhou o badge"),
        
        // Conteúdo
        PHOTO_UPLOADED("enviou uma foto"),
        REVIEW_POSTED("avaliou o evento"),
        COMMENT_POSTED("comentou"),
        
        // Sistema
        PROFILE_UPDATED("atualizou o perfil"),
        FIRST_EVENT("criou seu primeiro evento"),
        MILESTONE_REACHED("alcançou um marco");
        
        private final String displayText;
        
        ActivityType(String displayText) {
            this.displayText = displayText;
        }
        
        public String getDisplayText() {
            return displayText;
        }
    }
    
    public enum PrivacyLevel {
        PUBLIC("Público"),
        FRIENDS("Amigos"),
        PRIVATE("Privado");
        
        private final String displayName;
        
        PrivacyLevel(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
    
    // Métodos auxiliares
    public void incrementLikes() {
        this.likesCount++;
    }
    
    public void decrementLikes() {
        if (this.likesCount > 0) {
            this.likesCount--;
        }
    }
    
    public void incrementComments() {
        this.commentsCount++;
    }
    
    public void incrementShares() {
        this.sharesCount++;
    }
    
    // Método para gerar o texto da atividade
    public String generateActivityText() {
        StringBuilder text = new StringBuilder();
        text.append(user.getFirstName()).append(" ").append(activityType.getDisplayText());
        
        if (targetUser != null) {
            text.append(" ").append(targetUser.getFirstName());
        }
        
        if (event != null) {
            text.append(" \"").append(event.getTitle()).append("\"");
        }
        
        return text.toString();
    }
} 