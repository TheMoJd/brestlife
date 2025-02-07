package com.brestlife.backend.service;

import com.brestlife.backend.entity.JobEntity;
import com.brestlife.backend.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class JobService {

    private final JobRepository jobRepository;

    //Injection de dépendance via le constructeur
    @Autowired
    public JobService(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    //Récupérer tous les emplois
    public List<JobEntity> getAllJobs() {
        return jobRepository.findAll();
    }

    //Récupérer un emploi par ID
    public Optional<JobEntity> getJobById(Integer id) {
        return jobRepository.findById(id);
    }

    //Récupérer un emploi par nom de l'entreprise
    public Optional<JobEntity> getJobByCompanyName(String companyName) {
        return jobRepository.findByCompanyName(companyName);
    }

    //Vérifier si un emploi existe avec un nom donné
    public boolean existsByName(String name) {
        return jobRepository.existsByCompanyName(name);
    }

    //Créer ou mettre à jour un emploi
    public JobEntity saveJob(JobEntity job) {
        return jobRepository.save(job);
    }

    //Supprimer un emploi par ID
    public void deleteJobById(Integer id) {
        if (jobRepository.existsById(id)) {
            jobRepository.deleteById(id);
        } else {
            throw new IllegalArgumentException("Job not found with id: " + id);
        }
    }
}
