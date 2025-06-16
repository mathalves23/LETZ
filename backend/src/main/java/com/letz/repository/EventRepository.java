package com.letz.repository;

import com.letz.entity.Event;
import com.letz.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    Optional<Event> findByInviteCode(String inviteCode);
    List<Event> findByOrganizerOrderByStartDateTimeDesc(User organizer);
    List<Event> findByOrganizer(User organizer);

    @Query("SELECT e FROM Event e WHERE e.startDateTime > :now AND e.status = 'PLANNED' ORDER BY e.startDateTime ASC")
    List<Event> findUpcomingEvents(@Param("now") LocalDateTime now);

    @Query("SELECT COUNT(e) FROM Event e WHERE e.organizer = :user")
    Long countEventsByOrganizer(@Param("user") User user);

    // Métodos adicionais para compatibilidade
    @Query("SELECT e FROM Event e JOIN e.participants p WHERE p.user = :user")
    List<Event> findEventsByParticipant(@Param("user") User user);

    @Query("SELECT e FROM Event e LEFT JOIN e.participants p WHERE (e.organizer = :user OR p.user = :user) AND e.startDateTime BETWEEN :start AND :end")
    List<Event> findUpcomingEventsByUser(@Param("user") User user, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}