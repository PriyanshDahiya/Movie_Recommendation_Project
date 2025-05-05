package com.example.api.repository;

import com.example.api.entity.Movie;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MovieRepository extends MongoRepository<Movie, String> {
    // You can add custom query methods here if needed
}
