package com.brestlife.backend.controller;

import com.brestlife.backend.entity.EventEntity;
import com.brestlife.backend.mapper.EventMapper;
import com.brestlife.backend.service.EventService;
import com.brestlife.backend.service.MinioService;
import com.brestlife.generate.api.EventsApi;
import com.brestlife.generate.dto.Event;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
public class EventController implements EventsApi {

    private final EventService eventService;
    private final MinioService minioService;
    private final EventMapper eventMapper = EventMapper.INSTANCE;

    @Autowired
    public EventController(EventService eventService, MinioService minioService) {
        this.eventService = eventService;
        this.minioService = minioService;
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Event> createEvent(Event event) {
        EventEntity eventEntity = eventMapper.toEntity(event);
        EventEntity savedEventEntity = eventService.saveEvent(eventEntity);

        return ResponseEntity.ok(eventMapper.toDto(savedEventEntity));
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
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
        return eventEntity.map(value -> {
            Event eventDto = eventMapper.toDto(value);
            eventDto.setImageUrl(minioService.getMinioPrefix() + "/" + eventDto.getImageUrl());
            return ResponseEntity.ok(eventDto);
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Override
    public ResponseEntity<List<Event>> listEvents() {
        List<EventEntity> eventEntities = eventService.getAllEvents();
        List<Event> eventDtos = eventEntities.stream()
                .map(eventMapper::toDto)
                .collect(Collectors.toList());

        eventDtos.forEach(event -> event.setImageUrl(minioService.getMinioPrefix() + "/" + event.getImageUrl()));
        return ResponseEntity.ok(eventDtos);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Event> updateEventById(Integer id, Event event) {
        EventEntity eventEntity = eventMapper.toEntity(event);
        EventEntity updatedEventEntity = eventService.updateEventById(id, eventEntity);

        return ResponseEntity.ok(eventMapper.toDto(updatedEventEntity));
    }
}