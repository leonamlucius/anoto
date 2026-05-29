package com.anoto.dto;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ResetPasswordRequest {
    @NotBlank(message = "Token obrigatório.")
    private String token;

    @NotBlank(message = "Nova senha obrigatória.")
    private String newPassword;
}
