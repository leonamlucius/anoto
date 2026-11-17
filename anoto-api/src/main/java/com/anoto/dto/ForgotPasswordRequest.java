package com.anoto.dto;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ForgotPasswordRequest(
    @Email(message = "Email inválido.")
    @NotBlank(message = "Email obrigatório.")
    String email) {
}