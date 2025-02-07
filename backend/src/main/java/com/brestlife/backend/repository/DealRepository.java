package com.brestlife.backend.repository;

import com.brestlife.backend.entity.DealEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DealRepository extends JpaRepository<DealEntity, Integer> {
    Optional<DealEntity> findByTitle(String title);
    boolean existsByTitle(String title);
}
