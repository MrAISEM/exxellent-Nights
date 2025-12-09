DOKUMENTATION:

Ich habe mich für Spring Boot, React & Postgresql entschieden, da ich diese Technologien aktuell sehr gut behersche.

Ich wusste zu Beginn, dass ich eine Tabelle haben möchte in der die Zimmernr. und der belegt status zu sehen sind.
Während der Entwicklung des Frontends habe ich entschieden das Layout in grobe spalten aufteilen möchte. Die erste
Spalte sollte die Tabelle mit den Zimmern anzeigen und die Funktionen "Neu" und "Löschen" beinhalten. In der zweiten Spalte
sollten dann die Informationen über das zimmer stehen. Zuerst dachte ich an eine dritte Spalte für die Bearbeitung des ausgewählten 
Zimmers. Allerdings war dies unübersichtlich und nicht schön. Es wurde dann ein kleineres Popup-Fenster in welchen die 
Zimmerdaten angepasst werden können.
Bei der einrichtung der Datenbank habe ich entschieden direkt noch eine Eigenschaft hinzuzufügen. Die "Belegt"-Spalte 
ist ein boolean und zeigt mit true/false an ob das Zimmer belegt ist also ähnlich wie die Minibar. 
Grundsaätzlich ist die Zimmernummer der Primärschlüssel und als int deklariert. Die Zimmergröße ist als
ENUM('EINZELZIMMER','DOPPELZIMMER','SUITE') deklariert, welchen man im nachhinein erweitern kann Falls andere Zimmertypen folgen.

In SpringBoot habe ich mich für die typischen GET/POST/PUT/DELETE Funktionen entschieden, da diese perfekt für den anwendungsfall passen.
Get: gibt alle Einträge(Zimmer) aus der DB
POST: schreibt neuer Eintrag(Zimmer) in die DB
PUT: verändert ein Zimmer(Größe, Minibar, Belegt)
DELETE: löscht ein Eintrag(Zimmer)