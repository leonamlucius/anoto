package com.anoto.service;

import com.anoto.model.User;
import com.anoto.model.PasswordResetToken;
import com.anoto.repository.UserRepository;
import com.anoto.repository.PasswordResetTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.sendgrid.*;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import org.springframework.beans.factory.annotation.Value;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class PasswordService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordResetTokenRepository tokenRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${SENDGRID}")
private String sendgridApiKey;

    public void sendResetPasswordEmail(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        // Remove tokens antigos desse usuário
        tokenRepository.findAll().stream()
            .filter(t -> t.getUser().getId().equals(user.getId()))
            .forEach(tokenRepository::delete);

        String token = UUID.randomUUID().toString();

        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUser(user);
        resetToken.setExpiryDate(LocalDateTime.now().plusHours(1));
        tokenRepository.save(resetToken);

        String link = "https://anoto-seven.vercel.app/resetar-senha?token=" + token;
        sendEmail(user.getEmail(), "Redefinição de senha", "Clique para redefinir sua senha: " + link);
    }

    public void sendEmail(String to, String subject, String text) {
    Email from = new Email("leonam253@gmail.com");
    Email toEmail = new Email(to);
    Content content = new Content("text/plain", text);
    Mail mail = new Mail(from, subject, toEmail, content);

    SendGrid sg = new SendGrid(sendgridApiKey);
    Request request = new Request();
    try {
        request.setMethod(Method.POST);
        request.setEndpoint("mail/send");
        request.setBody(mail.build());
        sg.api(request);
    } catch (Exception e) {
        throw new RuntimeException("Erro ao enviar email: " + e.getMessage());
    }
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
}