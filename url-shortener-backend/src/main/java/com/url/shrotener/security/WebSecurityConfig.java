package com.url.shrotener.security;

import com.url.shrotener.security.jwt.JwtAuthenticationFilter;
import com.url.shrotener.service.UserDetailsServiceImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class WebSecurityConfig {

    private final UserDetailsServiceImpl userDetailsServiceImpl;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    // Constructor injection provides the services required for authentication and JWT validation.
    public WebSecurityConfig(
            UserDetailsServiceImpl userDetailsServiceImpl,
            JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.userDetailsServiceImpl = userDetailsServiceImpl;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    // BCrypt hashes passwords before they are stored in the database.
    // During login, Spring uses the same encoder to verify the submitted password.
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Provides the AuthenticationManager used to authenticate login requests.
    // Spring obtains its configuration from the registered authentication provider.
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authenticationConfiguration) {
        return authenticationConfiguration.getAuthenticationManager();
    }

    // Configures how Spring loads user details and verifies passwords.
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {

        // Load users through our existing UserDetailsService implementation.
        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider(userDetailsServiceImpl);

        // Use BCrypt when checking the submitted password against the stored hash.
        provider.setPasswordEncoder(passwordEncoder());

        return provider;
    }


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) {

        httpSecurity
                // Configures CSRF protection using a cookie-based token repository.
                .csrf(csrf -> csrf
                        .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                )

                // Allows the configured frontend to make cross-origin requests.
                .cors(Customizer.withDefaults())

                // Uses stateless authentication because JWTs are used instead of HTTP sessions.
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Defines which endpoints are publicly accessible and which require authentication.
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/urls/**").authenticated()
                        .requestMatchers("/{shortUrl}").permitAll()
                        .anyRequest().authenticated()
                )

                // Registers the authentication provider responsible for loading users and validating passwords.
                .authenticationProvider(authenticationProvider())

                // Executes JWT authentication before Spring's username/password authentication filter.
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return httpSecurity.build();
    }
}