package com.brestlife.backend.repository;

import com.brestlife.backend.entity.CategoryEntity;
import com.brestlife.generate.dto.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface CategoryRepository extends JpaRepository<CategoryEntity, Integer> {
    Optional<CategoryEntity> findById(Integer id);

    List<CategoryEntity> findByType(Category.TypeEnum type);
}
