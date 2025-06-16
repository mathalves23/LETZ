package com.letz.repository;

import com.letz.entity.Event;
import com.letz.entity.EventItem;
import com.letz.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

/**
 * Repositório para itens de eventos
 */
@Repository
public interface EventItemRepository extends JpaRepository<EventItem, Long> {

    List<EventItem> findByEventOrderByCreatedAtAsc(Event event);

    List<EventItem> findByAssignedToOrderByCreatedAtDesc(User assignedTo);

    List<EventItem> findByEventAndAssignedToIsNull(Event event);

    List<EventItem> findByEventAndIsCompletedFalse(Event event);

    List<EventItem> findByEventAndIsCompletedTrue(Event event);

    List<EventItem> findByEventAndIsRequiredTrue(Event event);

    List<EventItem> findByEventAndIsMonetaryTrue(Event event);

    @Query("SELECT ei FROM EventItem ei WHERE ei.event = :event " +
           "AND ei.category = :category " +
           "ORDER BY ei.createdAt ASC")
    List<EventItem> findByEventAndCategory(@Param("event") Event event, 
                                          @Param("category") String category);

    @Query("SELECT COUNT(ei) FROM EventItem ei WHERE ei.event = :event " +
           "AND ei.isCompleted = true")
    Long countCompletedItemsByEvent(@Param("event") Event event);

    @Query("SELECT COUNT(ei) FROM EventItem ei WHERE ei.event = :event")
    Long countTotalItemsByEvent(@Param("event") Event event);

    @Query("SELECT SUM(ei.estimatedCost) FROM EventItem ei WHERE ei.event = :event " +
           "AND ei.estimatedCost IS NOT NULL")
    BigDecimal sumEstimatedCostByEvent(@Param("event") Event event);

    @Query("SELECT ei FROM EventItem ei WHERE ei.assignedTo = :user " +
           "AND ei.isCompleted = false " +
           "ORDER BY ei.event.startDateTime ASC")
    List<EventItem> findPendingItemsByUser(@Param("user") User user);

    @Query("SELECT DISTINCT ei.category FROM EventItem ei WHERE ei.event = :event " +
           "AND ei.category IS NOT NULL")
    List<String> findCategoriesByEvent(@Param("event") Event event);
} 