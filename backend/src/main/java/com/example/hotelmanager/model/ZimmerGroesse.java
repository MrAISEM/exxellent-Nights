package com.example.hotelmanager.model;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum ZimmerGroesse {
    EINZELZIMMER,
    DOPPELZIMMER,
    SUITE;

    // Akzeptiere jeden Input, egal wie geschrieben
    @JsonCreator
    public static ZimmerGroesse fromString(String value) {
        return ZimmerGroesse.valueOf(value.toUpperCase());
    }
}