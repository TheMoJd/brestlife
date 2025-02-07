package com.brestlife.backend.controller;


import com.brestlife.backend.entity.UserEntity;
import com.brestlife.backend.mapper.DealMapper;
import com.brestlife.backend.mapper.UserMapper;
import com.brestlife.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper = UserMapper.INSTANCE;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Endpoint : GET /api/users
    @GetMapping
    public List<UserEntity> getAllUsers() {
        return userService.getAllUsers();
    }

    // Endpoint : GET /api/users/{id}
    @GetMapping("/{id}")
    public ResponseEntity<UserEntity> getUserById(@PathVariable Integer id) {
        Optional<UserEntity> user = userService.getUserById(id);
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Endpoint : POST /api/users
    @PostMapping
    public ResponseEntity<UserEntity> createUser(@RequestBody UserEntity userEntity) {
        if (userService.existsByEmail(userEntity.getEmail())) {
            return ResponseEntity.badRequest().body(null); // Email déjà utilisé
        }
        UserEntity savedUserEntity = userService.saveUser(userEntity);
        return ResponseEntity.ok(savedUserEntity);
    }

    // Endpoint : DELETE /api/users/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUserById(@PathVariable Integer id) {
        try {
            userService.deleteUserById(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}

