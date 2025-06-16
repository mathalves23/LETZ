package com.letz.service;

import com.letz.dto.event.CreateEventRequest;
import com.letz.dto.event.EventResponse;
import com.letz.entity.Event;
import com.letz.entity.EventParticipant;
import com.letz.entity.User;
import com.letz.repository.EventParticipantRepository;
import com.letz.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Serviço para gerenciamento de eventos
 */
@Service
@RequiredArgsConstructor
@Transactional
public class EventService {

    private final EventRepository eventRepository;
    private final EventParticipantRepository eventParticipantRepository;
    private final UserService userService;

    public EventResponse createEvent(CreateEventRequest request) {
        User currentUser = getCurrentUser();
        
        Event event = Event.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .type(Event.EventType.valueOf(request.getType()))
                .startDateTime(request.getStartDateTime())
                .endDateTime(request.getEndDateTime())
                .location(request.getLocation())
                .address(request.getAddress())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .organizer(currentUser)
                .maxParticipants(request.getMaxParticipants())
                .isPrivate(request.getIsPrivate())
                .requiresApproval(request.getRequiresApproval())
                .totalCost(request.getTotalCost())
                .hasCostSharing(request.getHasCostSharing())
                .inviteCode(UUID.randomUUID().toString())
                .status(Event.EventStatus.PLANNED)
                .build();

        event = eventRepository.save(event);
        
        // Incrementar contador de eventos criados do usuário
        currentUser.incrementEventsCreated();
        
        return convertToEventResponse(event);
    }

    public List<EventResponse> getMyEvents() {
        User currentUser = getCurrentUser();
        List<Event> events = eventRepository.findByOrganizerOrderByStartDateTimeDesc(currentUser);
        return events.stream()
                .map(this::convertToEventResponse)
                .collect(Collectors.toList());
    }

    public List<EventResponse> getEventsAsParticipant() {
        User currentUser = getCurrentUser();
        List<Event> events = eventRepository.findEventsByParticipant(currentUser);
        return events.stream()
                .map(this::convertToEventResponse)
                .collect(Collectors.toList());
    }

    public List<EventResponse> getUpcomingEvents() {
        User currentUser = getCurrentUser();
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime oneWeekFromNow = now.plusWeeks(1);
        
        List<Event> events = eventRepository.findUpcomingEventsByUser(
                currentUser, now, oneWeekFromNow);
        
        return events.stream()
                .map(this::convertToEventResponse)
                .collect(Collectors.toList());
    }

    public EventResponse getEventById(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Evento não encontrado"));
        
        // Verificar se o usuário tem acesso ao evento
        User currentUser = getCurrentUser();
        if (!hasAccessToEvent(event, currentUser)) {
            throw new RuntimeException("Acesso negado ao evento");
        }
        
        return convertToEventResponse(event);
    }

    public EventResponse getEventByInviteCode(String inviteCode) {
        Event event = eventRepository.findByInviteCode(inviteCode)
                .orElseThrow(() -> new RuntimeException("Convite inválido"));
        
        return convertToEventResponse(event);
    }

    public EventResponse joinEvent(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Evento não encontrado"));
        
        User currentUser = getCurrentUser();
        
        // Verificar se já está participando
        if (eventParticipantRepository.existsByEventAndUser(event, currentUser)) {
            throw new RuntimeException("Você já está participando deste evento");
        }
        
        // Verificar capacidade máxima
        if (event.hasReachedMaxCapacity()) {
            throw new RuntimeException("Evento lotado");
        }
        
        EventParticipant.ParticipationStatus status = 
                event.getRequiresApproval() ? 
                EventParticipant.ParticipationStatus.PENDING : 
                EventParticipant.ParticipationStatus.CONFIRMED;
        
        EventParticipant participant = EventParticipant.builder()
                .event(event)
                .user(currentUser)
                .status(status)
                .build();
        
        if (status == EventParticipant.ParticipationStatus.CONFIRMED) {
            participant.confirm();
        }
        
        eventParticipantRepository.save(participant);
        
        return convertToEventResponse(event);
    }

    public void leaveEvent(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Evento não encontrado"));
        
        User currentUser = getCurrentUser();
        
        EventParticipant participant = eventParticipantRepository
                .findByEventAndUser(event, currentUser)
                .orElseThrow(() -> new RuntimeException("Você não está participando deste evento"));
        
        eventParticipantRepository.delete(participant);
    }

    public EventResponse updateEvent(Long eventId, CreateEventRequest request) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Evento não encontrado"));
        
        User currentUser = getCurrentUser();
        
        // Verificar se é o organizador
        if (!event.getOrganizer().equals(currentUser)) {
            throw new RuntimeException("Apenas o organizador pode editar o evento");
        }
        
        // Atualizar campos
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setType(Event.EventType.valueOf(request.getType()));
        event.setStartDateTime(request.getStartDateTime());
        event.setEndDateTime(request.getEndDateTime());
        event.setLocation(request.getLocation());
        event.setAddress(request.getAddress());
        event.setLatitude(request.getLatitude());
        event.setLongitude(request.getLongitude());
        event.setMaxParticipants(request.getMaxParticipants());
        event.setRequiresApproval(request.getRequiresApproval());
        event.setTotalCost(request.getTotalCost());
        event.setHasCostSharing(request.getHasCostSharing());
        
        event = eventRepository.save(event);
        
        return convertToEventResponse(event);
    }

    public void deleteEvent(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Evento não encontrado"));
        
        User currentUser = getCurrentUser();
        
        // Verificar se é o organizador
        if (!event.getOrganizer().equals(currentUser)) {
            throw new RuntimeException("Apenas o organizador pode deletar o evento");
        }
        
        eventRepository.delete(event);
    }

    private EventResponse convertToEventResponse(Event event) {
        return EventResponse.builder()
                .id(event.getId())
                .title(event.getTitle())
                .description(event.getDescription())
                .type(event.getType().name())
                .startDateTime(event.getStartDateTime())
                .endDateTime(event.getEndDateTime())
                .location(event.getLocation())
                .address(event.getAddress())
                .latitude(event.getLatitude())
                .longitude(event.getLongitude())
                .organizer(userService.convertToUserResponse(event.getOrganizer()))
                .maxParticipants(event.getMaxParticipants())
                .isPrivate(event.getIsPrivate())
                .requiresApproval(event.getRequiresApproval())
                .totalCost(event.getTotalCost())
                .hasCostSharing(event.getHasCostSharing())
                .inviteCode(event.getInviteCode())
                .status(event.getStatus().name())
                .totalParticipants((int) event.getTotalParticipants())
                .createdAt(event.getCreatedAt())
                .updatedAt(event.getUpdatedAt())
                .build();
    }

    private boolean hasAccessToEvent(Event event, User user) {
        // Organizador sempre tem acesso
        if (event.getOrganizer().equals(user)) {
            return true;
        }
        
        // Verificar se é participante
        if (eventParticipantRepository.existsByEventAndUser(event, user)) {
            return true;
        }
        
        // Se evento é público, todos têm acesso
        return !event.getIsPrivate();
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userService.findByEmail(email);
    }
} 