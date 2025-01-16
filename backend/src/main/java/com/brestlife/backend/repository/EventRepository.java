package com.brestlife.backend.repository;

import com.brestlife.backend.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<Event, Integer> {
    Optional<Event> findByTitle(String title);
    boolean existsByTitle(String title);
}
