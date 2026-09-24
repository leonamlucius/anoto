package com.anoto.controller;

import org.springframework.beans.factory.annotation.Autowired;
import com.anoto.config.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.anoto.service.InfoService;
import com.anoto.dto.InfoResponse;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

@RestController
@RequestMapping("/info")
@RequiredArgsConstructor
public class InfoController {

    @Autowired
    private InfoService infoService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("get")
    public ResponseEntity<InfoResponse> getInfo(
            @RequestHeader(value = "Authorization", required = true) String bearerToken) {
        if (bearerToken == null || !bearerToken.startsWith("Bearer ")) {
            return ResponseEntity.status(401).build();
        }
        String token = bearerToken.substring(7);
        String userId = jwtUtil.extractUserIdFromToken(token);
        return ResponseEntity.ok(infoService.getInfo(userId));
    }

}
