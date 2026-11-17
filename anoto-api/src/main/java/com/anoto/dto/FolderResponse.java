package com.anoto.dto;

import java.time.LocalDateTime;
import java.util.List;

public record FolderResponse(
        Long id,
        String title,
        String description,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        List<Long> noteIds,
        String color) {
}
