package com.url.shrotener.controller;

import com.url.shrotener.dto.LoginRequest;
import com.url.shrotener.dto.LoginResponse;
import com.url.shrotener.dto.RegisterRequest;
import com.url.shrotener.dto.UserResponse;
import com.url.shrotener.model.User;
import com.url.shrotener.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
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
public class AuthController {

    private final UserService userService;
    private final boolean secureCookie;

    // Constructor injection for required dependencies.
    public AuthController(
            UserService userService,
            @Value("${cookie.secure:true}") boolean secureCookie) {
        this.userService = userService;
        this.secureCookie = secureCookie;
    }

    // Authenticates the user and stores the JWT in an HTTP-only cookie.
    @PostMapping("/login")
    public ResponseEntity<UserResponse> loginUser(
            @RequestBody LoginRequest loginRequest,
            HttpServletResponse response) {

        LoginResponse loginResponse = userService.loginUser(loginRequest);

        // Create a cookie containing the generated JWT.
        ResponseCookie cookie = ResponseCookie.from(
                        "accessToken",
                        loginResponse.getToken()
                )
                .httpOnly(true)
                .secure(secureCookie)
                .path("/")
                .maxAge(Duration.ofHours(1))
                .sameSite("Lax")
                .build();

        // Add the cookie to the response headers.
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        // Return the logged-in user's details.
        return ResponseEntity.ok(loginResponse.getUser());
    }

    // Registers a new user with the default USER role.
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(
            @RequestBody RegisterRequest registerRequest) {

        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setPassword(registerRequest.getPassword());
        user.setEmail(registerRequest.getEmail());
        user.setRole("ROLE_USER");

        // Save the new user.
        userService.registerUser(user);

        return ResponseEntity.ok("User registered successfully!");
    }

    // Logs out the user by clearing the JWT cookie.
    @PostMapping("/logout")
    public ResponseEntity<Void> logoutUser(HttpServletResponse response) {

        ResponseCookie cookie = ResponseCookie.from("accessToken", "")
                .httpOnly(true)
                .secure(secureCookie)
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();

        // Send the expired cookie so the browser removes it.
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.noContent().build();
    }
}