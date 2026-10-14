package com.url.shrotener.repository;

import com.url.shrotener.model.UrlMapping;
import com.url.shrotener.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UrlMappingRepository extends JpaRepository<UrlMapping, Long> {
    UrlMapping findByShortUrl(String shortUrl);
    List<UrlMapping> findByUser(User user);
    Optional<UrlMapping> findByIdAndUser(Long id, User user);
}
