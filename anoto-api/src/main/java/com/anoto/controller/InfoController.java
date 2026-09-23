package com.anoto.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.anoto.service.InfoService;
import com.anoto.dto.InfoResponse;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/info")
@RequiredArgsConstructor
public class InfoController {

    @Autowired
    private InfoService infoService;

    @GetMapping("/{param}")
    public ResponseEntity<InfoResponse> getInfo(@PathVariable String param) {
        return ResponseEntity.ok(infoService.getInfo(param));
    }

}
