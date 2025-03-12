package com.brestlife.backend.service;

import com.brestlife.backend.entity.UserEntity;
import com.brestlife.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
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

    // Vérifier si un utilisateur existe avec un ID donné
    public boolean existsById(Integer id) {
        return userRepository.existsById(id);
    }

    public UserEntity updateUser(UserEntity userEntity) {
        // Vérifie si l'utilisateur existe
        Optional<UserEntity> existingUserOpt = userRepository.findById(userEntity.getId());
        if (existingUserOpt.isEmpty()) {
            throw new EntityNotFoundException("Utilisateur non trouvé avec l'ID : " + userEntity.getId());
        }

        UserEntity existingUser = existingUserOpt.get();

        // Mise à jour des champs si présents
        if (userEntity.getName() != null) {
            existingUser.setName(userEntity.getName());
        }
        if (userEntity.getEmail() != null) {
            existingUser.setEmail(userEntity.getEmail());
        }
        if (userEntity.getPassword() != null) {
            existingUser.setPassword(userEntity.getPassword());
        }
        if (userEntity.getRole() != null) {
            existingUser.setRole(userEntity.getRole());
        }

        // L'annotation @PreUpdate dans UserEntity mettra à jour `updatedAt`
        return userRepository.save(existingUser);
    }
}
