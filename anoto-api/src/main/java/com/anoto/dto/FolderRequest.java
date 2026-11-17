package com.anoto.dto;

import java.util.List;

public record FolderRequest(

        String title,
        String description,
        List<Long> noteIds,
        String color) {
}
