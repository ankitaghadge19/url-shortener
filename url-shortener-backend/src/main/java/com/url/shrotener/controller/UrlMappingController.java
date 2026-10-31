package com.url.shrotener.controller;

import com.url.shrotener.dto.ClickEventDto;
import com.url.shrotener.dto.UrlMappingDto;
import com.url.shrotener.model.User;
import com.url.shrotener.service.UrlMappingService;
import com.url.shrotener.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/urls")
@RequiredArgsConstructor
public class UrlMappingController {

    private final UrlMappingService urlMappingService;
    private final UserService userService;

    // Creates a new short URL for the authenticated user.
    @PostMapping("/shorten")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<UrlMappingDto> createShortUrl(
            @RequestBody Map<String, String> request,
            Principal principal) {

        String originalUrl = request.get("originalUrl");

        User user = userService.findByUsername(principal.getName());

        UrlMappingDto urlMappingDto =
                urlMappingService.createShortUrl(originalUrl, user);

        return ResponseEntity.ok(urlMappingDto);
    }

    // Returns all shortened URLs created by the authenticated user.
    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<UrlMappingDto>> getAllShortUrls(Principal principal) {

        User user = userService.findByUsername(principal.getName());

        List<UrlMappingDto> urls = urlMappingService.getUrlsByUser(user);

        return ResponseEntity.ok(urls);
    }

    // Returns daily click counts for a specific short URL.
    @GetMapping("/analytics/daily-clicks/{shortUrl}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<ClickEventDto>> getUrlAnalytics(
            @PathVariable String shortUrl,
            @RequestParam("startDate") LocalDate startDate,
            @RequestParam("endDate") LocalDate endDate) {

        List<ClickEventDto> clickEventDtos =
                urlMappingService.getClickEventsByDate(shortUrl, startDate, endDate);

        return ResponseEntity.ok(clickEventDtos);
    }

    // Returns daily total clicks across all URLs owned by the authenticated user.
    @GetMapping("/daily-clicks")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<ClickEventDto>> getTotalClicksByDate(
            Principal principal,
            @RequestParam("startDate") LocalDate startDate,
            @RequestParam("endDate") LocalDate endDate) {

        User user = userService.findByUsername(principal.getName());

        List<ClickEventDto> dailyClicks =
                urlMappingService.getTotalClickEventsByUserAndDate(
                        user, startDate, endDate
                );

        return ResponseEntity.ok(dailyClicks);
    }

    // Returns a short URL by ID only if it belongs to the authenticated user.
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<UrlMappingDto> getShortUrlById(
            @PathVariable Long id,
            Principal principal) {

        User user = userService.findByUsername(principal.getName());

        UrlMappingDto url = urlMappingService.getUrlByIdAndUser(id, user);

        return ResponseEntity.ok(url);
    }
}