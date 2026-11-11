package com.anoto.config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.CreateBucketRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;

@Component
public class S3BucketInitializer {

    private final S3Client s3Client;

    @Value("${app.s3.bucket-name:anoto-bucket}")
    private String bucketName;

    public S3BucketInitializer(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    @PostConstruct
    public void createBucketIfNotExists() {
        try {
            s3Client.createBucket(CreateBucketRequest.builder()
                    .bucket(bucketName)
                    .build());
            System.out.println("Bucket S3 criado com sucesso: " + bucketName);
        } catch (S3Exception e) {
            if (e.awsErrorDetails().errorCode().equals("BucketAlreadyOwnedByYou") ||
                    e.awsErrorDetails().errorCode().equals("BucketAlreadyExists")) {
                System.out.println("O bucket '" + bucketName + "' já existe.");
            } else {
                System.err.println("Erro ao criar bucket S3: " + e.getMessage());
            }
        }
    }
}
