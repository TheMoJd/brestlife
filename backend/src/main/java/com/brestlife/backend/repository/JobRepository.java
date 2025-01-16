package com.brestlife.backend.repository;

import com.brestlife.backend.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobRepository extends JpaRepository<Job, Integer> {
    Optional<Job> findByCompanyName(String name);
    boolean existsByName(String name);

}
