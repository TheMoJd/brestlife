package com.brestlife.backend.controller;

import com.brestlife.backend.service.CategoryService;
import com.brestlife.generate.api.CategoriesApi;
import com.brestlife.generate.dto.Category;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
public class CategoryController implements CategoriesApi {

    private final CategoryService categoryService;

    @Autowired
    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Category> createCategory(Category category) {
        Category createdCategory = categoryService.createCategory(category);
        return ResponseEntity.ok(createdCategory);
    }

    @Override
    public ResponseEntity<Category> getCategoryById(Integer id) {
        Optional<Category> category = categoryService.getCategoryById(id);
        return category.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Override
    public ResponseEntity<List<Category>> listCategories() {
        List<Category> categories = categoryService.listCategories();
        return ResponseEntity.ok(categories);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Category> updateCategoryById(Integer id, Category category) {
        Category updatedCategory = categoryService.updateCategoryById(id, category);
        return ResponseEntity.ok(updatedCategory);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCategoryById(Integer id) {
        categoryService.deleteCategoryById(id);
        return ResponseEntity.status(201).build();
    }

    @Override
    public ResponseEntity<List<Category>> listCategoriesByType(String type) {
        Category.TypeEnum typeEnum;
        try {
            typeEnum = Category.TypeEnum.fromValue(type);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
        List<Category> categories = categoryService.listCategoriesByType(typeEnum);
        return ResponseEntity.ok(categories);
    }

}