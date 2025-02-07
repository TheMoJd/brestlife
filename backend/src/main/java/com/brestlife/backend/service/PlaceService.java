package com.brestlife.backend.service;

import com.brestlife.backend.entity.PlaceEntity;
import com.brestlife.backend.repository.PlaceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PlaceService {

    private final PlaceRepository placeRepository;

    //Injection de dépendance via le constructeur
    @Autowired
    public PlaceService(PlaceRepository placeRepository) {
        this.placeRepository = placeRepository;
    }

    //Récupérer tous les lieux
    public List<PlaceEntity> getAllPlaces() {
        return placeRepository.findAll();
    }

    //Récupérer un lieu par ID
    public Optional<PlaceEntity> getPlaceById(Integer id) {
        return placeRepository.findById(id);
    }

    //Récupérer un lieu par nom
    public Optional<PlaceEntity> getPlaceByName(String name) {
        return placeRepository.findByName(name);
    }

    //Créer ou mettre à jour un lieu
    public PlaceEntity savePlace(PlaceEntity placeEntity) {
        return placeRepository.save(placeEntity);
    }

    //Supprimer un lieu par ID
    public void deletePlaceById(Integer id) {
        if (placeRepository.existsById(id)) {
            placeRepository.deleteById(id);
        } else {
            throw new IllegalArgumentException("Place not found with id: " + id);
        }
    }

    //Vérifier si un lieu existe avec un nom donné
    public boolean existsByName(String name) {
        return placeRepository.existsByName(name);
    }
}
