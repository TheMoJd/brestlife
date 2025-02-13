package com.brestlife.backend.repository;

import com.brestlife.backend.entity.EventEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<EventEntity, Integer> {
    Optional<EventEntity> findByTitle(String title);

    boolean existsByTitle(String title);
}
