package com.example.api.service;

import com.example.api.entity.Entry;
import com.example.api.repository.EntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EntryService {

    @Autowired
    private EntryRepository entryRepository;

    public void saveEntry(Entry entry) {
        entryRepository.save(entry);
    }
}
