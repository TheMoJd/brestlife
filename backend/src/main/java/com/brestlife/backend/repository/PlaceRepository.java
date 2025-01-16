package com.brestlife.backend.repository;

import com.brestlife.backend.model.Place;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlaceRepository extends JpaRepository<Place, Integer> {
    List<Place> findAll();
    Optional<Place> findById(Integer id);
    Optional<Place> findByName(String name);
    boolean existsByName(String name);
}