package com.url.shrotener.service;

import com.url.shrotener.dto.ClickEventDto;
import com.url.shrotener.dto.UrlMappingDto;
import com.url.shrotener.exception.ResourceNotFoundException;
import com.url.shrotener.mapper.UrlMappingMapper;
import com.url.shrotener.model.ClickEvent;
import com.url.shrotener.model.UrlMapping;
import com.url.shrotener.model.User;
import com.url.shrotener.repository.ClickEventRepository;
import com.url.shrotener.repository.UrlMappingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UrlMappingService {

    private final UrlMappingRepository urlMappingRepository;
    private final UrlMappingMapper urlMappingMapper;
    private final ClickEventRepository clickEventRepository;

    // Creates a short URL and associates it with the logged-in user.
    public UrlMappingDto createShortUrl(String originalUrl, User user) {

        String shortUrl = generateShortUrl();

        UrlMapping urlMapping = new UrlMapping();
        urlMapping.setOriginalUrl(originalUrl);
        urlMapping.setShortUrl(shortUrl);
        urlMapping.setUser(user);
        urlMapping.setCreatedAt(LocalDateTime.now(ZoneId.systemDefault()));

        UrlMapping savedUrlMapping = urlMappingRepository.save(urlMapping);

        return urlMappingMapper.convertToDto(savedUrlMapping);
    }

    // Generates an 8-character random short URL.
    private String generateShortUrl() {

        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder shortUrl = new StringBuilder(8);

        for (int i = 0; i < 8; i++) {
            int index = ThreadLocalRandom.current().nextInt(characters.length());
            shortUrl.append(characters.charAt(index));
        }

        return shortUrl.toString();
    }

    // Retrieves all short URLs created by a specific user.
    public List<UrlMappingDto> getUrlsByUser(User user) {

        return urlMappingRepository.findByUser(user).stream()
                .map(urlMappingMapper::convertToDto)
                .toList();
    }

    // Retrieves click events for a short URL within the given date range.
    public List<ClickEventDto> getClickEventsByDate(
            String shortUrl, LocalDate startTime, LocalDate endDate) {

        validateDateRange(startTime, endDate);

        UrlMapping urlMapping = urlMappingRepository.findByShortUrl(shortUrl)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Short url not found: " + shortUrl)
                );

        // Fetches click events from the start date to the end date.
        List<ClickEvent> clickEvents =
                clickEventRepository.findByUrlMappingAndClickDateBetween(
                        urlMapping,
                        startTime.atStartOfDay(),
                        endDate.atTime(LocalTime.MAX)
                );

        // Groups click events by date and counts the clicks for each day.
        return clickEvents.stream()
                .collect(Collectors.groupingBy(
                        click -> click.getClickDate().toLocalDate(),
                        Collectors.counting()
                ))
                .entrySet().stream()
                .map(entry -> {
                    ClickEventDto clickEventDto = new ClickEventDto();
                    clickEventDto.setDate(entry.getKey());
                    clickEventDto.setClicks(entry.getValue());
                    return clickEventDto;
                })
                .toList();
    }

    // Retrieves the total daily clicks across all URLs belonging to a user.
    public List<ClickEventDto> getTotalClickEventsByUserAndDate(
            User user, LocalDate startDate, LocalDate endDate) {

        validateDateRange(startDate, endDate);

        List<UrlMapping> urlMappings = urlMappingRepository.findByUser(user);

        // Fetches click events for all the user's URLs within the date range.
        List<ClickEvent> clickEvents =
                clickEventRepository.findByUrlMappingInAndClickDateBetween(
                        urlMappings,
                        startDate.atStartOfDay(),
                        endDate.atTime(LocalTime.MAX)
                );

        // Groups click events by date and calculates the daily click count.
        Map<LocalDate, Long> clickByDate = clickEvents.stream()
                .collect(Collectors.groupingBy(
                        click -> click.getClickDate().toLocalDate(),
                        Collectors.counting()
                ));

        // Includes dates with zero clicks so the analytics chart has continuous dates.
        List<ClickEventDto> dailyClicks = new ArrayList<>();
        LocalDate currentDate = startDate;

        while (!currentDate.isAfter(endDate)) {
            dailyClicks.add(
                    new ClickEventDto(
                            currentDate,
                            clickByDate.getOrDefault(currentDate, 0L)
                    )
            );

            currentDate = currentDate.plusDays(1);
        }

        return dailyClicks;
    }

    // Validates that the date range is provided and the start date is not after the end date.
    private void validateDateRange(LocalDate startDate, LocalDate endDate) {

        if (startDate == null || endDate == null || startDate.isAfter(endDate)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid date range"
            );
        }
    }

    // Finds the original URL, increments its click count, and records the click event.
    @Transactional
    public UrlMapping processRedirect(String shortUrl) {

        UrlMapping urlMapping = urlMappingRepository.findByShortUrl(shortUrl)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Short url not found: " + shortUrl)
                );

        // Updates the total number of clicks for this short URL.
        urlMapping.setClickCount(urlMapping.getClickCount() + 1);
        urlMappingRepository.save(urlMapping);

        // Saves an individual click event for analytics.
        ClickEvent clickEvent = new ClickEvent();
        clickEvent.setClickDate(LocalDateTime.now(ZoneId.systemDefault()));
        clickEvent.setUrlMapping(urlMapping);

        clickEventRepository.save(clickEvent);

        return urlMapping;
    }

    // Retrieves a URL only if it belongs to the specified user.
    public UrlMappingDto getUrlByIdAndUser(Long id, User user) {

        UrlMapping urlMapping = urlMappingRepository
                .findByIdAndUser(id, user)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Short URL not found"
                        )
                );

        return urlMappingMapper.convertToDto(urlMapping);
    }
}