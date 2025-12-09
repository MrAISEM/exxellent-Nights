package com.example.hotelmanager.model;

import jakarta.persistence.*;

@Entity
@Table(name = "hotelzimmer")
public class Zimmer {

    @Id
    private Integer zimmerID;

    @Enumerated(EnumType.STRING)
    private ZimmerGroesse groesse;

    private boolean minibar;

    private boolean belegt;

    protected Zimmer(){}

    public Zimmer(Integer zimmerID, ZimmerGroesse groesse, boolean minibar, boolean belegt) {
        this.zimmerID = zimmerID;
        this.groesse = groesse;
        this.minibar = minibar;
        this.belegt = belegt;
    }

    // Getter & Setter
    public Integer getZimmerID() { return zimmerID; }
    public void setZimmerID(Integer zimmerID) { this.zimmerID = zimmerID; }

    public ZimmerGroesse getGroesse() { return groesse; }
    public void setGroesse(ZimmerGroesse groesse) { this.groesse = groesse; }

    public boolean isMinibar() { return minibar; }
    public void setMinibar(boolean minibar) { this.minibar = minibar; }

    public boolean isBelegt() { return belegt; }
    public void setBelegt(boolean belegt) { this.belegt = belegt; }

}
