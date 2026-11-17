package com.anoto.service;

import org.springframework.stereotype.Service;
import com.anoto.dto.InfoResponse;
import com.anoto.model.User;
import com.anoto.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import com.anoto.dto.InfoRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;

@Service
@RequiredArgsConstructor
public class InfoService {

    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));
    }

    public InfoResponse getInfo() {

        User currentUser = getCurrentUser();

        return userRepository.findById(Long.parseLong(currentUser.getId().toString()))
                .map(user -> new InfoResponse(user.getEmail(), user.getName()))
                .orElse(null);
    }

    public InfoResponse updateInfo(InfoRequest infoRequest) {
        User currentUser = getCurrentUser();

        if (infoRequest.email() != null) {
            currentUser.setEmail(infoRequest.email());
        }
        if (infoRequest.name() != null) {
            currentUser.setName(infoRequest.name());
        }
        userRepository.save(currentUser);

        return new InfoResponse(currentUser.getEmail(), currentUser.getName());
    }

}
