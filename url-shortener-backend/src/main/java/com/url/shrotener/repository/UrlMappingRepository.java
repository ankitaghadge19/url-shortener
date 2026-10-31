package com.url.shrotener.repository;

import com.url.shrotener.model.UrlMapping;
import com.url.shrotener.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UrlMappingRepository extends JpaRepository<UrlMapping, Long> {

    // Finds a URL mapping by its short URL.
    Optional<UrlMapping> findByShortUrl(String shortUrl);

    // Retrieves all URL mappings created by a specific user.
    List<UrlMapping> findByUser(User user);

    // Finds a URL mapping only if it belongs to the given user.
    Optional<UrlMapping> findByIdAndUser(Long id, User user);
}