package com.brestlife.backend.controller;

import com.brestlife.backend.entity.EventEntity;
import com.brestlife.backend.mapper.DealMapper;
import com.brestlife.backend.mapper.EventMapper;
import com.brestlife.backend.service.EventService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;
    private final EventMapper eventMapper = EventMapper.INSTANCE;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    // Endpoint : GET /api/events
    @GetMapping
    public List<EventEntity> getAllEvents() {
        return eventService.getAllEvents();
    }

    // Endpoint : GET /api/events/{id}
    @GetMapping("/{id}")
    public ResponseEntity<EventEntity> getEventById(@PathVariable Integer id) {
        Optional<EventEntity> event = eventService.getEventById(id);
        return event.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Endpoint : GET /api/events/{title}
    @GetMapping("/title/{title}")
    public ResponseEntity<EventEntity> getEventByTitle(@PathVariable String title) {
        Optional<EventEntity> event = eventService.getEventByTitle(title);
        return event.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Endpoint : POST /api/events
    @PostMapping
    public ResponseEntity<EventEntity> createEvent(@RequestBody EventEntity eventEntity) {
        if (eventService.existsByTitle(eventEntity.getTitle())) {
            return ResponseEntity.badRequest().body(null); // Titre déjà utilisé
        }
        EventEntity savedEventEntity = eventService.saveEvent(eventEntity);
        return ResponseEntity.ok(savedEventEntity);
    }

    // Endpoint : DELETE /api/events/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEventById(@PathVariable Integer id) {
        try {
            eventService.deleteEventById(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
