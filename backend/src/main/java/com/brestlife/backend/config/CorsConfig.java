package com.brestlife.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173")  // Client autorisé
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")  // Méthodes autorisées
                .allowedHeaders("*")  // Autoriser tous les headers
                .allowCredentials(true);  // Autoriser les cookies et informations d'identification
    }
}