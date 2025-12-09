package com.example.hotelmanager.service;

import com.example.hotelmanager.model.Zimmer;
import com.example.hotelmanager.repository.ZimmerRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ZimmerService {

    private final ZimmerRepository repo;

    public ZimmerService(ZimmerRepository repo) {
        this.repo = repo;
    }

    public List<Zimmer> findAll() {
        return repo.findAll();
    }

    public Zimmer findById(long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Zimmernr.(" + id + ") nicht gefunden"));
    }

    public Zimmer create(Zimmer zimmer) {
        // Check if zimmerID already exists
        if (repo.existsByZimmerID(zimmer.getZimmerID())) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, 
                "Zimmernr.(" + zimmer.getZimmerID() + ") existiert bereits!"
            );
        }

        //Save new created room
        return repo.save(zimmer);
    }

    public Zimmer update(Zimmer updated) {
        // Get room from DB
        Zimmer roomToBeUpdated = repo.findByZimmerID(updated.getZimmerID())
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Zimmernr.(" + updated.getZimmerID() + ") nicht gefunden!"
            ));

        // update room data
        roomToBeUpdated.setGroesse(updated.getGroesse());
        roomToBeUpdated.setBelegt(updated.isBelegt());
        roomToBeUpdated.setMinibar(updated.isMinibar());

        //Save the changed room data
        return repo.save(roomToBeUpdated);
    }

    public void delete(long id) {
        // Check if room is existing
        if (!repo.existsByZimmerID(id)) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND, 
                "Zimmernr.(" + id + ") nicht gefunden"
            );
        }
        repo.deleteById(id);
    }
}
