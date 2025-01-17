package com.brestlife.backend.controller;

import com.brestlife.backend.entity.Deal;
import com.brestlife.backend.service.DealService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/deals")
public class DealController {

    private final DealService dealService;

    public DealController(DealService dealService) {
        this.dealService = dealService;
    }

    // Endpoint : GET /api/deals
    @GetMapping
    public List<Deal> getAllDeals() {
        return dealService.getAllDeals();
    }

    // Endpoint : GET /api/deals/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Deal> getDealById(@PathVariable Integer id) {
        Optional<Deal> deal = dealService.getDealById(id);
        return deal.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Endpoint : GET /api/deals/{title}
    @GetMapping("/{title}")
    public ResponseEntity<Deal> getDealByTitle(@PathVariable String title) {
        Optional<Deal> deal = dealService.getDealByTitle(title);
        return deal.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Endpoint : POST /api/deals
    @PostMapping
    public ResponseEntity<Deal> createDeal(@RequestBody Deal deal) {
        if (dealService.existsByTitle(deal.getTitle())) {
            return ResponseEntity.badRequest().body(null); // Titre déjà utilisé
        }
        Deal savedDeal = dealService.saveDeal(deal);
        return ResponseEntity.ok(savedDeal);
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
