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
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UrlMappingService {
    private final UrlMappingRepository urlMappingRepository;
    private final UrlMappingMapper urlMappingMapper;
    private final ClickEventRepository clickEventRepository;

    public UrlMappingDto createShortUrl(String originalUrl, User user) {
        String shortUrl = generateShortUrl();
        UrlMapping urlMapping = new UrlMapping();
        urlMapping.setOriginalUrl(originalUrl);
        urlMapping.setShortUrl(shortUrl);
        urlMapping.setUser(user);
        urlMapping.setCreatedAt(LocalDateTime.now());
        UrlMapping savedUrlMapping = urlMappingRepository.save(urlMapping);
        return urlMappingMapper.convertToDto(savedUrlMapping);
    }

    private String generateShortUrl() {
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        Random random = new Random();
        StringBuilder shortUrl = new StringBuilder(8);
        for(int i=0; i<8; i++){
            shortUrl.append(characters.charAt(random.nextInt(characters.length())));
        }
        return shortUrl.toString();
    }

    public List<UrlMappingDto> getUrlsByUser(User user) {
        return urlMappingRepository.findByUser(user).stream()
                .map(urlMappingMapper::convertToDto)
                .toList();
    }

    public List<ClickEventDto> getClickEventsByDate(String shortUrl, LocalDate startTime, LocalDate endDate) {
        UrlMapping urlMapping  = urlMappingRepository.findByShortUrl(shortUrl);
        if(urlMapping == null){
            throw new ResourceNotFoundException("Short url not found: " + shortUrl);
        }
        List<ClickEvent> clickEvents = clickEventRepository.findByUrlMappingAndClickDateBetween(urlMapping, startTime.atStartOfDay(), endDate.atTime(LocalTime.MAX));
        return clickEvents.stream()
                .collect(Collectors.groupingBy(click -> click.getClickDate().toLocalDate(), Collectors.counting()))
                .entrySet().stream()
                .map(entry ->{
                    ClickEventDto clickEventDto = new ClickEventDto();
                    clickEventDto.setClickDate(entry.getKey());
                    clickEventDto.setCount(entry.getValue());
                    return clickEventDto;
                }).toList();
    }

    public Map<LocalDate, Long> getTotalClickEventsByUserAndDate(User user, LocalDate startDate, LocalDate endDate) {
        List<UrlMapping> urlMappings = urlMappingRepository.findByUser(user);
        List<ClickEvent> clickEvents = clickEventRepository.findByUrlMappingInAndClickDateBetween(
                urlMappings, startDate.atStartOfDay(), endDate.atTime(LocalTime.MAX));
        return clickEvents.stream()
                .collect(Collectors.groupingBy(click -> click.getClickDate().toLocalDate(), Collectors.counting()));
    }

//    1. Finds the original URL from the short URL
//    2. Increments the click count for short url
//    3. Creates a click event for short url
    public UrlMapping processRedirect(String shortUrl) {
        UrlMapping urlMapping = urlMappingRepository.findByShortUrl(shortUrl);
        if(urlMapping != null){
            // Increment the total click count for the short URL
            urlMapping.setClickCount(urlMapping.getClickCount() + 1);
            urlMappingRepository.save(urlMapping);

            // Store a click event
            ClickEvent clickEvent = new ClickEvent();
            clickEvent.setClickDate(LocalDateTime.now());
            clickEvent.setUrlMapping(urlMapping);
            clickEventRepository.save(clickEvent);
        }
        return urlMapping;
    }
}
