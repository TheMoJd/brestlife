package com.brestlife.backend.service;

import com.brestlife.backend.entity.CategoryEntity;
import com.brestlife.backend.mapper.CategoryMapper;
import com.brestlife.backend.repository.CategoryRepository;
import com.brestlife.generate.dto.Category;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper = CategoryMapper.INSTANCE;

    @Autowired
    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public Category createCategory(Category category) {
        CategoryEntity categoryEntity = categoryMapper.toEntity(category);
        CategoryEntity savedCategoryEntity = categoryRepository.save(categoryEntity);
        return categoryMapper.toDto(savedCategoryEntity);
    }

    public Optional<Category> getCategoryById(Integer id) {
        Optional<CategoryEntity> categoryEntity = categoryRepository.findById(id);
        return categoryEntity.map(categoryMapper::toDto);
    }

    public List<Category> listCategories() {
        List<CategoryEntity> categoryEntities = categoryRepository.findAll();
        return categoryEntities.stream()
                .map(categoryMapper::toDto)
                .collect(Collectors.toList());
    }

    public Category updateCategoryById(Integer id, Category category) {
        if (!categoryRepository.existsById(id)) {
            throw new RuntimeException("Category not found");
        }
        CategoryEntity categoryEntity = categoryMapper.toEntity(category);
        categoryEntity.setId(id);
        CategoryEntity updatedCategoryEntity = categoryRepository.save(categoryEntity);
        return categoryMapper.toDto(updatedCategoryEntity);
    }

    public void deleteCategoryById(Integer id) {
        if (!categoryRepository.existsById(id)) {
            throw new RuntimeException("Category not found");
        }
        categoryRepository.deleteById(id);
    }
}