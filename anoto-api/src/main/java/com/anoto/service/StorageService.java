package com.anoto.service;

import java.io.File;
import java.io.IOException;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.core.sync.RequestBody;

import org.springframework.web.multipart.MultipartFile;

import com.anoto.dto.FileResponse;
import com.anoto.dto.FileRequest;
import com.anoto.model.Storage;
import com.anoto.model.User;
import com.anoto.repository.UserRepository;
import com.anoto.repository.StorageRepository;

import java.util.Base64;
import java.util.ArrayList;
import java.util.List;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Request;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Response;
import software.amazon.awssdk.services.s3.model.S3Object;
import java.util.stream.Collectors;
import java.util.UUID;

import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.ResponseInputStream;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class StorageService {

    private static final Logger logger = LoggerFactory.getLogger(StorageService.class);

    private final S3Client s3Client;
    private final UserRepository userRepository;
    private final StorageRepository storageRepository;

    @Value("${app.s3.bucket-name:anoto-bucket}")
    private String bucketName;

    public StorageService(S3Client s3Client, UserRepository userRepository, StorageRepository storageRepository) {
        this.s3Client = s3Client;
        this.userRepository = userRepository;
        this.storageRepository = storageRepository;
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));
    }

    public FileResponse setProfilePhoto(FileRequest fileDTO) throws Exception {
        User user = getCurrentUser();

        if (fileDTO == null || fileDTO.fileName() == null) {
            logger.error("File name está nulo ou inválido.");
            throw new IllegalArgumentException("File name está nulo ou inválido.");
        }

        Storage storage = storageRepository.findByFileName(fileDTO.fileName())
                .orElseGet(() -> storageRepository.save(
                        Storage.builder()
                                .fileName(fileDTO.fileName())
                                .build()));

        user.setProfilePhoto(storage);
        userRepository.save(user);

        logger.info("Foto de perfil atualizada para o usuário " + user.getEmail());
        return getActualImage();

    }

    public FileResponse getActualImage() throws Exception {

        User user = getCurrentUser();

        String fileName = user.getProfilePhoto().getFileName();

        if (fileName == null) {
            logger.warn("Usuário " + user.getEmail() + " não possui foto de perfil.");
            return null;
        }

        GetObjectRequest getRequest = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(fileName)
                .build();

        try (ResponseInputStream<GetObjectResponse> s3Stream = s3Client.getObject(getRequest)) {
            byte[] bytes = s3Stream.readAllBytes();
            String base64Data = Base64.getEncoder().encodeToString(bytes);
            String contentType = s3Stream.response().contentType();
            logger.info("Imagem atual do usuário " + user.getEmail() + " obtida com sucesso.");
            return new FileResponse(fileName, base64Data, contentType);
        }

    }

    public void setDefaultImage(User user) throws Exception {

        ListObjectsV2Request listRequest = ListObjectsV2Request.builder()
                .bucket(bucketName)
                .build();

        ListObjectsV2Response listResponse = s3Client.listObjectsV2(listRequest);
        List<S3Object> objects = listResponse.contents();
        if (objects.isEmpty()) {
            logger.error("Nenhum arquivo encontrado no bucket.");
            throw new Exception("No files found in the bucket");
        }

        S3Object defaultImage = objects.stream()
                .filter(obj -> obj.key().contains("15fad3ac-2fe6-4a4e-85f3-c2af960b1205_user-icon_6.png"))
                .findFirst()
                .orElseThrow(() -> {
                    logger.error("Imagem padrão não encontrada no bucket.");
                    return new Exception("Default image not found in the bucket");
                });

        String fileName = defaultImage.key();

        Storage storage = storageRepository.findByFileName(fileName)
                .orElseGet(() -> storageRepository.save(
                        Storage.builder()
                                .fileName(fileName)
                                .build()));
        logger.info("Imagem padrão definida para o usuário " + user.getEmail());
        user.setProfilePhoto(storage);
        userRepository.save(user);

    }

    public List<FileResponse> getAllFilesFromBucket() throws IOException {
        ListObjectsV2Request listRequest = ListObjectsV2Request.builder()
                .bucket(bucketName)
                .build();

        ListObjectsV2Response listResponse = s3Client.listObjectsV2(listRequest);
        List<FileResponse> fileList = new ArrayList<>();

        for (S3Object s3Object : listResponse.contents()) {
            String fileName = s3Object.key();

            GetObjectRequest getRequest = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileName)
                    .build();

            try (ResponseInputStream<GetObjectResponse> s3Stream = s3Client.getObject(getRequest)) {
                byte[] bytes = s3Stream.readAllBytes();
                String base64Data = Base64.getEncoder().encodeToString(bytes);
                String contentType = s3Stream.response().contentType();
                logger.info("Arquivo " + fileName + " obtido do bucket com sucesso.");
                fileList.add(new FileResponse(fileName, base64Data, contentType));
            }
        }

        return fileList;
    }

    public String uploadFile(MultipartFile file) throws Exception {
        String originalFilename = file.getOriginalFilename();
        String fileName = UUID.randomUUID() + "_" + (originalFilename != null ? originalFilename : "file");

        s3Client.putObject(
                PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(fileName)
                        .contentType(file.getContentType())
                        .build(),
                RequestBody.fromBytes(file.getBytes()));
        logger.info("Arquivo " + fileName + " enviado para o bucket com sucesso.");
        return fileName;
    }

}
