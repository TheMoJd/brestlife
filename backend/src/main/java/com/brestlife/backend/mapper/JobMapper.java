package com.brestlife.backend.mapper;

import com.brestlife.backend.entity.JobEntity;
import com.brestlife.generate.dto.Job;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface JobMapper {

    JobMapper INSTANCE = Mappers.getMapper(JobMapper.class);

    Job toDto(JobEntity entity);

    JobEntity toEntity(Job dto);
}
