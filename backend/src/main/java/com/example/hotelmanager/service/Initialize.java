package com.example.hotelmanager.service;

import com.example.hotelmanager.model.Zimmer;
import com.example.hotelmanager.model.ZimmerGroesse;
import com.example.hotelmanager.repository.ZimmerRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class Initialize implements CommandLineRunner {

    private final ZimmerRepository zimmerRepository;

    // Repository über Konstruktor injizieren
    public Initialize(ZimmerRepository zimmerRepository) {
        this.zimmerRepository = zimmerRepository;
    }

    // Methode läuft automatisch beim Start
    @Override
    public void run(String... args) throws Exception {
        // Nur hinzufügen, wenn Tabelle leer ist
        if (zimmerRepository.count() == 0) {
            zimmerRepository.save(new Zimmer(101, ZimmerGroesse.DOPPELZIMMER, true, false));   // Doppelzimmer mit Minibar nicht belegt
            zimmerRepository.save(new Zimmer(102 ,ZimmerGroesse.EINZELZIMMER, true, false));   // Einzelzimmer mit Minibar nicht belegt
            zimmerRepository.save(new Zimmer(201, ZimmerGroesse.SUITE, false, false));         // Suite ohne Minibar nicht belegt
        }
    }
}
