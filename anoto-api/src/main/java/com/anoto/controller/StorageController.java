package com.anoto.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import com.anoto.dto.FileResponse;
import com.anoto.dto.FileRequest;

import java.util.List;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import com.anoto.service.StorageService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/storage")
public class StorageController {

    @Autowired
    private StorageService storageService;

    @PostMapping("/delete-all")
    public ResponseEntity<Integer> deleteAll(HttpServletResponse response) {
        try {
            int deletedCount = storageService.deleteAll();
            return ResponseEntity.ok(deletedCount);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/profile-photo")
    public ResponseEntity<FileResponse> setProfilePhoto(@RequestBody FileRequest request,
            HttpServletResponse response) {
        try {
            FileResponse file = storageService.setProfilePhoto(new FileRequest(request.fileName()));
            return ResponseEntity.ok(file);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/photo")
    public ResponseEntity<FileResponse> getPhoto(HttpServletRequest request) {
        try {
            FileResponse file = storageService.getActualImage();
            return ResponseEntity.ok(file);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<FileResponse>> getAllFiles(HttpServletRequest request) {
        try {
            List<FileResponse> files = storageService.getAllFilesFromBucket();
            return ResponseEntity.ok(files);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<String> upload(@RequestParam("file") MultipartFile file, HttpServletResponse response) {

        try {
            String fileName = storageService.uploadFile(file);
            return ResponseEntity.ok("Upload feito com sucesso: " + fileName);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Falha no upload: " + e.getMessage());
        }

    }

}
