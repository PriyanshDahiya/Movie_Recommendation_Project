package com.example.api.controller;


import org.springframework.web.bind.annotation.*;
import com.example.api.entity.Entry;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/_entry")
public class EntryController {

    private Map<Long, Entry> Entries = new HashMap<>();


    @GetMapping
    public List<Entry> getAll() {  // localhost:9090/entry GET
        return new ArrayList<>(Entries.values());
    }

    @PostMapping
    public boolean createEntry(@RequestBody Entry myEntry) {  // localhost:9090/entry POST
        //Entries.put(myEntry.getId(), myEntry);
        return true;
    }
    @GetMapping("id/{myid}")
    public Entry getEntryById(@PathVariable Long myid){
        return Entries.get(myid);
    }
    @DeleteMapping("id/{myid}")
    public Entry deleteEntryById(@PathVariable Long myid){
        return Entries.remove(myid);
    }
    @PutMapping("id/{id}")
    public Entry updateEntryById(@PathVariable Long id, @RequestBody Entry myEntry){
        return Entries.put(id, myEntry);
    }
}
