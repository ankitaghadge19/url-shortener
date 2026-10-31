package com.url.shrotener.controller;

import com.url.shrotener.model.UrlMapping;
import com.url.shrotener.service.UrlMappingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class RedirectController {

    private final UrlMappingService urlMappingService;

    // Redirects the user to the original URL using the short URL.
    @GetMapping("/{shortUrl}")
    public ResponseEntity<Void> redirect(@PathVariable String shortUrl) {

        UrlMapping urlMapping = urlMappingService.processRedirect(shortUrl);

        // Redirects the browser to the original URL.
        HttpHeaders headers = new HttpHeaders();

        // Tells the browser where it should navigate next.
        headers.add(HttpHeaders.LOCATION, urlMapping.getOriginalUrl());

        return ResponseEntity
                .status(302)
                .headers(headers)
                .build();
    }
}