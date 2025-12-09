package com.example.hotelmanager.service;

import com.example.hotelmanager.model.Zimmer;
import com.example.hotelmanager.model.ZimmerDTO;
import com.example.hotelmanager.model.ZimmerGroesse;

public class ZimmerMapper {

    public static ZimmerDTO toDTO(Zimmer z) {
        ZimmerDTO dto = new ZimmerDTO();
        dto.zimmerID = z.getZimmerID();
        dto.minibar = z.isMinibar();
        dto.belegt = z.isBelegt();

        // ENUM → Schön formatiertes Wort
        String raw = z.getGroesse().name();  // EINZELZIMMER
        dto.groesse = raw.charAt(0) + raw.substring(1).toLowerCase();

        return dto;
    }

    public static Zimmer fromDTO(ZimmerDTO dto) {
        Zimmer z = new Zimmer(null, null, false, false);
        z.setZimmerID(dto.zimmerID);
        z.setMinibar(dto.minibar);
        z.setBelegt(dto.belegt);

        // String unabhängig vom Case → ENUM
        z.setGroesse(ZimmerGroesse.fromString(dto.groesse));

        return z;
    }
}
