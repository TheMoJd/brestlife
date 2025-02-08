package com.brestlife.backend.service;

import com.brestlife.backend.entity.EventEntity;
import com.brestlife.backend.repository.EventRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EventService {
    private final EventRepository eventRepository;

    //Injection de dépendance via le constructeur
    @Autowired
    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    //Récupérer tous les événements
    public List<EventEntity> getAllEvents() {
        return eventRepository.findAll();
    }

    //Récupérer un événement par ID
    public Optional<EventEntity> getEventById(Integer id) {
        return Optional.ofNullable(eventRepository.findById(id).orElse(null));
    }

    //Récupérer un événement par titre
    public Optional<EventEntity> getEventByTitle(String title) {
        return Optional.ofNullable(eventRepository.findByTitle(title).orElse(null));
    }

    //Créer ou mettre à jour un événement
    public EventEntity saveEvent(EventEntity eventEntity) {
        return eventRepository.save(eventEntity);
    }

    //Supprimer un événement par ID
    public void deleteEventById(Integer id) {
        if (eventRepository.existsById(id)) {
            eventRepository.deleteById(id);
        } else {
            throw new IllegalArgumentException("Event not found with id: " + id);
        }
    }

    //Vérifier si un événement existe avec un titre donné
    public boolean existsByTitle(String title) {
        return eventRepository.existsByTitle(title);
    }

    public boolean existsById(Integer id) {
        return eventRepository.existsById(id);
    }

    public EventEntity updateEventById(Integer id, EventEntity eventEntity) {
        return eventRepository.findById(id).map(existingEvent -> {
            existingEvent.setTitle(eventEntity.getTitle());
            existingEvent.setDescription(eventEntity.getDescription());
            existingEvent.setCategoryEntity(eventEntity.getCategoryEntity());
            existingEvent.setDate(eventEntity.getDate());
            existingEvent.setLocation(eventEntity.getLocation());
            existingEvent.setPrice(eventEntity.getPrice());
            existingEvent.setImageUrl(eventEntity.getImageUrl());

            return eventRepository.save(existingEvent);
        }).orElseThrow(() -> new EntityNotFoundException("Event with ID " + id + " not found"));
    }
}
