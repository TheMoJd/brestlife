package com.brestlife.backend.controller;

import com.brestlife.backend.entity.JobEntity;
import com.brestlife.backend.mapper.DealMapper;
import com.brestlife.backend.mapper.JobMapper;
import com.brestlife.backend.service.JobService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobService;
    private final JobMapper jobMapper = JobMapper.INSTANCE;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    // Endpoint : GET /api/jobs
    @GetMapping
    public List<JobEntity> getAllJobs() {
        return jobService.getAllJobs();
    }

    // Endpoint : GET /api/jobs/{id}
    @GetMapping("/{id}")
    public ResponseEntity<JobEntity> getJobById(@PathVariable Integer id) {
        Optional<JobEntity> job = jobService.getJobById(id);
        return job.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Endpoint : GET /api/jobs/{companyName}
    @GetMapping("/{companyName}")
    public ResponseEntity<JobEntity> getJobByCompanyName(@PathVariable String companyName) {
        Optional<JobEntity> job = jobService.getJobByCompanyName(companyName);
        return job.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Endpoint : POST /api/jobs
    @PostMapping
    public ResponseEntity<JobEntity> createJob(@RequestBody JobEntity job) {
        if (jobService.existsByName(job.getCompanyName())) {
            return ResponseEntity.badRequest().body(null); // Nom déjà utilisé
        }
        JobEntity savedJob = jobService.saveJob(job);
        return ResponseEntity.ok(savedJob);
    }

    // Endpoint : DELETE /api/jobs/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJobById(@PathVariable Integer id) {
        try {
            jobService.deleteJobById(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

}
