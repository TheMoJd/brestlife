package com.brestlife.backend.service;

import io.minio.*;
import io.minio.errors.MinioException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.io.IOException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.UUID;

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

    public void deleteFile(String objectName) throws MinioException {
        try {
            RemoveObjectArgs removeObjectArgs = RemoveObjectArgs.builder()
                    .bucket(bucketName)
                    .object(objectName)
                    .build();
            minioClient.removeObject(removeObjectArgs);
        } catch (Exception e) {
            throw new MinioException("File delete failed", e.getMessage());
        }
    }

    /**
     * Méthode générique pour télécharger une image pour n'importe quelle entité
     *
     * @param entityType Le type d'entité (events, places, etc.)
     * @param entityId   L'ID de l'entité
     * @param file       Le fichier à télécharger
     * @return Le chemin relatif de l'image dans le bucket
     */
    public String uploadEntityImage(String entityType, Integer entityId, MultipartFile file)
            throws MinioException, IOException, NoSuchAlgorithmException, InvalidKeyException {

        // Vérifier si le bucket existe, sinon le créer
        boolean bucketExists = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build());
        if (!bucketExists) {
            minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketName).build());
        }

        // Générer un nom de fichier unique
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String uniqueFilename = UUID.randomUUID() + extension;

        // Chemin structuré dans le bucket: {entityType}/{entityType}Id/{uniqueFilename}
        String objectName = String.format("%s/%s%d/%s",
                entityType,                // ex: "events" ou "places"
                entityType.substring(0, entityType.length() - 1), // retirer le 's' pour avoir "event" ou "place"
                entityId,
                uniqueFilename);

        // Uploader le fichier
        minioClient.putObject(
                PutObjectArgs.builder()
                        .bucket(bucketName)
                        .object(objectName)
                        .stream(file.getInputStream(), file.getSize(), -1)
                        .contentType(file.getContentType())
                        .build()
        );

        // Retourner le chemin relatif
        return objectName;
    }

    /**
     * Méthode utilitaire pour les événements qui appelle simplement la méthode générique
     */
    public String uploadEventImage(Integer eventId, MultipartFile file)
            throws MinioException, IOException, NoSuchAlgorithmException, InvalidKeyException {
        return uploadEntityImage("events", eventId, file);
    }

    /**
     * Méthode utilitaire pour les lieux qui appelle simplement la méthode générique
     */
    public String uploadPlaceImage(Integer placeId, MultipartFile file)
            throws MinioException, IOException, NoSuchAlgorithmException, InvalidKeyException {
        return uploadEntityImage("places", placeId, file);
    }

    /**
     * Génère l'URL complète à partir du chemin relatif
     */
    public String getFullImageUrl(String relativePath) {
        if (relativePath == null || relativePath.isEmpty()) {
            return null;
        }
        return urlPrefix + "/" + relativePath;
    }

    /**
     * Méthode existante pour compatibilité
     */
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