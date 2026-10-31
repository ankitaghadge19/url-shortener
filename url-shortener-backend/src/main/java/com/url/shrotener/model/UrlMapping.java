package com.url.shrotener.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "url_mapping")
public class UrlMapping {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 2048)
    private String originalUrl;

    @Column(nullable = false, unique = true)
    private String shortUrl;

    // Stores the number of times this shortened URL has been clicked.
    @Column(nullable = false)
    private int clickCount = 0;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    // Each URL mapping belongs to one user.
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Allows access to all click events associated with this URL.
    @OneToMany(mappedBy = "urlMapping")
    private List<ClickEvent> clickEvents;
}