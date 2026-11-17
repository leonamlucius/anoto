package com.anoto.service;

import com.anoto.dto.LoginRequest;
import com.anoto.dto.LoginResponse;
import com.anoto.dto.RegisterRequest;
import com.anoto.model.User;
import com.anoto.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final StorageService storageService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public LoginResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email já cadastrado.");
        }

        User user = User.builder()
                .name(request.name())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .build();

        userRepository.save(user);

        try {
            storageService.setDefaultImage(user);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao definir a imagem padrão.", e);
        }

        return new LoginResponse(user.getId(), user.getEmail(), user.getName());
    }

    public LoginResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password()));

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));

        return new LoginResponse(user.getId(), user.getEmail(), user.getName());
    }
}
