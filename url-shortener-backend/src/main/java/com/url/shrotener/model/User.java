package com.url.shrotener.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String email;
    private String username;
    private String password;
    private String role = "USER";

    // Optional: Not required for the database relationship.
    // Added only to access all URLs created by a user using user.getUrlMappings().
    @OneToMany(mappedBy = "user")
    private List<UrlMapping> urlMappings;
}
