package com.brestlife.backend.controller;

import com.brestlife.backend.service.AuthService;
import com.brestlife.generate.api.AuthApi;
import com.brestlife.generate.dto.AuthenticateUser200Response;
import com.brestlife.generate.dto.AuthenticateUserRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController implements AuthApi {

    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @Override
    public ResponseEntity<AuthenticateUser200Response> authenticateUser(AuthenticateUserRequest authenticateUserRequest) {
        return authService.authenticate(authenticateUserRequest)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(401).build());
    }

}
