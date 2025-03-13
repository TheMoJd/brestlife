package com.brestlife.backend.controller;

import com.brestlife.backend.service.AuthenticationService;
import com.brestlife.generate.api.AuthApi;
import com.brestlife.generate.dto.AuthenticationRequest;
import com.brestlife.generate.dto.AuthenticationResponse;
import com.brestlife.generate.dto.RegisterRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController implements AuthApi {

    private final AuthenticationService service;

    @Autowired
    public AuthController(AuthenticationService service) {
        this.service = service;
    }

    @Override
    public ResponseEntity<AuthenticationResponse> authenticateUser(AuthenticationRequest authenticationRequest) {
        return ResponseEntity.ok(service.authenticate(authenticationRequest));
    }

    @Override
    public ResponseEntity<AuthenticationResponse> registerUser(RegisterRequest registerRequest) {
        return ResponseEntity.ok(service.register(registerRequest));
    }
}