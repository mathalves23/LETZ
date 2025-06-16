package com.letz.repository;

import com.letz.entity.EventTemplate;
import com.letz.entity.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventTemplateRepository extends JpaRepository<EventTemplate, Long> {

    Page<EventTemplate> findByIsPublicTrue(Pageable pageable);

    Page<EventTemplate> findByCreatedById(Long userId, Pageable pageable);

    List<EventTemplate> findByCreatedById(Long userId);

    Page<EventTemplate> findByCategoryAndIsPublicTrue(EventTemplate.TemplateCategory category, Pageable pageable);

    Page<EventTemplate> findByTypeAndIsPublicTrue(Event.EventType type, Pageable pageable);

    @Query("SELECT t FROM EventTemplate t WHERE t.isPublic = true AND " +
           "(LOWER(t.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(t.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<EventTemplate> findBySearchAndIsPublicTrue(@Param("search") String search, Pageable pageable);

    @Query("SELECT t FROM EventTemplate t WHERE t.isPublic = true ORDER BY t.usageCount DESC")
    List<EventTemplate> findPopularTemplates(Pageable pageable);

    @Query("SELECT t FROM EventTemplate t WHERE t.isPublic = true AND t.rating >= :minRating ORDER BY t.rating DESC, t.ratingCount DESC")
    List<EventTemplate> findTopRatedTemplates(@Param("minRating") Double minRating, Pageable pageable);

    @Query("SELECT t FROM EventTemplate t WHERE t.isSystemTemplate = true AND t.isPublic = true")
    List<EventTemplate> findSystemTemplates();

    @Query("SELECT t FROM EventTemplate t WHERE t.category = :category AND t.isPublic = true AND t.type = :type")
    Page<EventTemplate> findByCategoryAndTypeAndIsPublicTrue(@Param("category") EventTemplate.TemplateCategory category,
                                                            @Param("type") Event.EventType type,
                                                            Pageable pageable);

    @Query("SELECT DISTINCT t.category FROM EventTemplate t WHERE t.isPublic = true")
    List<EventTemplate.TemplateCategory> findAvailableCategories();

    @Query("SELECT AVG(t.rating) FROM EventTemplate t WHERE t.createdBy.id = :userId AND t.ratingCount > 0")
    Double getAverageRatingByCreator(@Param("userId") Long userId);

    @Query("SELECT SUM(t.usageCount) FROM EventTemplate t WHERE t.createdBy.id = :userId")
    Long getTotalUsageByCreator(@Param("userId") Long userId);

    @Query("SELECT COUNT(t) FROM EventTemplate t WHERE t.createdBy.id = :userId")
    long countByCreatedById(@Param("userId") Long userId);

    @Query("SELECT t FROM EventTemplate t WHERE t.isPublic = true AND t.usageCount > 0 ORDER BY (t.rating * t.ratingCount + t.usageCount) DESC")
    List<EventTemplate> findTrendingTemplates(Pageable pageable);
} 