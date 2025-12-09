package com.example.hotelmanager.repository;

import com.example.hotelmanager.model.Zimmer;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ZimmerRepository extends JpaRepository<Zimmer, Long> {

    boolean existsByZimmerID(long zimmerID);
    Optional<Zimmer> findByZimmerID(Integer zimmerID);
}
