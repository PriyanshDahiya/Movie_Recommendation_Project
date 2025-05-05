package com.example.api.controller;


import com.example.api.service.EntryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.api.entity.Entry;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/entry")
public class EntryControllerV2 {

    @Autowired
    private EntryService entryService;

    @GetMapping
    public List<Entry> getAll() {  // localhost:9090/entry GET
        return null;
    }

    @PostMapping
    public boolean createEntry(@RequestBody Entry myEntry) {  // localhost:9090/entry POST
        entryService.saveEntry(myEntry);
        return true;
    }
    @GetMapping("id/{myid}")
    public Entry getEntryById(@PathVariable Long myid){
        return null;
    }
    @DeleteMapping("id/{myid}")
    public Entry deleteEntryById(@PathVariable Long myid){
        return null;
    }
    @PutMapping("id/{id}")
    public Entry updateEntryById(@PathVariable Long id, @RequestBody Entry myEntry){
        return null;
    }
}
