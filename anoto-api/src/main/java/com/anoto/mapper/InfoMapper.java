package com.anoto.mapper;

import com.anoto.dto.InfoResponse;
import com.anoto.dto.InfoRequest;
import com.anoto.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface InfoMapper {

    InfoResponse toResponse(User user);

    User toEntity(InfoRequest infoRequest);

}
