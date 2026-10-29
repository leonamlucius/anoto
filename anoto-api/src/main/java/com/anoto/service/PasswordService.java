package com.anoto.service;

import com.anoto.model.User;
import com.anoto.model.PasswordResetToken;
import com.anoto.repository.UserRepository;
import com.anoto.repository.PasswordResetTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class PasswordService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${brevo.api.key}")
    private String brevoApiKey;

    @Value("${brevo.sender.email}")
    private String senderEmail;

    @Value("${URLORIGIN}")
    private String frontendUrl;

    public void sendResetPasswordEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        tokenRepository.findAll().stream()
                .filter(t -> t.getUser().getId().equals(user.getId()))
                .forEach(tokenRepository::delete);

        String token = UUID.randomUUID().toString();

        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUser(user);
        resetToken.setExpiryDate(LocalDateTime.now().plusHours(1));
        tokenRepository.save(resetToken);

        String link = frontendUrl + "/resetar-senha?token=" + token;

        String htmlMessage = "<p>Clique no link abaixo para redefinir sua senha:</p>"
                + "<p><a href=\"" + link + "\">Redefinir Senha</a></p>";

        sendEmail(user.getEmail(), "Redefinição de Senha - Anoto", htmlMessage);
    }

    public void sendEmail(String to, String subject, String htmlText) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        headers.set("api-key", brevoApiKey);

        Map<String, Object> body = new HashMap<>();

        Map<String, String> sender = new HashMap<>();
        sender.put("name", "Anoto");
        sender.put("email", senderEmail);

        List<Map<String, String>> toList = new ArrayList<>();
        Map<String, String> recipient = new HashMap<>();
        recipient.put("email", to);
        toList.add(recipient);

        body.put("sender", sender);
        body.put("to", toList);
        body.put("subject", subject);
        body.put("htmlContent", htmlText);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        restTemplate.postForEntity("https://api.brevo.com/v3/smtp/email", request, String.class);
    }

    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Token inválido"));

        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Token expirado");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        tokenRepository.delete(resetToken);
    }

    public void testResetPassword(String token) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Token inválido"));

        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Token expirado");
        }
    }
}