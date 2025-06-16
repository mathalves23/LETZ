package com.letz.repository;

import com.letz.entity.Ticket;
import com.letz.entity.Event;
import com.letz.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    
    // Buscar por código do ticket
    Optional<Ticket> findByTicketCode(String ticketCode);
    
    // Buscar por QR Code
    Optional<Ticket> findByQrCode(String qrCode);
    
    // Buscar tickets de um usuário
    Page<Ticket> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
    
    // Buscar tickets de um evento
    Page<Ticket> findByEventOrderByCreatedAtDesc(Event event, Pageable pageable);
    
    // Buscar tickets por status
    List<Ticket> findByStatus(Ticket.TicketStatus status);
    
    // Buscar tickets válidos de um usuário
    @Query("SELECT t FROM Ticket t WHERE t.user = :user AND t.status = 'CONFIRMED' " +
           "AND (t.validUntil IS NULL OR t.validUntil > :now)")
    List<Ticket> findValidTicketsByUser(@Param("user") User user, @Param("now") LocalDateTime now);
    
    // Buscar tickets de um evento por tipo
    List<Ticket> findByEventAndTicketType(Event event, Ticket.TicketType ticketType);
    
    // Contar tickets vendidos por evento
    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.event = :event AND t.status != 'CANCELLED'")
    Long countSoldTicketsByEvent(@Param("event") Event event);
    
    // Contar tickets por status e evento
    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.event = :event AND t.status = :status")
    Long countTicketsByEventAndStatus(@Param("event") Event event, @Param("status") Ticket.TicketStatus status);
    
    // Receita total de um evento
    @Query("SELECT COALESCE(SUM(t.price), 0) FROM Ticket t WHERE t.event = :event " +
           "AND t.status IN ('CONFIRMED', 'USED')")
    BigDecimal getTotalRevenueByEvent(@Param("event") Event event);
    
    // Tickets que expiraram
    @Query("SELECT t FROM Ticket t WHERE t.validUntil < :now AND t.status = 'CONFIRMED'")
    List<Ticket> findExpiredTickets(@Param("now") LocalDateTime now);
    
    // Tickets para check-in em um evento
    @Query("SELECT t FROM Ticket t WHERE t.event = :event AND t.status = 'CONFIRMED' " +
           "AND t.checkedInAt IS NULL")
    List<Ticket> findTicketsForCheckIn(@Param("event") Event event);
    
    // Buscar tickets de eventos próximos do usuário
    @Query("SELECT t FROM Ticket t WHERE t.user = :user AND t.status = 'CONFIRMED' " +
           "AND t.event.startDateTime BETWEEN :start AND :end")
    List<Ticket> findUpcomingTicketsByUser(@Param("user") User user, 
                                          @Param("start") LocalDateTime start,
                                          @Param("end") LocalDateTime end);
    
    // Estatísticas de vendas por período
    @Query("SELECT DATE(t.createdAt) as date, COUNT(t) as count, COALESCE(SUM(t.price), 0) as revenue " +
           "FROM Ticket t WHERE t.event = :event AND t.createdAt BETWEEN :start AND :end " +
           "AND t.status != 'CANCELLED' GROUP BY DATE(t.createdAt) ORDER BY date")
    List<Object[]> getSalesStatistics(@Param("event") Event event, 
                                     @Param("start") LocalDateTime start,
                                     @Param("end") LocalDateTime end);
    
    // Verificar se usuário já tem ticket para evento
    boolean existsByEventAndUser(Event event, User user);
    
    // Buscar tickets por múltiplos status
    @Query("SELECT t FROM Ticket t WHERE t.event = :event AND t.status IN :statuses")
    List<Ticket> findByEventAndStatusIn(@Param("event") Event event, 
                                       @Param("statuses") List<Ticket.TicketStatus> statuses);
} 