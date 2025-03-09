package com.brestlife.backend.controller;

import com.brestlife.backend.service.MinioService;
import com.brestlife.generate.api.ImagesApi;
import io.minio.errors.MinioException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/photos")
public class ImageController implements ImagesApi {

    @Autowired
    private MinioService minioService;

    @Override
    public ResponseEntity<Void> uploadImage(MultipartFile file) {
        try {
            minioService.uploadFile(file.getOriginalFilename(), file.getInputStream());
            return ResponseEntity.noContent().build();
        } catch (IOException | MinioException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}