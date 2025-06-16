package com.letz.controller;

import com.letz.dto.event.CreateEventRequest;
import com.letz.dto.event.EventResponse;
import com.letz.service.EventService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller para gerenciamento de eventos
 */
@RestController
@RequestMapping("/events")
@RequiredArgsConstructor
@Tag(name = "Eventos", description = "Endpoints para gerenciamento de eventos")
public class EventController {

    private final EventService eventService;

    @PostMapping
    @Operation(summary = "Criar evento", description = "Cria um novo evento")
    public ResponseEntity<EventResponse> createEvent(@Valid @RequestBody CreateEventRequest request) {
        EventResponse response = eventService.createEvent(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/my")
    @Operation(summary = "Meus eventos", description = "Lista eventos criados pelo usuário atual")
    public ResponseEntity<List<EventResponse>> getMyEvents() {
        try {
            List<EventResponse> events = eventService.getMyEvents();
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            return ResponseEntity.ok(List.of());
        }
    }

    @GetMapping("/participating")
    @Operation(summary = "Eventos participando", description = "Lista eventos que o usuário está participando")
    public ResponseEntity<List<EventResponse>> getEventsAsParticipant() {
        try {
            List<EventResponse> events = eventService.getEventsAsParticipant();
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            return ResponseEntity.ok(List.of());
        }
    }

    @GetMapping("/upcoming")
    @Operation(summary = "Próximos eventos", description = "Lista próximos eventos do usuário")
    public ResponseEntity<List<EventResponse>> getUpcomingEvents() {
        try {
            List<EventResponse> events = eventService.getUpcomingEvents();
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            // Retornar lista vazia se não há usuário autenticado
            return ResponseEntity.ok(List.of());
        }
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obter evento", description = "Obtém detalhes de um evento específico")
    public ResponseEntity<EventResponse> getEventById(@PathVariable Long id) {
        EventResponse event = eventService.getEventById(id);
        return ResponseEntity.ok(event);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar evento", description = "Atualiza um evento existente")
    public ResponseEntity<EventResponse> updateEvent(
            @PathVariable Long id,
            @Valid @RequestBody CreateEventRequest request) {
        EventResponse response = eventService.updateEvent(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar evento", description = "Remove um evento")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/join")
    @Operation(summary = "Participar do evento", description = "Ingressar em um evento")
    public ResponseEntity<EventResponse> joinEvent(@PathVariable Long id) {
        EventResponse response = eventService.joinEvent(id);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}/leave")
    @Operation(summary = "Sair do evento", description = "Deixar de participar de um evento")
    public ResponseEntity<Void> leaveEvent(@PathVariable Long id) {
        eventService.leaveEvent(id);
        return ResponseEntity.noContent().build();
    }
} 