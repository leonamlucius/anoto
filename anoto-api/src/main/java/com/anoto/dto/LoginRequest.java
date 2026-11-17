package com.anoto.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(

        @Email(message = "Email inválido.") @NotBlank(message = "Email obrigatório.") String email,

        @NotBlank(message = "Senha obrigatória.") String password) {
}
