package com.anoto.dto;

import java.time.LocalDateTime;

public record NoteResponse(
        Long id,
        String title,
        String content,
        String color,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        Boolean fixed) {
}
