package com.brestlife.backend.service;

import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.RemoveBucketArgs;
import io.minio.RemoveObjectArgs;
import io.minio.errors.MinioException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.io.IOException;

@Service
public class MinioService {

    private final MinioClient minioClient;
    private final String bucketName;
    private final String urlPrefix;

    public MinioService(@Value("${minio.url}") String minioUrl,
                        @Value("${minio.access-key}") String accessKey,
                        @Value("${minio.secret-key}") String secretKey,
                        @Value("${minio.bucket-name}") String bucketName,
                        @Value("${minio.url-prefix}") String urlPrefix) {
        this.minioClient = MinioClient.builder()
                .endpoint(minioUrl)
                .credentials(accessKey, secretKey)
                .build();
        this.bucketName = bucketName;
        this.urlPrefix = urlPrefix;
    }

    public String getMinioPrefix() {
        return urlPrefix;
    }

    public void deleteFile(String fileName) throws MinioException {
        try {
            RemoveObjectArgs removeObjectArgs = RemoveObjectArgs.builder().bucket(bucketName).build();
            minioClient.removeObject(removeObjectArgs);
        } catch (Exception e) {
            throw new MinioException("File delete failed", e.getMessage());
        }
    }

    public String uploadFile(String fileName, InputStream fileStream) throws MinioException, IOException {
        try {
            PutObjectArgs putObjectArgs = PutObjectArgs.builder()
                    .bucket(bucketName)
                    .object(fileName)
                    .stream(fileStream, fileStream.available(), -1)
                    .build();
            minioClient.putObject(putObjectArgs);
            return urlPrefix + "/" + fileName;
        } catch (Exception e) {
            throw new IOException("File upload failed", e);
        }
    }
}