import { useEffect, useState } from "react";
import "./App.css";

interface Zimmer {
  zimmerID: number;
  groesse: "Einzelzimmer" | "Doppelzimmer" | "Suite";
  minibar: boolean;
  belegt: boolean;
}

export default function App() {
  const [zimmerListe, setZimmerListe] = useState<Zimmer[]>([]);
  const [selected, setSelected] = useState<Zimmer | null>(null);
  const [popupPurpose, setPopupPurpose] = useState<"new" | "change" | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [sortKey, setSortKey] = useState<"zimmerID" | "belegt">("zimmerID");
  const [sortAsc, setSortAsc] = useState(true);
  const [editValues, setEditValues] = useState<Zimmer>({
    zimmerID: 1,
    groesse: "Einzelzimmer",
    minibar: false,
    belegt: false,
  });

  useEffect(() => {
    fetch("http://localhost:8080/api/zimmer")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Server returned " + res.status);
        }
        return res.json();
      })
      .then((data) => setZimmerListe(data))
      .catch((err) => {
        console.error("Fehler beim Laden:", err);
        setZimmerListe([]); // UI bleibt stabil, kein Crash
      });
  }, []);

  useEffect(() => {
    console.log("editValues geändert:", editValues);
  }, [editValues]);

  const openPopup = (purpose: "new" | "change", zimmer?: Zimmer) => {
    console.log(zimmer);
    if (zimmer) {
      // Werte des ausgewählten Zimmers übernehmen
      setEditValues({
        ...zimmer,
          groesse: (zimmer.groesse.charAt(0).toUpperCase() + zimmer.groesse.slice(1).toLowerCase()) as Zimmer["groesse"],
      });
      setPopupPurpose(purpose);
    } else {
      // Neue Zimmer-Daten vorbereiten
      setEditValues({ zimmerID: 1, groesse: "Einzelzimmer", minibar: false, belegt: false });
      setPopupPurpose(purpose);
    }
    setShowPopup(true);
  };

  // Sortierte Liste vorbereiten
  const sortedZimmerListe = [...zimmerListe].sort((a, b) => {
    if (sortKey === "zimmerID") {
      return sortAsc ? a.zimmerID - b.zimmerID : b.zimmerID - a.zimmerID;
    } else {
      // Belegt: false < true
      return sortAsc ? Number(a.belegt) - Number(b.belegt) : Number(b.belegt) - Number(a.belegt);
    }
  });

  const clear = () => {
    setShowPopup(false);
    setPopupPurpose(null);
  }

  const handleCreate = (neuesZimmer: Zimmer) => {

    if (neuesZimmer.zimmerID <= 0) {
      alert("Zimmernummer muss größer als 0 sein.");
      return;
    }

    if (!neuesZimmer.groesse) {
      alert("Keine Zimmergröße ausgewählt.");
      return;
    }

    // API-Aufruf zum Erstellen (optional)
    fetch("http://localhost:8080/api/zimmer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(neuesZimmer),
    })
      .then(async (res) => {
        if (!res.ok){
          const errorText = await res.text();
      
          let message = errorText;
          try {
            const json = JSON.parse(errorText);
            message = `${json.status} ${json.error}`;
          } catch {
            throw new Error(errorText || "Unbekannter Fehler");
          }
          throw new Error(message);
        }
        return res.json();
      })
      .then((data: Zimmer) => {
        // Lokaler State wird sofort aktualisiert
        setZimmerListe((prev) => [...prev, data]);
        setSelected(data);

        // Successmessage 
        setSuccessMessage(`Zimmer ${data.zimmerID} erfolgreich angelegt!`);
        setTimeout(() => setSuccessMessage(null), 4000); // nach 4 Sekunden ausblenden
        clear();
      })
      .catch(err => {
        console.log("err: "+err);
        if((err as Error).message.includes("400")){
          alert(err + "\nZimmernr. " + neuesZimmer.zimmerID + " existiert bereits!");
          clear();
        } else {
          alert(err);
          clear();
        }
      });
  };

  const handleUpdate = () => {
    if (!selected) return;

    // Prüfe Änderungen
    const changes: string[] = [];
    if (selected.groesse.toLowerCase() !== editValues.groesse.toLowerCase()) changes.push(`Größe: ${selected.groesse} → ${editValues.groesse}`);
    if (selected.minibar !== editValues.minibar) changes.push(`Minibar: ${selected.minibar ? "Ja" : "Nein"} → ${editValues.minibar ? "Ja" : "Nein"}`);
    if (selected.belegt !== editValues.belegt) changes.push(`Belegt: ${selected.belegt ? "Ja" : "Nein"} → ${editValues.belegt ? "Ja" : "Nein"}`);

    if (changes.length === 0) {
      alert("Keine Änderungen vorgenommen.");
      return;
    }

    // **Zuerst** confirm aufrufen
    const confirmed = window.confirm(
      `Willst du die folgenden Änderungen für Zimmernr. ${selected.zimmerID} wirklich speichern?\n\n${changes.join("\n")}`
    );

    // Nur wenn bestätigt, dann speichern und Popup schließen
    if (confirmed) {
      // API-Aufruf zum Erstellen (optional)
      fetch("http://localhost:8080/api/zimmer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editValues),
      })
        .then(async (res) => {
          if (!res.ok){
            const errorText = await res.text();
        
            let message = errorText;
            try {
              const json = JSON.parse(errorText);
              message = `${json.status} ${json.error}`;
            } catch {
              throw new Error(errorText || "Unbekannter Fehler");
            }
            throw new Error(message);
          }
          return res.json();
        })
        .then((updated: Zimmer) => {
          setZimmerListe((prev) =>
            prev.map((z) =>
              z.zimmerID === updated.zimmerID ? updated : z
            )
          );
          setSelected(updated);

          // Successmessage 
          setSuccessMessage(`Zimmer ${updated.zimmerID} erfolgreich gespeichert!`);
          setTimeout(() => setSuccessMessage(null), 4000); // nach 4 Sekunden ausblenden

          clear();
        })
        .catch(err => {
          console.log("err: "+err);
          if((err as Error).message.includes("400")){
            alert(err + "\nZimmernr. " + editValues.zimmerID + " existiert bereits!");
            clear();
          } else {
            alert(err);
            clear();
          }
        });
    }
  };

  const handleDelete = (zimmer: Zimmer) => {
    if (!zimmer) return;

    // **Zuerst** confirm aufrufen
    const confirmed = window.confirm(
      `Willst du das Zimmer ${zimmer.zimmerID} wirklich löschen?`
    );

    if (!confirmed) return;

    // API-Aufruf zum Löschen
    fetch(`http://localhost:8080/api/zimmer/${zimmer.zimmerID}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Fehler beim Löschen");
        // Seite neu laden, um die aktuelle Liste zu holen
        window.location.reload();
      })
      .catch((err) => {
        console.error(err);
        alert("Fehler beim Löschen des Zimmers.");
      });
    
    clear();
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <header style={{ textAlign: "center", padding: "20px", background: "#000", color: "white", fontSize: "2rem", fontWeight: "bold" }}>
        Hotelmanager
      </header>

      <div style={{ display: "flex", flex: 1 }}>
        {/* LEFT TABLE */}
        <div style={{ width: "35%", borderRight: "2px solid #ddd", background: "#fafafa", padding: "20px", display: "flex", flexDirection: "column" }}>
          <h2>Zimmer</h2>
          <div style={{ height: "50%", overflowY: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th
                    style={{ borderBottom: "2px solid #ccc", padding: "10px", cursor: "pointer" }}
                    onClick={() => {
                      if (sortKey === "zimmerID") setSortAsc(!sortAsc);
                      else {
                        setSortKey("zimmerID");
                        setSortAsc(true);
                      }
                    }}
                  >
                    Zimmernummer {sortKey === "zimmerID" ? (sortAsc ? "↑" : "↓") : ""}
                  </th>
                  <th
                    style={{ borderBottom: "2px solid #ccc", padding: "10px", cursor: "pointer" }}
                    onClick={() => {
                      if (sortKey === "belegt") setSortAsc(!sortAsc);
                      else {
                        setSortKey("belegt");
                        setSortAsc(true);
                      }
                    }}
                  >
                    Belegt {sortKey === "belegt" ? (sortAsc ? "↑" : "↓") : ""}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedZimmerListe.map((z) => (
                  <tr
                    key={z.zimmerID}
                    onClick={() => setSelected(z)}
                    style={{ cursor: "pointer", background: selected?.zimmerID === z.zimmerID ? "#d0e1ff" : "white" }}
                  >
                    <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>{z.zimmerID}</td>
                    <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>{z.belegt ? "Ja" : "Nein"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: "20px", display: "flex", gap: "20px" }}>
            <button style={{ border: "1px solid black" }} onClick={() => openPopup("new")}>Neu</button>
            <button style={{ border: "1px solid black" }} onClick={() => selected ? handleDelete(selected) : alert("Kein Eintrag ausgewählt")}>Löschen</button>
          </div>
        </div>

        {/* DETAIL VIEW */}
        <div style={{ flex: 1, padding: "20px" }}>
          <h2>Zimmerdetails</h2>
          {!selected && <p>Bitte ein Zimmer auswählen.</p>}
          {selected && (
            <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "10px", background: "white", maxWidth: "400px" }}>
              <p><strong>Zimmernummer:</strong> {selected.zimmerID}</p>
              <p><strong>Größe:</strong> {selected.groesse}</p>
              <p><strong>Minibar:</strong> {selected.minibar ? "Ja" : "Nein"}</p>
              <p><strong>Belegt:</strong> {selected.belegt ? "Ja" : "Nein"}</p>
              <button style={{ border: "1px solid black", marginTop: "10px" }} onClick={() => openPopup("change", selected)}>Bearbeiten</button>
            </div>
          )}
        </div>
      </div>

      {/* POPUP */}
      {showPopup && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center"
        }}>
          <div style={{ background: "white", padding: "20px", borderRadius: "10px", minWidth: "300px" }}>
            <h3>{selected ? "Bearbeiten" : "Neu"}</h3>

            <div style={{ marginBottom: "10px" }}>
              {popupPurpose === "change" && selected ? (
                <p><strong>Zimmernummer:</strong> {selected.zimmerID}</p>
              ) : (
                <>
                  <label>Zimmernummer: </label>
                  <input
                    type="number"
                    min={1}
                    value={editValues.zimmerID}
                    onChange={(e) => setEditValues({ ...editValues, zimmerID: Number(e.target.value) })}
                  />
                </>
              )}
            </div>

            <div style={{ marginBottom: "10px" }}>
              <label>Größe: </label>
              <div style={{ display: "flex", gap: "10px" }}>
                {["Einzelzimmer", "Doppelzimmer", "Suite"].map((g) => {
                  console.log("Render Radiobutton:", g, "aktuell ausgewählt:", editValues.groesse);
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => {
                        console.log("Button geklickt:", g);
                        setEditValues({ ...editValues, groesse: g as Zimmer["groesse"] });
                      }}
                      style={{
                        padding: "6px 12px",
                        border: editValues.groesse === g ? "2px solid #000" : "1px solid #ccc",
                        background: editValues.groesse === g ? "#d0e1ff" : "#fff",
                        cursor: "pointer",
                      }}
                    >
                      {g}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ marginBottom: "10px" }}>
              <label>
                <input
                  type="checkbox"
                  checked={editValues.minibar}
                  onChange={(e) => setEditValues({ ...editValues, minibar: e.target.checked })}
                /> Minibar
              </label>
            </div>

            <div style={{ marginBottom: "10px" }}>
              <label>
                <input
                  type="checkbox"
                  checked={editValues.belegt}
                  onChange={(e) => setEditValues({ ...editValues, belegt: e.target.checked })}
                /> Belegt
              </label>
            </div>

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button style={{ border: "1px solid black" }} onClick={() => setShowPopup(false)}>Abbrechen</button>
              <button style={{ border: "1px solid black" }} onClick={() => popupPurpose === "new" ? handleCreate(editValues) : handleUpdate()}>Speichern</button>
            </div>
          </div>
        </div>
      )}

      {successMessage && (
        <div style={{
          position: "fixed",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "#4BB543",
          color: "white",
          padding: "10px 20px",
          borderRadius: "5px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          zIndex: 1000,
        }}>
          {successMessage}
        </div>
      )}
    </div>
  );
}
