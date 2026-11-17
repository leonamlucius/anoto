package com.anoto.dto;

public record NoteRequest(
        String title,
        String content,
        String color) {
}
