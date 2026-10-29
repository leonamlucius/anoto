package com.anoto.scheduler;

import com.anoto.service.PasswordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class PingEmail {

    @Autowired
    private PasswordService passwordService;

    @Value("${brevo.sender.email}")
    private String senderEmail;

    @Scheduled(cron = "0 0 9 * * MON")
    public void ping() {

        passwordService.sendEmail(senderEmail, "Ping Teste", "<p>Ping!</p>");
    }
}
