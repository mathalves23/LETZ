package com.letz.service;

import com.letz.entity.User;
import com.letz.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class GamificationService {

    private final UserRepository userRepository;

    public void awardPoints(User user, int points) {
        log.info("Awarding {} points to user {}", points, user.getId());
        int currentPoints = user.getPoints() != null ? user.getPoints() : 0;
        user.setPoints(currentPoints + points);
        userRepository.save(user);
    }

    public Map<String, Object> getUserStats(Long userId) {
        log.info("Getting stats for user {}", userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, Object> stats = new HashMap<>();
        stats.put("userId", user.getId());
        stats.put("totalPoints", user.getPoints() != null ? user.getPoints() : 0);
        stats.put("level", calculateLevel(user.getPoints() != null ? user.getPoints() : 0));
        stats.put("eventsCreated", user.getEventsCreated() != null ? user.getEventsCreated() : 0);
        stats.put("eventsAttended", user.getEventsAttended() != null ? user.getEventsAttended() : 0);
        stats.put("totalFriends", user.getTotalFriends() != null ? user.getTotalFriends() : 0);

        return stats;
    }

    private int calculateLevel(int points) {
        if (points < 100) return 1;
        if (points < 300) return 2;
        if (points < 600) return 3;
        if (points < 1000) return 4;
        return 5;
    }
} 