package com.anoto.mapper;

import com.anoto.dto.LoginRequest;
import com.anoto.dto.LoginResponse;
import com.anoto.dto.RegisterRequest;
import com.anoto.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface LoginMapper {

    @Mapping(target = "id", ignore = true)
    User toEntity(LoginRequest loginRequest);
    User toEntity(RegisterRequest registerRequest);

    LoginResponse toResponse(User user);

}
