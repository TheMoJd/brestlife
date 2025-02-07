package com.brestlife.backend.service;

import com.brestlife.backend.entity.DealEntity;
import com.brestlife.backend.repository.DealRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DealService {
    private final DealRepository dealRepository;

    // Injection de la dépendance via le constructeur
    @Autowired
    public DealService(DealRepository dealRepository) {
        this.dealRepository = dealRepository;
    }

    //Récupérer tous les deals
    public List<DealEntity> getAllDeals() {
        return dealRepository.findAll();
    }

    //Réupérer un deal par ID
    public Optional<DealEntity> getDealById(Integer id) {
        return dealRepository.findById(id);
    }

    //Récupérer un deal par titre
    public Optional<DealEntity> getDealByTitle(String title) {
        return dealRepository.findByTitle(title);
    }

    //Vérifier si un deal existe avec un titre donné
    public boolean existsByTitle(String title) {
        return dealRepository.existsByTitle(title);
    }

    //Créer ou mettre à jour un deal
    public DealEntity saveDeal(DealEntity dealEntity) {
        return dealRepository.save(dealEntity);
    }

    //Supprimer un deal par ID
    public void deleteDealById(Integer id) {
        if (dealRepository.existsById(id)) {
            dealRepository.deleteById(id);
        } else {
            throw new IllegalArgumentException("Deal not found with id: " + id);
        }
    }
}
