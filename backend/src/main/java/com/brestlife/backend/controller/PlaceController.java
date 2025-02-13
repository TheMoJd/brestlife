package com.brestlife.backend.controller;

import com.brestlife.backend.entity.PlaceEntity;
import com.brestlife.backend.mapper.PlaceMapper;
import com.brestlife.backend.service.PlaceService;
import com.brestlife.generate.api.PlacesApi;
import com.brestlife.generate.dto.Place;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
public class PlaceController implements PlacesApi {

    private final PlaceService placeService;
    private final PlaceMapper placeMapper = PlaceMapper.INSTANCE;

    @Autowired
    public PlaceController(PlaceService placeService) {
        this.placeService = placeService;
    }

    @Override
    public ResponseEntity<Place> createPlace(Place place) {
        PlaceEntity placeEntity = placeMapper.toEntity(place);
        PlaceEntity savedPlaceEntity = placeService.savePlace(placeEntity);
        return ResponseEntity.ok(placeMapper.toDto(savedPlaceEntity));
    }

    @Override
    public ResponseEntity<Void> deletePlaceById(Integer id) {
        if (!placeService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        placeService.deletePlaceById(id);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<Place> getPlaceById(Integer id) {
        Optional<PlaceEntity> placeEntity = placeService.getPlaceById(id);
        return placeEntity.map(entity -> ResponseEntity.ok(placeMapper.toDto(entity)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Override
    public ResponseEntity<List<Place>> listPlaces() {
        List<PlaceEntity> placeEntities = placeService.getAllPlaces();
        List<Place> places = placeEntities.stream()
                .map(placeMapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(places);
    }

    @Override
    public ResponseEntity<Place> updatePlaceById(Integer id, Place place) {
        PlaceEntity placeEntity = placeMapper.toEntity(place);
        PlaceEntity updatedPlaceEntity = placeService.updatePlaceById(id, placeEntity);
        return ResponseEntity.ok(placeMapper.toDto(updatedPlaceEntity));
    }
}