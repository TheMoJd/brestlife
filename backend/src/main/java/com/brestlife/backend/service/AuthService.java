package com.brestlife.backend.service;

import com.brestlife.backend.entity.UserEntity;
import com.brestlife.backend.repository.UserRepository;
import com.brestlife.generate.dto.AuthenticateUser200Response;
import com.brestlife.generate.dto.AuthenticateUserRequest;
import com.brestlife.generate.dto.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;

    @Autowired
    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Optional<AuthenticateUser200Response> authenticate(AuthenticateUserRequest request) {
        Optional<UserEntity> userOpt = userRepository.findByEmail(request.getEmail());

        if (userOpt.isPresent()) {
            UserEntity user = userOpt.get();
            // Vérification du mot de passe en clair (⚠️ Peu sécurisé, à remplacer par un hash)
            if (request.getPassword().equals(user.getPassword())) {
                // Simuler un token JWT (à remplacer par une vraie gestion JWT)
                //String token = "fake-jwt-token-" + user.getId();
                String token = "fake-jwt-token-" + user.getId();
                return Optional.of(new AuthenticateUser200Response().token(token));
            }
        }
        return Optional.empty();
    }
}
