package com.anoto.service;

import org.springframework.stereotype.Service;
import com.anoto.dto.InfoResponse;

import com.anoto.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;

@Service
public class InfoService {

    @Autowired
    private UserRepository userRepository;

    public InfoResponse getInfo(String id) {
        return userRepository.findById(Long.parseLong(id))
                .map(user -> new InfoResponse(user.getEmail(), user.getName()))
                .orElse(null);
    }

}
