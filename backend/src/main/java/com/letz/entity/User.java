package com.letz.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.*;

/**
 * Entidade que representa um usuário da aplicação LETZ
 */
@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(unique = true, nullable = false)
    private String username;

    private String phoneNumber;

    @Column(columnDefinition = "TEXT")
    private String bio;

    private String profilePicture;

    private LocalDateTime birthDate;

    @Builder.Default
    private Boolean isActive = true;

    @Builder.Default
    private Boolean isEmailVerified = false;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;

    // Estatísticas de gamificação
    @Builder.Default
    private Integer eventsCreated = 0;

    @Builder.Default
    private Integer eventsAttended = 0;

    @Builder.Default
    private Integer totalFriends = 0;

    @Builder.Default
    private Integer points = 0;

    // Relacionamentos
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    @Builder.Default
    private Set<UserBadge> badges = new HashSet<>();

    @OneToMany(mappedBy = "requester", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private Set<Friendship> sentFriendRequests = new HashSet<>();

    @OneToMany(mappedBy = "addressee", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private Set<Friendship> receivedFriendRequests = new HashSet<>();

    @OneToMany(mappedBy = "organizer", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private Set<Event> organizedEvents = new HashSet<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private Set<EventParticipant> eventParticipations = new HashSet<>();

    @OneToMany(mappedBy = "sender", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private Set<Message> sentMessages = new HashSet<>();

    @OneToMany(mappedBy = "receiver", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private Set<Message> receivedMessages = new HashSet<>();

    // Auditoria
    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    // Implementação UserDetails
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return isActive;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return isActive && isEmailVerified;
    }

    // Métodos auxiliares
    public String getFullName() {
        return firstName + " " + lastName;
    }

    public void incrementEventsCreated() {
        this.eventsCreated++;
        this.points += 50; // 50 pontos por evento criado
    }

    public void incrementEventsAttended() {
        this.eventsAttended++;
        this.points += 20; // 20 pontos por evento frequentado
    }

    public void incrementTotalFriends() {
        this.totalFriends++;
        this.points += 10; // 10 pontos por novo amigo
    }

    public void decrementTotalFriends() {
        this.totalFriends = Math.max(0, this.totalFriends - 1);
        this.points = Math.max(0, this.points - 10);
    }

    public enum Role {
        USER, ADMIN
    }
} 