package com.brestlife.backend.controller;

import com.brestlife.backend.entity.Job;
import com.brestlife.backend.service.JobService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    // Endpoint : GET /api/jobs
    @GetMapping
    public List<Job> getAllJobs() {
        return jobService.getAllJobs();
    }

    // Endpoint : GET /api/jobs/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Job> getJobById(@PathVariable Integer id) {
        Optional<Job> job = jobService.getJobById(id);
        return job.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Endpoint : GET /api/jobs/{companyName}
    @GetMapping("/{companyName}")
    public ResponseEntity<Job> getJobByCompanyName(@PathVariable String companyName) {
        Optional<Job> job = jobService.getJobByCompanyName(companyName);
        return job.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Endpoint : POST /api/jobs
    @PostMapping
    public ResponseEntity<Job> createJob(@RequestBody Job job) {
        if (jobService.existsByName(job.getCompanyName())) {
            return ResponseEntity.badRequest().body(null); // Nom déjà utilisé
        }
        Job savedJob = jobService.saveJob(job);
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
