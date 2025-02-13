package com.brestlife.backend.controller;

import com.brestlife.backend.entity.JobEntity;
import com.brestlife.backend.mapper.JobMapper;
import com.brestlife.backend.service.JobService;
import com.brestlife.generate.api.JobsApi;
import com.brestlife.generate.dto.Job;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
public class JobController implements JobsApi {

    private final JobService jobService;
    private final JobMapper jobMapper = JobMapper.INSTANCE;

    @Autowired
    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @Override
    public ResponseEntity<Job> createJob(Job job) {
        JobEntity jobEntity = jobMapper.toEntity(job);
        JobEntity savedJobEntity = jobService.saveJob(jobEntity);
        return ResponseEntity.ok(jobMapper.toDto(savedJobEntity));
    }

    @Override
    public ResponseEntity<Void> deleteJobById(Integer id) {
        if (!jobService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        jobService.deleteJobById(id);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<Job> getJobById(Integer id) {
        Optional<JobEntity> jobEntity = jobService.getJobById(id);
        return jobEntity.map(entity -> ResponseEntity.ok(jobMapper.toDto(entity)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Override
    public ResponseEntity<List<Job>> listJobs() {
        List<JobEntity> jobEntities = jobService.getAllJobs();
        List<Job> jobs = jobEntities.stream()
                .map(jobMapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(jobs);
    }

    @Override
    public ResponseEntity<Job> updateJobById(Integer id, Job job) {
        JobEntity jobEntity = jobMapper.toEntity(job);
        JobEntity updatedJobEntity = jobService.updateJobById(id, jobEntity);
        return ResponseEntity.ok(jobMapper.toDto(updatedJobEntity));
    }
}