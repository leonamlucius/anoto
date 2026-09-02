package com.anoto.controller;

import com.anoto.config.JwtUtil;
import com.anoto.dto.LoginRequest;
import com.anoto.dto.LoginResponse;
import com.anoto.dto.RegisterRequest;
import com.anoto.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<LoginResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/jwtTest")
    public ResponseEntity<Boolean> jwtTest(@RequestHeader(value = "Authorization", required = true) String bearerToken) {
        if (bearerToken == null || !bearerToken.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(false);
        }
        String token = bearerToken.substring(7);
        boolean isValid = jwtUtil.isTokenValid(token);
        return ResponseEntity.ok(isValid);
    }
}
