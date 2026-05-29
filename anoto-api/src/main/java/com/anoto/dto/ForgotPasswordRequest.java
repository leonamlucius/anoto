package com.anoto.dto;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ForgotPasswordRequest {
    @Email(message = "Email inválido.")
    @NotBlank(message = "Email obrigatório.")
    private String email;
}