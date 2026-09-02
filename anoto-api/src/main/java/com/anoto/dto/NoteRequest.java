package com.anoto.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class NoteRequest {

    @NotBlank(message = "Título obrigatório.")
    private String title;

    private String content;

    private String color;
}
