package com.example.api.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String username;
    private String email;
    private String password;

    // ⭐ Field for storing liked movie IDs
    private List<String> likedMovieIds = new ArrayList<>();

    public User() {}

    public User(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.likedMovieIds = new ArrayList<>();
    }

    // ⭐ Getter & Setter
    public List<String> getLikedMovieIds() {
        return likedMovieIds;
    }

    public void setLikedMovieIds(List<String> likedMovieIds) {
        this.likedMovieIds = likedMovieIds;
    }

    public void likeMovie(String movieId) {
        if (!likedMovieIds.contains(movieId)) {
            likedMovieIds.add(movieId);
        }
    }

    public void unlikeMovie(String movieId) {
        likedMovieIds.remove(movieId);
    }

    // ⭐ Other Getters & Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
