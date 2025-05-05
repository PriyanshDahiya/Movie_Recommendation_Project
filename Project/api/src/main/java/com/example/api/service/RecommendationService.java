package com.example.api.service;

import com.example.api.entity.Movie;
import com.example.api.entity.User;
import com.example.api.repository.MovieRepository;
import com.example.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    private static final Logger logger = LoggerFactory.getLogger(RecommendationService.class);

    @Autowired
    private MovieRepository movieRepository;

    
    @Autowired
    private UserRepository userRepository;

    public List<Movie> recommendMovies(String username, int k) {
        // Fetch user from database
        User user = userRepository.findByUsername(username);
        if (user == null || user.getLikedMovieIds() == null || user.getLikedMovieIds().isEmpty()) {
            logger.warn("User {} has no liked movies or the liked movies list is empty.", username);
            return Collections.emptyList();
        }

        // Fetch all movies from the database
        List<Movie> allMovies = movieRepository.findAll();
        if (allMovies.isEmpty()) {
            logger.warn("No movies found in the database.");
            return Collections.emptyList();
        }

        // Filter liked movies
        List<Movie> likedMovies = allMovies.stream()
                .filter(m -> user.getLikedMovieIds().contains(m.getId()))
                .collect(Collectors.toList());

        if (likedMovies.isEmpty()) {
            logger.warn("User {} has no liked movies in the database.", username);
            return Collections.emptyList();
        }

        // Filter candidate movies (movies not liked by the user)
        List<Movie> candidates = allMovies.stream()
                .filter(m -> !user.getLikedMovieIds().contains(m.getId()))
                .collect(Collectors.toList());

        if (candidates.isEmpty()) {
            logger.warn("No candidate movies available for recommendations for user {}", username);
            return Collections.emptyList();
        }

        // Calculate similarity scores for each candidate movie
        Map<Movie, Double> similarityMap = new HashMap<>();
        for (Movie candidate : candidates) {
            double totalSim = 0;
            for (Movie liked : likedMovies) {
                totalSim += calculateSimilarity(candidate, liked);
            }
            similarityMap.put(candidate, totalSim / likedMovies.size());
        }

        // Sort movies by similarity score and return top k recommendations
        return similarityMap.entrySet().stream()
                .sorted((a, b) -> Double.compare(b.getValue(), a.getValue())) // Sort descending by similarity score
                .limit(k) // Get the top k recommended movies
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
    }

    // Similarity calculation using Jaccard similarity for genres and other features
    private double calculateSimilarity(Movie a, Movie b) {
        double score = 0;

        // Genre similarity using Jaccard similarity
        Set<String> genresA = (a.getGenres() != null) ? new HashSet<>(a.getGenres()) : new HashSet<>();
        Set<String> genresB = (b.getGenres() != null) ? new HashSet<>(b.getGenres()) : new HashSet<>();

        Set<String> intersection = new HashSet<>(genresA);
        intersection.retainAll(genresB);

        Set<String> union = new HashSet<>(genresA);
        union.addAll(genresB);

        double genreSimilarity = union.isEmpty() ? 0 : (double) intersection.size() / union.size();
        score += genreSimilarity * 5; // weight 5 for genre similarity

        // Director match (weight 1)
        if (a.getDirector() != null && b.getDirector() != null &&
                a.getDirector().equalsIgnoreCase(b.getDirector())) {
            score += 1;
        }

        // Release Year proximity (weight 1)
        if (a.getReleaseYear() == b.getReleaseYear()) {
            score += 1;
        } else {
            score += 1.0 / (1 + Math.abs(a.getReleaseYear() - b.getReleaseYear()));
        }

        // Rating difference (weight 1)
        double ratingDifference = Math.abs(a.getRating() - b.getRating());
        if (ratingDifference == 0) {
            score += 1;
        } else {
            score += 1.0 / (1 + ratingDifference);
        }

        // Normalize score to be between 0 and 1
        double maxScore = 5 + 1 + 1 + 1; // max weight total = 8
        return score / maxScore;
    }
}