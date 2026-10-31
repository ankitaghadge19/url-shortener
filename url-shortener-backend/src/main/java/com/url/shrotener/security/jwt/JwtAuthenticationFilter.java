package com.url.shrotener.security.jwt;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.jspecify.annotations.NonNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    // Used to record useful security-related events without printing directly to the console or exposing token values in the logs.
    private static final Logger log =
            LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final JwtUtils jwtUtils;
    private final UserDetailsService userDetailsService;

    // Constructor injection supplies the JWT utility and user-loading service.
    // Spring automatically provides these dependencies when creating this filter.
    public JwtAuthenticationFilter(
            JwtUtils jwtUtils,
            UserDetailsService userDetailsService) {
        this.jwtUtils = jwtUtils;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        try {
            // Read the JWT from the accessToken cookie sent by the browser.
            String jwt = jwtUtils.getJwtFromCookie(request);

            // Continue with authentication only if a token exists and is valid.
            if (jwt != null && jwtUtils.validateToken(jwt)) {

                // Extract the username from the verified JWT.
                String username = jwtUtils.getUserNameFromJwtToken(jwt);

                // Load the user's current details and authorities from the backend.
                UserDetails userDetails =
                        userDetailsService.loadUserByUsername(username);

                // Create an authentication object containing the user and their authorities.
                // The password is null because the JWT proves authentication; the password is not checked again here.
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );

                // Attach request details, such as the remote address, to the authentication object for use by Spring Security if needed.
                authentication.setDetails(
                        new WebAuthenticationDetailsSource()
                                .buildDetails(request)
                );

                // Store the authenticated user for the current request.
                // Spring Security can now identify the logged-in user and
                // check their permissions when processing the endpoint.
                SecurityContextHolder.getContext()
                        .setAuthentication(authentication);
            }
        } catch (JwtException | IllegalArgumentException e) {
            // Invalid, expired, or malformed tokens must not authenticate the request.
            // Protected endpoints will require authentication.
            SecurityContextHolder.clearContext();
            log.debug("JWT validation failed");
        } catch (UsernameNotFoundException e) {
            // The token may refer to an account that no longer exists.
            SecurityContextHolder.clearContext();
            log.debug("JWT user was not found");
        }

        // Continue processing the request. Spring Security will decide whether the endpoint is public or requires an authenticated user.
        filterChain.doFilter(request, response);
    }
}