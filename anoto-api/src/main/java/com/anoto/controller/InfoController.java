package com.anoto.controller;

import org.springframework.beans.factory.annotation.Autowired;
import jakarta.servlet.http.Cookie;
import com.anoto.config.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;
import com.anoto.service.InfoService;
import com.anoto.service.CookieService;
import com.anoto.dto.InfoResponse;
import com.anoto.dto.InfoRequest;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

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

        return ResponseEntity.ok(infoService.getInfo());
    }

    @PatchMapping("update")
    public ResponseEntity<InfoResponse> updateInfo(
            HttpServletResponse reponse,
            @RequestBody InfoRequest infoRequest) {

        return ResponseEntity.ok(infoService.updateInfo(infoRequest));
    }
}
