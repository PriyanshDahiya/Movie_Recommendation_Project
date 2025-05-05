package com.example.api.repository;

import com.example.api.entity.Entry;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface EntryRepository extends MongoRepository<Entry,String> {
}
