package com.url.shrotener.security.jwt;

import com.url.shrotener.service.UserDetailsImpl;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.stream.Collectors;

@Component
public class JwtUtils {

    // The key used to sign new JWTs and verify existing JWT signatures.
    private final SecretKey signingKey;

    // Token lifetime in milliseconds, configured outside the Java code.
    private final long jwtExpirationMs;

    // Spring injects the secret and expiration value from application.properties
    // or the corresponding environment variables.
    public JwtUtils(
            @Value("${jwt.secret}") String jwtSecret,
            @Value("${jwt.expiration}") long jwtExpirationMs) {

        // The secret is Base64-encoded, so decode it before creating the key.
        // Creating the key once avoids repeating this work for every request.
        this.signingKey = Keys.hmacShaKeyFor(
                Decoders.BASE64.decode(jwtSecret)
        );

        this.jwtExpirationMs = jwtExpirationMs;
    }

    // Reads the accessToken cookie from an incoming HTTP request.
    public String getJwtFromCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();

        // A request may contain no cookies, so check for null before looping.
        if (cookies != null) {
            for (Cookie cookie : cookies) {

                // Return the value of the cookie used for JWT authentication.
                if ("accessToken".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }

        // Return null when the request does not contain an accessToken cookie.
        return null;
    }

    // Generates a signed JWT containing the username, roles, issue time, and expiration time.
    public String generateToken(UserDetailsImpl userDetails) {

        // Use the username as the token subject to identify the user.
        String username = userDetails.getUsername();

        // Convert the user's authorities into a comma-separated string.
        String roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(", "));

        // Record when the token is created and when it should expire.
        Date now = new Date();
        Date expiration = new Date(now.getTime() + jwtExpirationMs);

        // Build the token, sign it with our secret key, and
        // return the compact JWT string that can be sent to the browser.
        return Jwts.builder()
                .subject(username)
                .claim("roles", roles)
                .issuedAt(now)
                .expiration(expiration)
                .signWith(signingKey)
                .compact();
    }

    // Verifies the JWT signature and expiration before returning its username.
    // An invalid token causes the JWT library to throw an exception.
    public String getUserNameFromJwtToken(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    // Returns true only when the JWT is correctly signed and still valid.
    public boolean validateToken(String authToken) {
        try {
            Jwts.parser()
                    .verifyWith(signingKey)
                    .build()
                    .parseSignedClaims(authToken);

            return true;
        } catch (JwtException | IllegalArgumentException e) {
            // A malformed, expired, or incorrectly signed token is invalid.
            return false;
        }
    }
}