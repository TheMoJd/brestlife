package com.brestlife.backend.controller;

import com.brestlife.backend.entity.PlaceEntity;
import com.brestlife.backend.mapper.DealMapper;
import com.brestlife.backend.mapper.PlaceMapper;
import com.brestlife.backend.service.PlaceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/places")
public class PlaceController {

    private final PlaceService placeService;
    private final PlaceMapper placeMapper = PlaceMapper.INSTANCE;

    public PlaceController(PlaceService placeService) {
        this.placeService = placeService;
    }

    // Endpoint : GET /api/places
    @GetMapping
    public List<PlaceEntity> getAllPlaces() {
        return placeService.getAllPlaces();
    }

    // Endpoint : GET /api/places/{id}
    @GetMapping("/{id}")
    public ResponseEntity<PlaceEntity> getPlaceById(@PathVariable Integer id) {
        Optional<PlaceEntity> place = placeService.getPlaceById(id);
        return place.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Endpoint : GET /api/places/{name}
    @GetMapping("/{name}")
    public ResponseEntity<PlaceEntity> getPlaceByName(@PathVariable String name) {
        Optional<PlaceEntity> place = placeService.getPlaceByName(name);
        return place.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Endpoint : POST /api/places
    @PostMapping
    public ResponseEntity<PlaceEntity> createPlace(@RequestBody PlaceEntity placeEntity) {
        if (placeService.existsByName(placeEntity.getName())) {
            return ResponseEntity.badRequest().body(null); // Nom déjà utilisé
        }
        PlaceEntity savedPlaceEntity = placeService.savePlace(placeEntity);
        return ResponseEntity.ok(savedPlaceEntity);
    }

    // Endpoint : DELETE /api/places/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlaceById(@PathVariable Integer id) {
        try {
            placeService.deletePlaceById(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
