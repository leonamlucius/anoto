package com.anoto.mapper;

import com.anoto.dto.NoteRequest;
import com.anoto.dto.NoteResponse;
import com.anoto.model.Note;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import com.anoto.service.CryptoUtil;

@Mapper(componentModel = "spring")
public interface NoteMapper {

    @Mapping(target = "title", source = "title", qualifiedByName = "decrypt")
    @Mapping(target = "content", source = "content", qualifiedByName = "decrypt")
    NoteResponse toResponse(Note note);


    @Mapping(target = "title", source = "title", qualifiedByName = "encrypt")
    @Mapping(source = "content", target = "content", qualifiedByName = "encrypt")
    Note toEntity(NoteRequest noteRequest);

    @Named("encrypt")
    default String encryptContent(String content) {
        try {
            return CryptoUtil.encrypt(content);
        } catch (Exception e) {
            throw new RuntimeException("Error encrypting content", e);
        }
    }

    @Named("decrypt")
    default String decryptContent(String content) {
        try {
            return CryptoUtil.decrypt(content);
        } catch (Exception e) {
            throw new RuntimeException("Error decrypting content", e);
        }
    }

}
