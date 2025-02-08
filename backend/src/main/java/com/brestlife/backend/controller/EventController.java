package com.brestlife.backend.controller;

import com.brestlife.backend.entity.EventEntity;
import com.brestlife.backend.mapper.EventMapper;
import com.brestlife.backend.service.EventService;
import com.brestlife.generate.api.EventsApi;
import com.brestlife.generate.dto.Event;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
public class EventController implements EventsApi {

    private final EventService eventService;
    private final EventMapper eventMapper = EventMapper.INSTANCE;

    @Autowired
    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @Override
    public ResponseEntity<Event> createEvent(Event event) {
        EventEntity eventEntity = eventMapper.toEntity(event);
        EventEntity savedEventEntity = eventService.saveEvent(eventEntity);

        return ResponseEntity.ok(eventMapper.toDto(savedEventEntity));
    }

    @Override
    public ResponseEntity<Void> deleteEventById(Integer id) {
        if (!eventService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        eventService.deleteEventById(id);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<Event> getEventById(Integer id) {
        Optional<EventEntity> eventEntity = eventService.getEventById(id);
        return eventEntity.map(value -> ResponseEntity.ok(eventMapper.toDto(value)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Override
    public ResponseEntity<List<Event>> listEvents() {
        List<EventEntity> eventEntities = eventService.getAllEvents();
        List<Event> events = eventEntities.stream()
                .map(eventMapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(events);
    }

    @Override
    public ResponseEntity<Event> updateEventById(Integer id, Event event) {
        EventEntity eventEntity = eventMapper.toEntity(event);
        EventEntity updatedEventEntity = eventService.updateEventById(id, eventEntity);

        return ResponseEntity.ok(eventMapper.toDto(updatedEventEntity));
    }
}