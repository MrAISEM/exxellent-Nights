package com.example.hotelmanager.service;

import com.example.hotelmanager.model.ZimmerGroesse;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class ZimmerGroesseConverter implements AttributeConverter<ZimmerGroesse, String> {

    @Override
    public String convertToDatabaseColumn(ZimmerGroesse groesse) {
        if (groesse == null) return null;
        return groesse.name(); // Immer GROSS in DB
    }

    @Override
    public ZimmerGroesse convertToEntityAttribute(String value) {
        if (value == null) return null;
        return ZimmerGroesse.fromString(value);
    }
}
