package com.example.api.controller;

import com.example.api.entity.Movie;
import com.example.api.entity.User;
import com.example.api.repository.MovieRepository;
import com.example.api.repository.UserRepository;
import com.example.api.service.UserService;
import com.example.api.service.RecommendationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;

@CrossOrigin
@RestController
@RequestMapping("/auth")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private RecommendationService recommendationService;

    // ✅ Register new user
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> registerUser(@RequestBody User user) {
        Map<String, String> response = new HashMap<>();
        boolean success = userService.registerUser(user);
        if (success) {
            logger.info("User {} registered successfully", user.getUsername());
            response.put("message", "User registered successfully!");
            return ResponseEntity.ok(response);
        } else {
            logger.warn("User {} registration failed. Username or email already exists.", user.getUsername());
            response.put("message", "Username or email already exists.");
            return ResponseEntity.badRequest().body(response);
        }
    }

    // ✅ Login user
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> loginUser(@RequestBody Map<String, String> loginRequest) {
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");
        Map<String, String> response = new HashMap<>();

        User user = userRepository.findByUsername(username);

        if (user == null) {
            logger.warn("Login failed. User {} not found.", username);
            response.put("message", "User not found.");
            return ResponseEntity.status(404).body(response);
        }

        if (user.getPassword().equals(password)) {
            logger.info("User {} logged in successfully", username);
            response.put("message", "Login successful!");
            return ResponseEntity.ok(response);
        } else {
            logger.warn("Login failed. Incorrect password for user {}", username);
            response.put("message", "Incorrect password.");
            return ResponseEntity.status(401).body(response);
        }
    }

    // ✅ Like a movie
    @PostMapping("/like")
    public ResponseEntity<String> likeMovie(@RequestParam String username, @RequestParam String movieId) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            logger.error("User {} not found", username);
            return ResponseEntity.badRequest().body("User not found.");
        }

        Optional<Movie> movie = movieRepository.findById(movieId);
        if (movie.isEmpty()) {
            logger.error("Movie with ID {} not found", movieId);
            return ResponseEntity.badRequest().body("Movie not found.");
        }

        List<String> likedMovieIds = user.getLikedMovieIds();
        if (likedMovieIds == null) {
            likedMovieIds = new ArrayList<>();
        }

        if (!likedMovieIds.contains(movieId)) {
            likedMovieIds.add(movieId);
            user.setLikedMovieIds(likedMovieIds);
            userRepository.save(user);
            logger.info("User {} liked movie {}", username, movie.get().getTitle());
            return ResponseEntity.ok("Movie liked!");
        } else {
            logger.info("User {} already liked movie {}", username, movie.get().getTitle());
            return ResponseEntity.ok("Movie already liked!");
        }
    }

    // ✅ Get all liked movies
    @GetMapping("/liked")
    public ResponseEntity<List<Movie>> getLikedMovies(@RequestParam String username) {
        User user = userRepository.findByUsername(username);
        if (user == null || user.getLikedMovieIds() == null || user.getLikedMovieIds().isEmpty()) {
            logger.warn("User {} has not liked any movies", username);
            return ResponseEntity.ok(Collections.emptyList());
        }

        List<Movie> likedMovies = movieRepository.findAllById(user.getLikedMovieIds());
        return ResponseEntity.ok(likedMovies);
    }

    // ✅ Movie recommendations
    @GetMapping("/recommendations/{username}")
    public ResponseEntity<List<Movie>> getRecommendations(@PathVariable String username, @RequestParam(value = "k", defaultValue = "9") int k) {
        try {
            List<Movie> recommendedMovies = recommendationService.recommendMovies(username, k);
            if (recommendedMovies.isEmpty()) {
                logger.warn("No recommendations found for user {}", username);
                return ResponseEntity.ok(Collections.emptyList());
            }
            logger.info("Returning {} recommendations for user {}", recommendedMovies.size(), username);
            return ResponseEntity.ok(recommendedMovies);
        } catch (Exception e) {
            logger.error("Error getting recommendations for user {}: {}", username, e.getMessage(), e);
            return ResponseEntity.status(500).body(Collections.emptyList());
        }
    }
}
