package com.brestlife.backend.service;

import com.brestlife.backend.entity.Event;
import com.brestlife.backend.repository.EventRepository;
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
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    //Récupérer un événement par ID
    public Optional<Event> getEventById(Integer id) {
        return Optional.ofNullable(eventRepository.findById(id).orElse(null));
    }

    //Récupérer un événement par titre
    public Optional<Event> getEventByTitle(String title) {
        return Optional.ofNullable(eventRepository.findByTitle(title).orElse(null));
    }

    //Créer ou mettre à jour un événement
    public Event saveEvent(Event event) {
        return eventRepository.save(event);
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
}
