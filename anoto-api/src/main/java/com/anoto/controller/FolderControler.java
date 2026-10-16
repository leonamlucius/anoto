package com.anoto.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import com.anoto.dto.FolderResponse;
import com.anoto.dto.FolderRequest;
import com.anoto.service.FolderService;
import org.springframework.http.ResponseEntity;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/folders")
@RequiredArgsConstructor
public class FolderControler {

    private final FolderService folderService;

    @GetMapping
    public ResponseEntity<List<FolderResponse>> getFolder() {
        return ResponseEntity.ok(folderService.findAll());
    }

    @PostMapping
    public ResponseEntity<FolderResponse> createFolder(@RequestBody FolderRequest folderRequest) {
        return ResponseEntity.ok(folderService.createFolder(folderRequest));
    }

    @GetMapping("/{id}")
    public ResponseEntity<FolderResponse> getFolderById(@PathVariable Long id) {
        return ResponseEntity.ok(folderService.findById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFolder(@PathVariable Long id) {
        folderService.deleteFolder(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}")
    public ResponseEntity<FolderResponse> updateFolder(@PathVariable Long id,
            @RequestBody FolderRequest folderRequest) {
        return ResponseEntity.ok(folderService.updateFolder(id, folderRequest));
    }

    @PostMapping("/link/{id}")
    public ResponseEntity<FolderResponse> linkFolder(@PathVariable Long id, @RequestBody FolderRequest folderRequest) {
        return ResponseEntity.ok(folderService.linkFolder(id, folderRequest));
    }

}
