package com.letz.repository;

import com.letz.entity.UserAchievement;
import com.letz.entity.Achievement;
import com.letz.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserAchievementRepository extends JpaRepository<UserAchievement, Long> {

    List<UserAchievement> findByUserId(Long userId);

    List<UserAchievement> findByUserIdOrderByUnlockedAtDesc(Long userId);

    boolean existsByUserIdAndAchievementId(Long userId, Long achievementId);

    Optional<UserAchievement> findByUserIdAndAchievementId(Long userId, Long achievementId);

    @Query("SELECT ua FROM UserAchievement ua WHERE ua.user.id = :userId AND ua.isFeatured = true")
    List<UserAchievement> findFeaturedByUserId(@Param("userId") Long userId);

    @Query("SELECT ua FROM UserAchievement ua WHERE ua.user.id = :userId AND ua.achievement.type = :type")
    List<UserAchievement> findByUserIdAndAchievementType(@Param("userId") Long userId, 
                                                         @Param("type") Achievement.AchievementType type);

    @Query("SELECT COUNT(ua) FROM UserAchievement ua WHERE ua.user.id = :userId")
    long countByUserId(@Param("userId") Long userId);

    @Query("SELECT SUM(ua.achievement.pointsReward) FROM UserAchievement ua WHERE ua.user.id = :userId")
    Long sumPointsByUserId(@Param("userId") Long userId);

    @Query("SELECT ua FROM UserAchievement ua WHERE ua.unlockedAt >= :since ORDER BY ua.unlockedAt DESC")
    List<UserAchievement> findRecentUnlocks(@Param("since") LocalDateTime since);

    @Query("SELECT ua FROM UserAchievement ua WHERE ua.achievement.rarity = :rarity AND ua.user.id = :userId")
    List<UserAchievement> findByUserIdAndRarity(@Param("userId") Long userId, 
                                               @Param("rarity") Achievement.AchievementRarity rarity);

    @Query("SELECT ua FROM UserAchievement ua WHERE ua.notificationSent = false")
    List<UserAchievement> findUnnotifiedAchievements();

    @Query("SELECT COUNT(DISTINCT ua.user.id) FROM UserAchievement ua WHERE ua.achievement.id = :achievementId")
    long countUsersWithAchievement(@Param("achievementId") Long achievementId);

    @Query("SELECT ua.achievement.id, COUNT(ua) FROM UserAchievement ua GROUP BY ua.achievement.id ORDER BY COUNT(ua) DESC")
    List<Object[]> findMostPopularAchievements();

    // Métodos adicionais para compatibilidade
    boolean existsByUserAndAchievement(User user, Achievement achievement);
    
    @Query("DELETE FROM UserAchievement ua WHERE ua.achievement = :achievement")
    void resetProgressByAchievement(@Param("achievement") Achievement achievement);
} 