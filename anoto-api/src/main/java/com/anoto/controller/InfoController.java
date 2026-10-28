package com.anoto.controller;

import org.springframework.beans.factory.annotation.Autowired;
import jakarta.servlet.http.Cookie;
import com.anoto.config.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.anoto.service.InfoService;
import com.anoto.service.CookieService;
import com.anoto.dto.InfoResponse;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/info")
@RequiredArgsConstructor
public class InfoController {

    @Autowired
    private InfoService infoService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CookieService cookieService;

    @GetMapping("get")
    public ResponseEntity<InfoResponse> getInfo(
            HttpServletRequest request) {

        Cookie token = cookieService.getCookie(request);
        String userId = jwtUtil.extractUserIdFromToken(token.getValue());
        return ResponseEntity.ok(infoService.getInfo(userId));
    }

}
