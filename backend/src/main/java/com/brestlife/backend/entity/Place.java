package com.brestlife.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "places")
public class Place {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(nullable = false, length = 255)
    private String address;

    private Double latitude;

    private Double longitude;

    @Column(name = "image_url", length = 255)
    private String imageUrl;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public String getName() {
        return name;
    }
}
