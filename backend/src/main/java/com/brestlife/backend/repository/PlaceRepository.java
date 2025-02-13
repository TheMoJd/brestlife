package com.brestlife.backend.repository;

import com.brestlife.backend.entity.PlaceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlaceRepository extends JpaRepository<PlaceEntity, Integer> {
    Optional<PlaceEntity> findByName(String name);

    boolean existsByName(String name);
}