package com.letz.controller;

import com.letz.dto.event.EventResponse;
import com.letz.service.EventService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller para gerenciamento de convites
 */
@RestController
@RequestMapping("/invite")
@RequiredArgsConstructor
@Tag(name = "Convites", description = "Endpoints para gerenciamento de convites")
public class InviteController {

    private final EventService eventService;

    @GetMapping("/{inviteCode}")
    @Operation(summary = "Obter evento por convite", description = "Obtém detalhes do evento usando código de convite")
    public ResponseEntity<EventResponse> getEventByInviteCode(@PathVariable String inviteCode) {
        EventResponse event = eventService.getEventByInviteCode(inviteCode);
        return ResponseEntity.ok(event);
    }

    @PostMapping("/{inviteCode}/join")
    @Operation(summary = "Participar via convite", description = "Ingressar em evento usando código de convite")
    public ResponseEntity<EventResponse> joinEventByInvite(@PathVariable String inviteCode) {
        // Primeiro obter o evento pelo código
        EventResponse event = eventService.getEventByInviteCode(inviteCode);
        
        // Depois participar do evento
        EventResponse response = eventService.joinEvent(event.getId());
        return ResponseEntity.ok(response);
    }
} 