package com.brestlife.backend.controller;

import com.brestlife.backend.entity.UserEntity;
import com.brestlife.backend.mapper.UserMapper;
import com.brestlife.backend.service.UserService;
import com.brestlife.generate.api.UsersApi;
import com.brestlife.generate.dto.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
public class UserController implements UsersApi {

    private final UserService userService;
    private final UserMapper userMapper = UserMapper.INSTANCE;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> createUser(User user) {
        UserEntity userEntity = userMapper.toEntity(user);

        // Check if email already exists
        if (userService.existsByEmail(userEntity.getEmail())) {
            return ResponseEntity.badRequest().body(null);
        }

        UserEntity savedUserEntity = userService.saveUser(userEntity);
        return ResponseEntity.ok(userMapper.toDto(savedUserEntity));
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> listUsers() {
        List<UserEntity> userEntities = userService.getAllUsers();
        List<User> users = userEntities.stream()
                .map(userMapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUserById(Integer id) {
        if (!userService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        userService.deleteUserById(id);
        return ResponseEntity.noContent().build();
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> getUserById(Integer id) {
        return userService.getUserById(id)
                .map(userEntity -> ResponseEntity.ok(userMapper.toDto(userEntity)))
                .orElse(ResponseEntity.notFound().build());
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> updateUserById(Integer id, User user) {
        if (!userService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        UserEntity userEntity = userMapper.toEntity(user);
        userEntity.setId(id);
        UserEntity updatedUser = userService.updateUser(userEntity);

        return ResponseEntity.ok(userMapper.toDto(updatedUser));
    }
}
