package com.brestlife.backend.controller;

import com.brestlife.backend.entity.DealEntity;
import com.brestlife.backend.mapper.DealMapper;
import com.brestlife.backend.service.DealService;
import com.brestlife.generate.dto.Deal;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/deals")
public class DealController {

    private final DealService dealService;
    private final DealMapper dealMapper = DealMapper.INSTANCE;

    public DealController(DealService dealService) {
        this.dealService = dealService;
    }

    // Endpoint : GET /api/deals
    @GetMapping
    public List<DealEntity> getAllDeals() {
        return dealService.getAllDeals();
    }

    // Endpoint : GET /api/deals/{id}
    @GetMapping("/{id}")
    public ResponseEntity<DealEntity> getDealById(@PathVariable Integer id) {
        Optional<DealEntity> deal = dealService.getDealById(id);
        return deal.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Endpoint : GET /api/deals/{title}
    @GetMapping("/{title}")
    public ResponseEntity<DealEntity> getDealByTitle(@PathVariable String title) {
        Optional<DealEntity> deal = dealService.getDealByTitle(title);
        return deal.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Endpoint : POST /api/deals
    @PostMapping
    public ResponseEntity<DealEntity> createDeal(@RequestBody DealEntity dealEntity) {
        if (dealService.existsByTitle(dealEntity.getTitle())) {
            return ResponseEntity.badRequest().body(null); // Titre déjà utilisé
        }
        DealEntity savedDealEntity = dealService.saveDeal(dealEntity);
        return ResponseEntity.ok(savedDealEntity);
    }

    // Endpoint : DELETE /api/deals/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDealById(@PathVariable Integer id) {
        try {
            dealService.deleteDealById(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
