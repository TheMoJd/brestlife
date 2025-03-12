package com.brestlife.backend.service;

import com.brestlife.backend.entity.UserEntity;
import com.brestlife.backend.mapper.UserMapper;
import com.brestlife.backend.repository.UserRepository;
import com.brestlife.backend.security.JwtService;
import com.brestlife.generate.dto.AuthenticationRequest;
import com.brestlife.generate.dto.AuthenticationResponse;
import com.brestlife.generate.dto.RegisterRequest;
import com.brestlife.generate.dto.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserMapper userMapper = UserMapper.INSTANCE;

    public AuthenticationResponse register(RegisterRequest request) {
        var user = new UserEntity();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(User.RoleEnum.STUDENT);

        repository.save(user);
        var jwtToken = jwtService.generateToken(user);

        return new AuthenticationResponse(jwtToken, userMapper.toDto(user));
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var user = repository.findByEmail(request.getEmail())
                .orElseThrow();
        var jwtToken = jwtService.generateToken(user);

        return new AuthenticationResponse(jwtToken, userMapper.toDto(user));
    }
}