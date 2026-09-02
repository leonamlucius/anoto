package com.anoto.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class NoteResponse {
    private Long id;
    private String title;
    private String content;
    private String color;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
