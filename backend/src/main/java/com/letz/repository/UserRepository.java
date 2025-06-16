package com.letz.repository;

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

/**
 * Repositório para operações com usuários
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByUsername(String username);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    List<User> findByIsActiveTrue();

    @Query("SELECT u FROM User u WHERE " +
           "(LOWER(u.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(u.username) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
           "AND u.isActive = true")
    Page<User> findUsersBySearchTerm(@Param("searchTerm") String searchTerm, Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.id != :currentUserId " +
           "AND u.id NOT IN (" +
           "   SELECT CASE " +
           "       WHEN f.requester.id = :currentUserId THEN f.addressee.id " +
           "       ELSE f.requester.id " +
           "   END " +
           "   FROM Friendship f " +
           "   WHERE (f.requester.id = :currentUserId OR f.addressee.id = :currentUserId) " +
           "   AND f.status = 'ACCEPTED'" +
           ") " +
           "AND u.isActive = true")
    List<User> findPotentialFriends(@Param("currentUserId") Long currentUserId);

    @Query("SELECT u FROM User u " +
           "WHERE u.id IN (" +
           "   SELECT CASE " +
           "       WHEN f.requester.id = :userId THEN f.addressee.id " +
           "       ELSE f.requester.id " +
           "   END " +
           "   FROM Friendship f " +
           "   WHERE (f.requester.id = :userId OR f.addressee.id = :userId) " +
           "   AND f.status = 'ACCEPTED'" +
           ")")
    List<User> findFriendsByUserId(@Param("userId") Long userId);

    @Query("SELECT u FROM User u ORDER BY u.points DESC")
    List<User> findUsersOrderByPointsDesc();

    @Query("SELECT u FROM User u WHERE " +
           "LOWER(u.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(u.username) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<User> searchUsers(@Param("searchTerm") String searchTerm);

    @Query("SELECT u FROM User u ORDER BY u.eventsCreated DESC")
    List<User> findUsersOrderByEventsCreatedDesc();

    @Query("SELECT u FROM User u ORDER BY u.eventsAttended DESC")
    List<User> findUsersOrderByEventsAttendedDesc();
    
    // Métodos para Analytics
    long countByUpdatedAtAfter(LocalDateTime date);
    
    long countByCreatedAtAfter(LocalDateTime date);
    
    long countByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<User> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    // Métodos para Gamificação
    @Query("SELECT u FROM User u ORDER BY u.points DESC")
    List<User> findTopUsersByPoints(Pageable pageable);
    
    @Query("SELECT u FROM User u ORDER BY u.eventsCreated DESC")
    List<User> findTopOrganizers(Pageable pageable);
    
    @Query("SELECT u FROM User u ORDER BY u.eventsAttended DESC")
    List<User> findTopParticipants(Pageable pageable);
    
    @Query("SELECT u FROM User u ORDER BY u.totalFriends DESC")
    List<User> findTopSocialUsers(Pageable pageable);
    
    @Query("SELECT u FROM User u WHERE u.updatedAt > :date")
    List<User> findActiveUsers(@Param("date") LocalDateTime date);
    
    @Query("SELECT u FROM User u ORDER BY u.points DESC")
    List<User> findAllOrderByPointsDesc();
    
    default List<User> findTopUsersByPoints(int limit) {
        return findUsersOrderByPointsDesc().stream().limit(limit).toList();
    }
}