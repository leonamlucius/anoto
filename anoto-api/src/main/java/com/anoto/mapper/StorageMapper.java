package com.anoto.mapper;

import com.anoto.dto.FileRequest;
import com.anoto.dto.FileResponse;
import com.anoto.model.Storage;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface StorageMapper {

    FileResponse toResponse(Storage storage);

    Storage toEntity(FileRequest request);

    default FileResponse toFileResponse(String fileName, String base64Data, String contentType) {
        return new FileResponse(fileName, base64Data, contentType);
    }

}
