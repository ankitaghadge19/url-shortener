package com.url.shrotener.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // Reads the allowed frontend URL from application.properties.
    // This keeps the frontend address configurable for local and production environments.
    @Value("${frontend.url}")
    private String frontendUrl;

    @Override
    public void addCorsMappings(CorsRegistry registry) {

        // Apply these CORS rules to all backend endpoints.
        registry.addMapping("/**")

                // Allow requests only from the configured frontend origin.
                .allowedOrigins(frontendUrl)

                // Allow the HTTP methods used by the frontend to access the API.
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")

                // Allow request headers such as Content-Type and Authorization.
                .allowedHeaders("*")

                // Allow the browser to send cookies with cross-origin requests.
                // Required because the application uses a JWT stored in a cookie.
                .allowCredentials(true)

                // Let the browser cache the CORS preflight response for one hour.
                // This reduces unnecessary OPTIONS requests.
                .maxAge(3600);
    }
}