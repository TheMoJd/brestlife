package com.brestlife.backend.mapper;

import com.brestlife.backend.entity.DealEntity;
import com.brestlife.generate.dto.Deal;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface DealMapper {

    DealMapper INSTANCE = Mappers.getMapper(DealMapper.class);

    Deal toDto(DealEntity entity);

    DealEntity toEntity(Deal dto);
}
