package com.letz.repository;

import com.letz.entity.EventReview;
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
public interface EventReviewRepository extends JpaRepository<EventReview, Long> {

    List<EventReview> findByEventId(Long eventId);

    Page<EventReview> findByEventId(Long eventId, Pageable pageable);

    List<EventReview> findByReviewerId(Long reviewerId);

    Page<EventReview> findByReviewerId(Long reviewerId, Pageable pageable);

    Optional<EventReview> findByEventIdAndReviewerId(Long eventId, Long reviewerId);

    boolean existsByEventIdAndReviewerId(Long eventId, Long reviewerId);

    @Query("SELECT AVG(r.rating) FROM EventReview r WHERE r.event.id = :eventId")
    Double getAverageRatingByEventId(@Param("eventId") Long eventId);

    @Query("SELECT COUNT(r) FROM EventReview r WHERE r.event.id = :eventId")
    long countByEventId(@Param("eventId") Long eventId);

    @Query("SELECT r FROM EventReview r WHERE r.event.id = :eventId AND r.isFeatured = true")
    List<EventReview> findFeaturedByEventId(@Param("eventId") Long eventId);

    @Query("SELECT r FROM EventReview r WHERE r.event.id = :eventId ORDER BY r.helpfulVotes DESC, r.createdAt DESC")
    List<EventReview> findByEventIdOrderByHelpfulness(@Param("eventId") Long eventId, Pageable pageable);

    @Query("SELECT r FROM EventReview r WHERE r.event.id = :eventId AND r.rating >= :minRating ORDER BY r.createdAt DESC")
    List<EventReview> findByEventIdAndMinRating(@Param("eventId") Long eventId, @Param("minRating") Integer minRating);

    @Query("SELECT r FROM EventReview r WHERE r.createdAt >= :since ORDER BY r.createdAt DESC")
    List<EventReview> findRecentReviews(@Param("since") LocalDateTime since);

    @Query("SELECT AVG(r.organizationRating) FROM EventReview r WHERE r.event.organizer.id = :organizerId AND r.organizationRating IS NOT NULL")
    Double getAverageOrganizationRatingByOrganizer(@Param("organizerId") Long organizerId);

    @Query("SELECT r FROM EventReview r WHERE r.event.organizer.id = :organizerId ORDER BY r.createdAt DESC")
    List<EventReview> findByOrganizerId(@Param("organizerId") Long organizerId);

    @Query("SELECT COUNT(r) FROM EventReview r WHERE r.event.organizer.id = :organizerId")
    long countByOrganizerId(@Param("organizerId") Long organizerId);

    @Query("SELECT r FROM EventReview r WHERE r.anonymous = false AND r.rating >= :minRating ORDER BY r.helpfulVotes DESC")
    List<EventReview> findTopPublicReviews(@Param("minRating") Integer minRating, Pageable pageable);

    @Query("SELECT AVG(r.rating), AVG(r.organizationRating), AVG(r.locationRating), AVG(r.foodRating), AVG(r.entertainmentRating), AVG(r.valueRating) " +
           "FROM EventReview r WHERE r.event.id = :eventId")
    Object[] getDetailedAveragesByEventId(@Param("eventId") Long eventId);

    @Query("SELECT COUNT(r) FROM EventReview r WHERE r.event.id = :eventId AND r.wouldAttendAgain = true")
    long countWouldAttendAgainByEventId(@Param("eventId") Long eventId);

    @Query("SELECT COUNT(r) FROM EventReview r WHERE r.event.id = :eventId AND r.recommendToFriends = true")
    long countWouldRecommendByEventId(@Param("eventId") Long eventId);
} 