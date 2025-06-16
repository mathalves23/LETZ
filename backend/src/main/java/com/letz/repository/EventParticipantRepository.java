package com.letz.repository;

import com.letz.entity.Event;
import com.letz.entity.EventParticipant;
import com.letz.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositório para participantes de eventos
 */
@Repository
public interface EventParticipantRepository extends JpaRepository<EventParticipant, Long> {

    List<EventParticipant> findByEventOrderByCreatedAtAsc(Event event);

    List<EventParticipant> findByUserOrderByCreatedAtDesc(User user);

    Optional<EventParticipant> findByEventAndUser(Event event, User user);

    List<EventParticipant> findByEventAndStatus(Event event, EventParticipant.ParticipationStatus status);

    @Query("SELECT ep FROM EventParticipant ep WHERE ep.user = :user " +
           "AND ep.status = 'CONFIRMED' " +
           "ORDER BY ep.event.startDateTime DESC")
    List<EventParticipant> findConfirmedParticipationsByUser(@Param("user") User user);

    @Query("SELECT ep FROM EventParticipant ep WHERE ep.user = :user " +
           "AND ep.status = 'PENDING' " +
           "ORDER BY ep.event.startDateTime ASC")
    List<EventParticipant> findPendingParticipationsByUser(@Param("user") User user);

    @Query("SELECT COUNT(ep) FROM EventParticipant ep WHERE ep.event = :event " +
           "AND ep.status = 'CONFIRMED'")
    Long countConfirmedParticipantsByEvent(@Param("event") Event event);

    @Query("SELECT COUNT(ep) FROM EventParticipant ep WHERE ep.user = :user " +
           "AND ep.status = 'CONFIRMED' " +
           "AND ep.hasAttended = true")
    Long countAttendedEventsByUser(@Param("user") User user);

    boolean existsByEventAndUser(Event event, User user);
    
    // Métodos para Analytics e Gamificação
    int countByEvent(Event event);
    
    long countByUser(User user);
    
    List<EventParticipant> findByUser(User user);
} 