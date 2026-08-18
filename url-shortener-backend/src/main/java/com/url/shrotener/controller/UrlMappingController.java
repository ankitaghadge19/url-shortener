package com.url.shrotener.controller;

import com.url.shrotener.dto.ClickEventDto;
import com.url.shrotener.dto.UrlMappingDto;
import com.url.shrotener.model.User;
import com.url.shrotener.service.UrlMappingService;
import com.url.shrotener.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/urls")
@AllArgsConstructor
public class UrlMappingController {
    private UrlMappingService urlMappingService;
    private UserService userService;

    // Creates a new short URL for the authenticated user
    @PostMapping("/shorten")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<UrlMappingDto> createShortUrl(@RequestBody Map<String, String> request,
                                                        Principal principal){
        String originalUrl = request.get("originalUrl");
        User user = userService.findByUsername(principal.getName());
        UrlMappingDto urlMappingDto = urlMappingService.createShortUrl(originalUrl, user);
        return ResponseEntity.ok(urlMappingDto);
    }

    // Returns all shortened URLs created by the authenticated user
    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<UrlMappingDto>> getUserUrls(Principal principal){
        User user = userService.findByUsername(principal.getName());
        List<UrlMappingDto> urls = urlMappingService.getUrlsByUser(user);
        return ResponseEntity.ok(urls);
    }

    // Returns day-wise click count for one specific URL
    @GetMapping("/analytics/daily-clicks/{shortUrl}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<ClickEventDto>> getUrlAnalytics(@PathVariable String shortUrl,
                                                         @RequestParam("startDate") LocalDate startDate,
                                                         @RequestParam("endDate") LocalDate endDate){
//        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE;
//        LocalDate startTime = LocalDate.parse(startDate, formatter);
//        LocalDate endTime = LocalDate.parse(endDate, formatter);

        List<ClickEventDto> clickEventDtos = urlMappingService.getClickEventsByDate(shortUrl, startDate, endDate);
        return ResponseEntity.ok(clickEventDtos);
    }

    // All clicks across all URLs owned by the logged-in user (daily total clicks across every short URL owned by the user)
    @GetMapping("/daily-clicks")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<LocalDate, Long>> getTotalClicksByDate(Principal principal,
                                                                     @RequestParam("startDate") LocalDate startDate,
                                                                     @RequestParam("endDate") LocalDate endDate) {
//        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE;
//        LocalDate startTime = LocalDate.parse(startDate, formatter);
//        LocalDate endTime = LocalDate.parse(endDate, formatter);

        User user = userService.findByUsername(principal.getName());
        Map<LocalDate, Long> totalClicks = urlMappingService.getTotalClickEventsByUserAndDate(user, startDate, endDate);
        return ResponseEntity.ok(totalClicks);
    }
}
