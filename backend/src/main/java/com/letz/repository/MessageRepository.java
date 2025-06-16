package com.letz.repository;

import com.letz.entity.Message;
import com.letz.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositório para mensagens
 */
@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    @Query("SELECT m FROM Message m WHERE " +
           "(m.sender = :user1 AND m.receiver = :user2) OR " +
           "(m.sender = :user2 AND m.receiver = :user1) " +
           "ORDER BY m.createdAt ASC")
    List<Message> findConversationBetweenUsers(@Param("user1") User user1, 
                                              @Param("user2") User user2);

    @Query("SELECT DISTINCT CASE " +
           "    WHEN m.sender = :user THEN m.receiver " +
           "    ELSE m.sender " +
           "END " +
           "FROM Message m " +
           "WHERE m.sender = :user OR m.receiver = :user " +
           "ORDER BY MAX(m.createdAt) DESC")
    List<User> findConversationPartners(@Param("user") User user);

    List<Message> findByReceiverAndIsReadFalseOrderByCreatedAtDesc(User receiver);

    @Query("SELECT COUNT(m) FROM Message m WHERE m.receiver = :user AND m.isRead = false")
    Long countUnreadMessagesByUser(@Param("user") User user);

    List<Message> findBySenderOrderByCreatedAtDesc(User sender);

    List<Message> findByReceiverOrderByCreatedAtDesc(User receiver);

    @Query("SELECT m FROM Message m WHERE m.relatedEvent IS NOT NULL " +
           "AND (m.sender = :user OR m.receiver = :user) " +
           "ORDER BY m.createdAt DESC")
    List<Message> findEventRelatedMessagesByUser(@Param("user") User user);
} 