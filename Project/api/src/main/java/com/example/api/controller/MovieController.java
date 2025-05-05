package com.example.api.controller;

import com.example.api.entity.Movie;
import com.example.api.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
public class MovieController {

    @Autowired
    private MovieRepository movieRepository;

    // ✅ Add a new movie
    @PostMapping("/add")
    public Movie addMovie(@RequestBody Movie movie) {
        return movieRepository.save(movie);
    }

    // ✅ Get all movies
    @GetMapping("/all")
    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    // ✅ Add multiple movies at once (Bulk Insert)
    @PostMapping("/addBulk")
    public List<Movie> addBulkMovies(@RequestBody List<Movie> movies) {
        return movieRepository.saveAll(movies);  // Save all movies in the list
    }
}
