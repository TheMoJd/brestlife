package com.brestlife.backend.service;

import com.brestlife.backend.entity.DealEntity;
import com.brestlife.backend.repository.DealRepository;
import jakarta.persistence.EntityNotFoundException;
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


    public boolean existsById(Integer id) {
        return dealRepository.existsById(id);
    }

    public DealEntity updateDealById(Integer id, DealEntity dealEntity) {
        Optional<DealEntity> existingDealOptional = dealRepository.findById(id);

        if (existingDealOptional.isEmpty()) {
            throw new EntityNotFoundException("Deal with ID " + id + " not found");
        }

        DealEntity existingDeal = existingDealOptional.get();

        // Mettre à jour les champs modifiables
        existingDeal.setTitle(dealEntity.getTitle());
        existingDeal.setDescription(dealEntity.getDescription());
        existingDeal.setLink(dealEntity.getLink());
        existingDeal.setCategory(dealEntity.getCategory());

        // Sauvegarder les modifications
        return dealRepository.save(existingDeal);
    }
}
