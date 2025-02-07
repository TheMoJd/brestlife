package com.brestlife.backend.mapper;

import com.brestlife.backend.entity.EventEntity;
import com.brestlife.generate.dto.Event;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface EventMapper {

    EventMapper INSTANCE = Mappers.getMapper(EventMapper.class);

    Event toDto(EventEntity entity);

    EventEntity toEntity(Event dto);
}
