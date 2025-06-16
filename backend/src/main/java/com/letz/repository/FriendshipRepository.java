package com.letz.repository;

import com.letz.entity.Friendship;
import com.letz.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositório para operações com amizades
 */
@Repository
public interface FriendshipRepository extends JpaRepository<Friendship, Long> {

    @Query("SELECT f FROM Friendship f WHERE " +
           "(f.requester = :user1 AND f.addressee = :user2) OR " +
           "(f.requester = :user2 AND f.addressee = :user1)")
    Optional<Friendship> findFriendshipBetweenUsers(@Param("user1") User user1, 
                                                   @Param("user2") User user2);

    List<Friendship> findByAddresseeAndStatus(User addressee, Friendship.FriendshipStatus status);

    List<Friendship> findByRequesterAndStatus(User requester, Friendship.FriendshipStatus status);

    @Query("SELECT f FROM Friendship f WHERE " +
           "(f.requester = :user OR f.addressee = :user) " +
           "AND f.status = :status")
    List<Friendship> findByUserAndStatus(@Param("user") User user, 
                                        @Param("status") Friendship.FriendshipStatus status);

    @Query("SELECT COUNT(f) FROM Friendship f WHERE " +
           "(f.requester = :user OR f.addressee = :user) " +
           "AND f.status = 'ACCEPTED'")
    Long countFriendsByUser(@Param("user") User user);

    @Query("SELECT f FROM Friendship f WHERE f.addressee = :user " +
           "AND f.status = 'PENDING' " +
           "ORDER BY f.createdAt DESC")
    List<Friendship> findPendingFriendRequests(@Param("user") User user);

    @Query("SELECT f FROM Friendship f WHERE f.requester = :user " +
           "AND f.status = 'PENDING' " +
           "ORDER BY f.createdAt DESC")
    List<Friendship> findSentFriendRequests(@Param("user") User user);
} 