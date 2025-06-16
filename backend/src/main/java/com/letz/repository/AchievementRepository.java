package com.letz.repository;

import com.letz.entity.Achievement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AchievementRepository extends JpaRepository<Achievement, Long> {

    List<Achievement> findByIsActiveTrue();

    List<Achievement> findByTypeAndIsActiveTrue(Achievement.AchievementType type);

    List<Achievement> findByRarityAndIsActiveTrue(Achievement.AchievementRarity rarity);

    Optional<Achievement> findByCodeAndIsActiveTrue(String code);

    @Query("SELECT a FROM Achievement a WHERE a.isActive = true ORDER BY a.rarity DESC, a.pointsReward DESC")
    List<Achievement> findAllActiveOrderedByRarityAndPoints();

    @Query("SELECT a FROM Achievement a WHERE a.type = :type AND a.isActive = true ORDER BY a.pointsReward ASC")
    List<Achievement> findByTypeOrderedByDifficulty(@Param("type") Achievement.AchievementType type);

    @Query("SELECT COUNT(a) FROM Achievement a WHERE a.isActive = true")
    long countActiveAchievements();

    @Query("SELECT a FROM Achievement a WHERE a.isActive = true AND " +
           "(a.friendsRequired IS NULL OR a.friendsRequired <= :friends) AND " +
           "(a.eventsRequired IS NULL OR a.eventsRequired <= :events) AND " +
           "(a.pointsRequired IS NULL OR a.pointsRequired <= :points)")
    List<Achievement> findEligibleAchievements(@Param("friends") Integer totalFriends, 
                                              @Param("events") Integer totalEvents, 
                                              @Param("points") Integer totalPoints);

    // Métodos adicionais para compatibilidade
    Optional<Achievement> findByCode(String code);
    
    List<Achievement> findByResetMonthly(boolean resetMonthly);
} 