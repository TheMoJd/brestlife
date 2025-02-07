package com.brestlife.backend.mapper;

import com.brestlife.backend.entity.PlaceEntity;
import com.brestlife.generate.dto.Place;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface PlaceMapper {

    PlaceMapper INSTANCE = Mappers.getMapper(PlaceMapper.class);

    Place toDto(PlaceEntity entity);

    PlaceEntity toEntity(Place dto);
}
