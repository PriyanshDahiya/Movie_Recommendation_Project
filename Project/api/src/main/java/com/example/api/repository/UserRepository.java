package com.example.api.repository;

import com.example.api.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);

    User findByUsername(String username); // helpful for liking and recommending movies

    // find by email too if needed
    User findByEmail(String email);
}
