package com.brestlife.backend.repository;

import com.brestlife.backend.entity.JobEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JobRepository extends JpaRepository<JobEntity, Integer> {
    Optional<JobEntity> findByCompanyName(String companyName);
    boolean existsByCompanyName(String companyName);

}
