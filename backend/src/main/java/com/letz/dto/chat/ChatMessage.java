package com.letz.dto.chat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {
    private Long id;
    private String senderEmail;
    private String senderName;
    private String receiverEmail;
    private String content;
    private Long eventId;
    private MessageType type;
    private LocalDateTime timestamp;
    private boolean isRead;

    public enum MessageType {
        CHAT, JOIN, LEAVE, TYPING
    }
} 