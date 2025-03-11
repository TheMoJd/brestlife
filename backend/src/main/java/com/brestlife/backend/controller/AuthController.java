package com.brestlife.backend.controller;

import com.brestlife.backend.security.JwtService;
import com.brestlife.backend.service.UserService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserService userService;

    public AuthController(AuthenticationManager authenticationManager, JwtService jwtService, UserService userService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userService = userService;
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> credentials) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                credentials.get("email"), credentials.get("password")));
        UserDetails user = userService.loadUserByUsername(credentials.get("email"));
        String token = jwtService.generateToken(user);
        return Map.of("token", token);
    }
}