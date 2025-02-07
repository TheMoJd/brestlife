package com.brestlife.backend.service;


import com.brestlife.backend.entity.UserEntity;
import com.brestlife.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    // Injection de dépendance via le constructeur
    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Récupérer tous les utilisateurs
    public List<UserEntity> getAllUsers() {
        return userRepository.findAll();
    }

    // Récupérer un utilisateur par ID
    public Optional<UserEntity> getUserById(Integer id) {
        return userRepository.findById(id);
    }

    // Récupérer un utilisateur par email
    public Optional<UserEntity> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // Créer ou mettre à jour un utilisateur
    public UserEntity saveUser(UserEntity userEntity) {
        return userRepository.save(userEntity);
    }

    // Supprimer un utilisateur par ID
    public void deleteUserById(Integer id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
        } else {
            throw new IllegalArgumentException("User not found with id: " + id);
        }
    }

    // Vérifier si un utilisateur existe avec un email donné
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
}
