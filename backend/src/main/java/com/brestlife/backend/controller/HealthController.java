package com.brestlife.backend.controller;

import com.brestlife.generate.api.HealthApi;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController implements HealthApi {

    @Override
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("OK");
    }
}
