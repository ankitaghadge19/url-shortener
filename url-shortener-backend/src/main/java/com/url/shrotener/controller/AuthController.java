package com.url.shrotener.controller;

import com.url.shrotener.dto.LoginRequest;
import com.url.shrotener.dto.LoginResponse;
import com.url.shrotener.dto.RegisterRequest;
import com.url.shrotener.dto.UserResponse;
import com.url.shrotener.model.User;
import com.url.shrotener.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
public class AuthController {

    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<UserResponse> loginUser(@RequestBody LoginRequest loginRequest, HttpServletResponse response){
        LoginResponse loginResponse = userService.loginUser(loginRequest);
        ResponseCookie cookie = ResponseCookie.from(
                "accessToken",
                loginResponse.getToken()
        )
            .httpOnly(true)
            .secure(false)
            .path("/")
            .maxAge(Duration.ofHours(1))
            .sameSite("Lax")
            .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        return ResponseEntity.ok(loginResponse.getUser());
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest){
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setPassword(registerRequest.getPassword());
        user.setEmail(registerRequest.getEmail());
        user.setRole("ROLE_USER");
        userService.registerUser(user);
        return ResponseEntity.ok("User registered successfully!");
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logoutUser(HttpServletResponse response){
        ResponseCookie cookie = ResponseCookie.from("accessToken", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        return ResponseEntity.noContent().build();
    }
}
