package com.anoto.service;

import org.springframework.stereotype.Service;
import com.anoto.config.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class CookieService {

    private static final Logger logger = LoggerFactory.getLogger(CookieService.class);

    @Autowired
    private JwtUtil jwtUtil;

    public Cookie createCookie(String email, Long userId) {

        try {
            String token = jwtUtil.generateToken(email, userId);
            Cookie jtwCookie = new Cookie("jwt", token);
            jtwCookie.setHttpOnly(true);
            jtwCookie.setSecure(true);
            jtwCookie.setPath("/");
            jtwCookie.setMaxAge(60 * 60);
            jtwCookie.setAttribute("SameSite", "none");
            logger.info("JWT cookie created successfully");
            return jtwCookie;

        } catch (Exception e) {
            logger.error("Error creating cookie", e);
            throw e;
        }

    }

    public Cookie deleteCookie() {
        try {
            Cookie deleteCookie = new Cookie("jwt", null);
            deleteCookie.setHttpOnly(true);
            deleteCookie.setSecure(true);
            deleteCookie.setPath("/");
            deleteCookie.setMaxAge(0);
            deleteCookie.setAttribute("SameSite", "none");
            logger.info("JWT cookie deleted successfully");
            return deleteCookie;
        } catch (Exception e) {
            logger.error("Error deleting cookie", e);
            throw e;
        }
    }

    public Cookie getCookie(HttpServletRequest request) {
        try {
            Cookie[] cookies = request.getCookies();
            if (cookies != null) {
                for (Cookie cookie : cookies) {
                    if ("jwt".equals(cookie.getName())) {
                        return cookie;
                    }
                }
            }
            return null;
        } catch (Exception e) {
            logger.error("Error retrieving cookie", e);
            throw e;
        }
    }

}
