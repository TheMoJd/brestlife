package com.brestlife.backend;

import com.brestlife.backend.entity.UserEntity;
import com.brestlife.backend.mapper.UserMapper;
import com.brestlife.generate.dto.User;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class UserMapperTest {

    private final UserMapper mapper = UserMapper.INSTANCE;

    @Test
    void testToDto() {
        UserEntity entity = new UserEntity();
        entity.setId(1);
        entity.setName("John Doe");
        entity.setEmail("john.doe@example.com");
        entity.setPassword("secret");

        User dto = mapper.toDto(entity);

        assertNotNull(dto);
        assertEquals(1, dto.getId());
        assertEquals("John Doe", dto.getName());
        assertEquals("john.doe@example.com", dto.getEmail());
        assertNull(dto.getPassword(), "Password should be ignored in mapping");
    }

    @Test
    void testToEntity() {
        User dto = new User();
        dto.setId(1);
        dto.setName("John Doe");
        dto.setEmail("john.doe@example.com");

        UserEntity entity = mapper.toEntity(dto);

        assertNotNull(entity);
        assertEquals(1, entity.getId());
        assertEquals("John Doe", entity.getName());
        assertEquals("john.doe@example.com", entity.getEmail());
    }
}