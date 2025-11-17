package com.quizapp.util;

import com.quizapp.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class TokenUtil {
    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    public Long extractUserIdFromToken(String token) {
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        try {
            return jwtTokenProvider.getUserIdFromJWT(token);
        } catch (Exception e) {
            return null;
        }
    }

    public String extractRoleFromToken(String token) {
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        try {
            return jwtTokenProvider.getRoleFromJWT(token);
        } catch (Exception e) {
            return null;
        }
    }

    public boolean validateToken(String token) {
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        return jwtTokenProvider.validateToken(token);
    }
}

