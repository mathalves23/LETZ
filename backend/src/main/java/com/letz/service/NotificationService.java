package com.letz.service;

import com.letz.entity.User;
import com.letz.entity.Badge;
import com.letz.entity.Achievement;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    public void sendBadgeNotification(User user, Badge badge) {
        log.info("🏅 Enviando notificação de badge para usuário {} - Badge: {}", user.getId(), badge.getName());
        // Implementar envio de notificação
    }

    public void sendAchievementNotification(User user, Achievement achievement) {
        log.info("🏆 Enviando notificação de conquista para usuário {} - Conquista: {}", user.getId(), achievement.getName());
        // Implementar envio de notificação
    }

    public void sendLevelUpNotification(User user, int newLevel, String levelName) {
        log.info("🎉 Enviando notificação de level up para usuário {} - Nível: {} ({})", user.getId(), newLevel, levelName);
        // Implementar envio de notificação
    }
} 