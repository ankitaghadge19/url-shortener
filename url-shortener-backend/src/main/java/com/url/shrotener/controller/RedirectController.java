package com.url.shrotener.controller;

import com.url.shrotener.model.UrlMapping;
import com.url.shrotener.service.UrlMappingService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
public class RedirectController {

    private UrlMappingService urlMappingService;

    @GetMapping("/{shortUrl}")
    public ResponseEntity<Void> redirect(@PathVariable String shortUrl){
        UrlMapping urlMapping = urlMappingService.processRedirect(shortUrl);
        if(urlMapping == null){
            return ResponseEntity.notFound().build();
        }
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add("Location", urlMapping.getOriginalUrl());
        return ResponseEntity
                .status(302)
                .headers(httpHeaders)
                .build();
    }
}
