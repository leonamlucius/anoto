package com.anoto.dto;

import lombok.Data;
import java.util.List;

@Data
public class FolderRequest {

    private String title;
    private String description;
    private List<Long> noteIds;
    private String color;

}
