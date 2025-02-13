package com.brestlife.backend.controller;

import com.brestlife.backend.entity.DealEntity;
import com.brestlife.backend.mapper.DealMapper;
import com.brestlife.backend.service.DealService;
import com.brestlife.generate.api.DealsApi;
import com.brestlife.generate.dto.Deal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
public class DealController implements DealsApi {

    private final DealService dealService;
    private final DealMapper dealMapper = DealMapper.INSTANCE;

    @Autowired
    public DealController(DealService dealService) {
        this.dealService = dealService;
    }

    @Override
    public ResponseEntity<Deal> createDeal(Deal deal) {
        DealEntity dealEntity = dealMapper.toEntity(deal);
        DealEntity savedDealEntity = dealService.saveDeal(dealEntity);

        return ResponseEntity.ok(dealMapper.toDto(savedDealEntity));
    }

    @Override
    public ResponseEntity<Void> deleteDealById(Integer id) {
        if (!dealService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        dealService.deleteDealById(id);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<Deal> getDealById(Integer id) {
        Optional<DealEntity> dealEntity = dealService.getDealById(id);
        return dealEntity.map(value -> ResponseEntity.ok(dealMapper.toDto(value)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Override
    public ResponseEntity<List<Deal>> listDeals() {
        List<DealEntity> dealEntities = dealService.getAllDeals();
        List<Deal> deals = dealEntities.stream()
                .map(dealMapper::toDto)
                .collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(deals);
    }

    @Override
    public ResponseEntity<Deal> updateDealById(Integer id, Deal deal) {
        DealEntity dealEntity = dealMapper.toEntity(deal);
        DealEntity updatedDealEntity = dealService.updateDealById(id, dealEntity);

        return ResponseEntity.ok(dealMapper.toDto(updatedDealEntity));
    }
}
