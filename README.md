MME_Blob2D_Puzzle_Plattformer
=============================

A simple browser puzzle-game

##Überblick
###1. Starten des Spiels
###2. Darlegen der Fähigkeiten
####2.1 Helicopter
####2.2 Sphere
####2.3 Bridge
####2.4 Slingshot
####2.5 Teleport
####2.6 Trampolin
####2.7 Stretching
###3. Steuerung
###4. Technische Details
####4.1 Engines
####4.2 Verwendete Patterns



###1. Starten des Spiels

Um mit dem Spiel loslegen zu können, muss einfach die index.html-Datei im Projektordner mit dem Google Chrome Browser geöffnet werden.

###2. Darlegen der Spezialfähigkeiten
####2.1 Helicopter
Treten die Blobs gemeinsam in einen Tornado, können sie sich entscheiden, ob sie sich zum Helicopter vereinen und rumfliegen wollen. Um so einen Helicopter zu steuern, benötigt es zwei Personen und Absprache, da nur einer entweder die Höhe oder die Richtung vorgibt. Natürlich kann der Helicopter auch wieder in seine Einzelteile zerlegt werden, wenn dieser in ??? landet und sich nicht mehr bewegt.
####2.2 Sphere
Befinden sich die Blobs auf/in ??? verputzt der rote Blob kurzerhand den grünen Blob, um eine Kugel zu bilden. Die ist so massiv, dass ihr sogar Stacheln nichts anhaben und Knöpfe durch bloßes darüberrollen einfach platt gewalzt werden. Wird dies einen der Blobs zu bunt, kann er jederzeit die Kugel auflösen.
####2.3 Bridge
Ein Pfahl und zwei Blobs ergeben ein windiges, brückenähnliches Gebilde, dass immerhin reicht um Schluchten, Löcher oder sonstige Abgründe gemeinsam zu überqueren. Dabei können sich die Blobs entscheiden auf welcher Seite sie hochklettern möchten, sofern sie sich auf links oder rechts einigen können.
####2.4 Slingshot
Wenn zwei Bäume verdächtig nahe beieinander stehen, heißt das garantiert, dass man hier den grünen Blob per Luftpost verschicken kann. Entscheiden sich die Blobs eine Slingshot zu bilden, hängt sich der rote Blob zwischen die Bäume und der grüne Blob spannt sich dann ein und wird herauskatapultiert. Dabei müssen beide zusammenarbeiten, damit Abschusswinkel und -stärke ausreichen, um mögliche Landungen in Stacheln zu vermeiden.
####2.5 Teleport
Alte Steingebilde vermögen es die Standorte der Blobs zu vertauschen. Deren Ursprung ist unbekannt. Deren Funktionsweise ist unbekannt. Sie beamen lediglich Blobs durch die Gegend.
####2.6 Trampolin
Obwohl der rote Blob sowieso am höchsten springt, reicht ihm das nicht und deswegen kann der grüne Blob sich in ein Trampolin verwandeln. Allerdings nur, wenn der grüne Blob das auch will und sich sonst nichts in der Nähe befindet. Also sollte der rote Blob ein wenig aufpassen, nicht dass das Trampolin auf einmal fehlt und er stattdessen in Stacheln rutscht.
####2.7 Stretching
Als Ausgleich kann der rote Blob sich zu doppelter Größe strecken. Damit der grüne auch mal hoch hinaus kommt. Allerdings gilt auch hier: Wenn der rote nicht mag, bleibt der grüne unten.

###3. Steuerung
Für die Steuerung kann entweder die Tastatur für beide Spieler oder jeweils ein XBox360-Controller verwendet werden. Alternativ kann auch ein Spieler mit Controller und der andere auf der Tastatur spielen. Jeder Spieler wird nach seiner präferierten Eingabemethode gefragt.

Die Steuerung des grünen Blob(Tastatur | XBox360-Controller):
  * Springen:      W | A
  * Links/Rechts:  A/D | Analog Stick
  * Aktion:        S | X
  
Die Steuerung des roten Blob(Tastatur | XBox360-Controller):
  * Springen:        Pfeiltaste oben | A
  * Links/Rechts:    Pfeiltaste links/Pfeiltaste rechts | Analog Stick
  * Aktion:          Pfeiltaste unten | X
  * Spezialsteuerung Heli: LB/RB für Höhengewinnung
 
Aktion ermöglich die Spezialfähigkeiten. Wenn keine Umgebungsobjekte, wie ein Baum für die Slingshot, vorhanden sind, dann wird anhand des Blobs das Trampolin oder Stretching verwendet.
