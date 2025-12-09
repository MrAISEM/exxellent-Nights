package com.example.hotelmanager.controller;

import com.example.hotelmanager.model.Zimmer;
import com.example.hotelmanager.service.ZimmerService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/zimmer")
@CrossOrigin(origins = "http://localhost:5173")
public class ZimmerController {

    private final ZimmerService service;

    public ZimmerController(ZimmerService service) {
        this.service = service;
    }

    @GetMapping
    public List<Zimmer> getAll() {
        return service.findAll();
    }

    @PostMapping
    public Zimmer create(@RequestBody Zimmer zimmer) {
        return service.create(zimmer);
    }

    @PutMapping()
    public Zimmer update(@RequestBody Zimmer zimmer) {
        return service.update(zimmer);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") Long zimmerID) {
        service.delete(zimmerID);
        return ResponseEntity.noContent().build();
    }
}
