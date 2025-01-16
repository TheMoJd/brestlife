package com.brestlife.backend.controller;

import com.brestlife.backend.entity.Place;
import com.brestlife.backend.service.PlaceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/places")
public class PlaceController {

    private final PlaceService placeService;

    public PlaceController(PlaceService placeService) {
        this.placeService = placeService;
    }

    // Endpoint : GET /api/places
    @GetMapping
    public List<Place> getAllPlaces() {
        return placeService.getAllPlaces();
    }

    // Endpoint : GET /api/places/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Place> getPlaceById(@PathVariable Integer id) {
        Optional<Place> place = placeService.getPlaceById(id);
        return place.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Endpoint : GET /api/places/{name}
    @GetMapping("/{name}")
    public ResponseEntity<Place> getPlaceByName(@PathVariable String name) {
        Optional<Place> place = placeService.getPlaceByName(name);
        return place.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Endpoint : POST /api/places
    @PostMapping
    public ResponseEntity<Place> createPlace(@RequestBody Place place) {
        if (placeService.existsByName(place.getName())) {
            return ResponseEntity.badRequest().body(null); // Nom déjà utilisé
        }
        Place savedPlace = placeService.savePlace(place);
        return ResponseEntity.ok(savedPlace);
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
