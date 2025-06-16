package com.letz.repository;

import com.letz.entity.User;
import com.letz.entity.Badge;
import com.letz.entity.UserBadge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserBadgeRepository extends JpaRepository<UserBadge, Long> {
    boolean existsByUserAndBadge(User user, Badge badge);
    
    @Query("SELECT ub FROM UserBadge ub WHERE ub.user.id = :userId")
    List<UserBadge> findByUserId(@Param("userId") Long userId);
} 