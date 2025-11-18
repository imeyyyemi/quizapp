package com.quizapp.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtTokenProvider {
    @Value("${jwt.secret:mySecretKeyForJWTTokenGenerationAndValidationPurposeOnly12345}")
    private String jwtSecret;

    @Value("${jwt.expiration:86400000}") // 24 hours
    private long jwtExpirationMs;

    public String generateToken(Long userId, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);
        claims.put("userId", userId);
        return createToken(claims, userId.toString());
    }

    private String createToken(Map<String, Object> claims, String subject) {
           Date now = new Date();
           Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

           return Jwts.builder()
                   .setClaims(claims)
                   .setSubject(subject)
                   .setIssuedAt(now)
                   .setExpiration(expiryDate)
                   .signWith(SignatureAlgorithm.HS512, jwtSecret)
                   .compact();
    }

    public Long getUserIdFromJWT(String token) {
        return Long.parseLong(Jwts.parser()
                .setSigningKey(jwtSecret)
                .parseClaimsJws(token)
                .getBody()
                .getSubject());
    }

    public String getRoleFromJWT(String token) {
        return (String) Jwts.parser()
                .setSigningKey(jwtSecret)
                .parseClaimsJws(token)
                .getBody()
                .get("role");
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .setSigningKey(jwtSecret)
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}

