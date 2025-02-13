package com.brestlife.backend.mapper;

import com.brestlife.backend.entity.CategoryEntity;
import com.brestlife.generate.dto.Category;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface CategoryMapper {

    CategoryMapper INSTANCE = Mappers.getMapper(CategoryMapper.class);

    Category toDto(CategoryEntity entity);

    CategoryEntity toEntity(Category dto);
}
