package com.anoto.mapper;

import com.anoto.dto.FolderResponse;
import com.anoto.dto.FolderRequest;
import com.anoto.model.Folder;
import com.anoto.model.Note;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface FolderMapper {

    Folder toEntity(FolderRequest request);

    @Mapping(source = "notes", target = "noteIds")
    FolderResponse toResponse(Folder folder);

    default Long toId(Note note) {
        return note.getId();
    }
}
