package com.brestlife.backend.controller;

import com.brestlife.backend.entity.EventEntity;
import com.brestlife.backend.entity.PlaceEntity;
import com.brestlife.backend.mapper.EventMapper;
import com.brestlife.backend.mapper.PlaceMapper;
import com.brestlife.backend.service.EventService;
import com.brestlife.backend.service.MinioService;
import com.brestlife.backend.service.PlaceService;
import com.brestlife.generate.api.ImagesApi;
import com.brestlife.generate.dto.Event;
import com.brestlife.generate.dto.Place;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@RestController
public class ImageController implements ImagesApi {

    private final MinioService minioService;
    private final EventService eventService;
    private final PlaceService placeService;
    private final EventMapper eventMapper = EventMapper.INSTANCE;
    private final PlaceMapper placeMapper = PlaceMapper.INSTANCE;

    @Autowired
    public ImageController(MinioService minioService, EventService eventService, PlaceService placeService) {
        this.minioService = minioService;
        this.eventService = eventService;
        this.placeService = placeService;
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Event> uploadEventImage(Integer eventId, MultipartFile file) {
        try {
            Optional<EventEntity> event = eventService.getEventById(eventId);

            if (event.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            EventEntity eventEntity = event.get();
            String oldImageUrl = eventEntity.getImageUrl();
            String imageUrl = minioService.uploadEventImage(eventId, file);

            eventEntity.setImageUrl(imageUrl);
            eventService.saveEvent(eventEntity);

            if (oldImageUrl != null) {
                minioService.deleteFile(oldImageUrl);
            }

            return ResponseEntity.ok(eventMapper.toDto(eventEntity));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Place> uploadPlaceImage(Integer placeId, MultipartFile file) {
        try {
            Optional<PlaceEntity> place = placeService.getPlaceById(placeId);

            if (place.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            PlaceEntity placeEntity = place.get();
            String oldImageUrl = placeEntity.getImageUrl();
            String imageUrl = minioService.uploadPlaceImage(placeId, file);

            placeEntity.setImageUrl(imageUrl);
            placeService.savePlace(placeEntity);

            if (oldImageUrl != null) {
                minioService.deleteFile(oldImageUrl);
            }

            return ResponseEntity.ok(placeMapper.toDto(placeEntity));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
