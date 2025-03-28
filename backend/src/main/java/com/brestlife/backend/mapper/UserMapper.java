package com.brestlife.backend.mapper;

import com.brestlife.backend.entity.UserEntity;
import com.brestlife.generate.dto.User;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface UserMapper {

    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    User toDto(UserEntity entity);

    UserEntity toEntity(User dto);
}
