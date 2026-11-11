package com.anoto.dto;

public record FileResponse(
    String fileName,
    String base64Data,
    String contentType
) {
}
