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

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Cookie;

import com.anoto.service.CookieService;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CookieService cookieService;

    @PostMapping("/register")
    public ResponseEntity<LoginResponse> register(@Valid @RequestBody RegisterRequest request,
            HttpServletResponse response) {

        LoginResponse loginResponse = authService.register(request);

        Cookie cookie = cookieService.createCookie(loginResponse.getEmail(), loginResponse.getId());
        response.addCookie(cookie);
        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request,
            HttpServletResponse response) {
        LoginResponse loginResponse = authService.login(request);
        Cookie cookie = cookieService.createCookie(loginResponse.getEmail(), loginResponse.getId());
        response.addCookie(cookie);
        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/jwtTest")
    public ResponseEntity<Boolean> jwtTest(HttpServletRequest requestHttp) {

        String token = null;
        Cookie[] cookies = requestHttp.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("jwt".equals(cookie.getName())) {
                    token = cookie.getValue();
                    break;
                }
            }
        }

        if (token == null) {
            return ResponseEntity.status(401).body(false);
        }

        boolean isValid = jwtUtil.isTokenValid(token);
        return ResponseEntity.ok(isValid);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        Cookie cookie = cookieService.deleteCookie();
        response.addCookie(cookie);
        return ResponseEntity.ok().build();
    }
}
