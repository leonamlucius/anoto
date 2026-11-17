package com.anoto.controller;

import com.anoto.dto.ForgotPasswordRequest;
import com.anoto.dto.ResetPasswordRequest;
import com.anoto.service.PasswordService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class PasswordController {

    private final PasswordService passwordService;

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        passwordService.sendResetPasswordEmail(request.email());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        passwordService.resetPassword(request.token(), request.newPassword());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/test-reset-password")
    public ResponseEntity<?> testResetPassword(@RequestBody ResetPasswordRequest request) {
        passwordService.testResetPassword(request.token());
        return ResponseEntity.ok().build();
    }
}