package com.url.shrotener.service;

import com.url.shrotener.dto.LoginRequest;
import com.url.shrotener.dto.LoginResponse;
import com.url.shrotener.dto.UserResponse;
import com.url.shrotener.model.User;
import com.url.shrotener.repository.UserRepository;
import com.url.shrotener.security.jwt.JwtUtils;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UserService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    // Encodes the password before saving the new user.
    public void registerUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
    }

    // Authenticates the user and generates a JWT after successful login.
    public LoginResponse loginUser(LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        // Store the authenticated user in the security context.
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Retrieve and verify the authenticated user's details.
        Object principal = authentication.getPrincipal();

        if (!(principal instanceof UserDetailsImpl userDetails)) {
            throw new IllegalStateException(
                    "Authenticated user details are not available"
            );
        }

        // Generate a JWT for the authenticated user.
        String jwt = jwtUtils.generateToken(userDetails);

        // Prepare the user details returned to the frontend.
        UserResponse userResponse = new UserResponse(
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail()
        );

        return new LoginResponse(jwt, userResponse);
    }

    // Finds a user by username or throws an exception if not found.
    public User findByUsername(String userName) {
        return userRepository.findByUsername(userName).orElseThrow(
                () -> new UsernameNotFoundException(
                        "User not found with username: " + userName
                )
        );
    }
}