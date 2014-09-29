MME_Blob2D_Puzzle_Plattformer
=============================

A simple browser puzzle-game for 2 Players with 40 Levels in 8 Overworlds.
Enjoy!

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
####4.1 Engines und Libraries
####4.2 Verwendete Patterns



###1. Starten des Spiels

Um mit dem Spiel loslegen zu können, muss einfach die index.html-Datei im Projektordner mit dem Google Chrome Browser geöffnet werden.

###2. Darlegen der Spezialfähigkeiten
####2.1 Helicopter
Treten die Blobs gemeinsam in einen Tornado, können sie sich entscheiden, ob sie sich zum Helicopter vereinen und rumfliegen wollen. Um so einen Helicopter zu steuern, benötigt es zwei Personen und Absprache, da nur einer entweder die Höhe oder die Richtung vorgibt. Natürlich kann der Helicopter auch wieder in seine Einzelteile zerlegt werden, wenn dieser in einer Landezone landet und sich nicht mehr bewegt.
####2.2 Sphere
Befinden sich die Blobs auf einer rotierenden Sphäre verputzt der rote Blob kurzerhand den grünen Blob, um eine Kugel zu bilden. Die ist so massiv, dass ihr sogar Stacheln nichts anhaben und Knöpfe durch bloßes darüberrollen einfach platt gewalzt werden. Wird dies einen der Blobs zu bunt, kann er jederzeit die Kugel auflösen.
####2.3 Bridge
Ein Pfahl und zwei Blobs ergeben ein windiges, brückenähnliches Gebilde, dass immerhin reicht um Schluchten, Löcher oder sonstige Abgründe gemeinsam zu überqueren. Dabei können sich die Blobs entscheiden auf welcher Seite sie hochklettern möchten, sofern sie sich auf links oder rechts einigen können.
####2.4 Slingshot
Wenn zwei Bäume verdächtig nahe beieinander stehen, heißt das garantiert, dass man hier den grünen Blob per Luftpost verschicken kann. Entscheiden sich die Blobs eine Slingshot zu bilden, hängt sich der rote Blob zwischen die Bäume und der grüne Blob spannt sich dann ein und wird herauskatapultiert. Dabei müssen beide zusammenarbeiten, damit Abschusswinkel und -stärke ausreichen, um mögliche Landungen in Stacheln zu vermeiden.
####2.5 Teleport
Seltsame, lilafarbene Portale vermögen es die Standorte der Blobs zu vertauschen. Deren Ursprung ist unbekannt. Deren Funktionsweise ist unbekannt. Sie beamen lediglich Blobs durch die Gegend.
####2.6 Trampolin
Obwohl der rote Blob sowieso am höchsten springt, reicht ihm das nicht und deswegen kann der grüne Blob sich in ein Trampolin verwandeln. Allerdings nur, wenn der grüne Blob das auch will und sich sonst nichts in der Nähe befindet. Also sollte der rote Blob ein wenig aufpassen, nicht dass das Trampolin auf einmal fehlt und er stattdessen in Stacheln rutscht.
####2.7 Stretching
Als Ausgleich kann der rote Blob sich zu doppelter Größe strecken. Damit der grüne auch mal hoch hinaus kommt. Allerdings gilt auch hier: Wenn der rote nicht mag, bleibt der grüne unten.

###3. Steuerung
Für die Steuerung kann entweder die Tastatur für beide Spieler oder jeweils ein XBox360-Controller verwendet werden. Alternativ kann auch ein Spieler mit Controller und der andere auf der Tastatur spielen. Jeder Spieler wird nach seiner präferierten Eingabemethode gefragt.

  * Pause: Esc

Die Steuerung des grünen Blob(Tastatur | XBox360-Controller):
  * Springen:      W | A
  * Links/Rechts:  A/D | Analog Stick
  * Aktion:        S | X
  
Die Steuerung des roten Blob(Tastatur | XBox360-Controller):
  * Springen:        Pfeiltaste oben | A
  * Links/Rechts:    Pfeiltaste links/Pfeiltaste rechts | Analog Stick
  * Aktion:          Pfeiltaste unten | X
  * Spezialsteuerung Heli: Pfeiltaste links/Pfeiltaste rechts | LB/RB für Höhengewinnung
 
Aktion ermöglich die Spezialfähigkeiten. Wenn keine Umgebungsobjekte, wie ein Baum für die Slingshot, vorhanden sind, dann wird anhand des Blobs das Trampolin oder Stretching verwendet. Analog werden alle Spezialfähigkeiten, abgesehen vom Helicopter und Bridge durch erneutes betätigen des Aktionsknopfes abgebrochen.
Der Helicopter wird an seinem Landeplatz zerlegt und die Brücke wird automatisch aufgelöst, sobald sich die Spieler per Richtungstasten für eine Richtung zum Hochklettern geeinigt haben.

###4. Technische Details
####4.1 Engines und Libraries
Für die Umsetzung des Spiels werden die GraphicsEngine easelJS, der Tilemapping-Editor Tiled, die PhysicsEngine Box2D, jQuery, jQueryUI und soundJS verwendet. 

EaselJS übernimmt sämtliche Visualisierungsaspekte des Spiels. Das erstreckt sich von der Darstellung der Spielwelt, über die Blobs bis hin zu jeder auftretenden Animation. Spiellogisch trägt diese Engine keine Relevanz. Dafür dient Box2D.

Tiled erstellt aus einem Tileset (.png) einzelne verwendbare Tiles aus denen die Level zusammengebaut werden. Das Ergebnis wird als JSON exportiert ,vom Spiel eingelesen und interpretiert.

Diese PhysicsEngine wird verwendet, um Kollisionsabfragen und Fallphysik zu berechnen. Mit deren Hilfe ist die Spiellogik umgesetzt, da zum Beispiel die Kollision mit einer Tür, ein Level beendet.

jQuery wird herangezogen um die DOM-Elemente der zu Grunde liegenden Website effizienter und präziser manipulieren zu könnnen.

jQuerUI dient lediglich dem Zweck den Canvas zu schütteln. Diese Library ermöglicht diesen Shake-Effect bequem ohne eigenen CSS-Code produzieren zu müssen.

soundJS vertont das Spiel. 

####4.2 Verwendete Patterns

Das Spiel verwendet soweit wie möglich das Module Pattern: Elemente, die nur einmal vorkommen, sind als Module umgesetzt. Beispielsweise gibt es ein Modul, das für die Physik zuständig ist (den PhysicsHandler).

Die Grafiken (EntityTypes) und GameModel-Blobs sind jeweils als Klassen mit einer einfachen Vererbungshierarchie umgesetzt. Hierbei ergeben sich Probleme, die im Module Pattern nicht auftauchen; es sind z.B. alle Methoden, die in einer Klasse stehen, aber nicht dem "this"-Objekt oder einem anderen Objekt zugehörig sind, "global" definiert. Sie überschreiben sich damit gegenseitig über mehrere Klassen hinweg.
Aus diesem Grund sind die Methoden zum Großteil bestimmten Variablen zugeordnet (entweder "this" oder einem dafür eigens angelegten Objekt, wie der "private"-Variable im CollisionHandler).
Vererbung wird über die prototype-Variable gelöst, über die alle Variablen in JavaScript verfügen. Dadurch können Methoden von Superklassen aufgerufen oder überschrieben werden. Die "Schlüsselzeile" für die Vererbung ist 

    this.prototype = new Superclass();

Grundsätzlich hält sich das Spiel an die Trennung von Model, View/Sound und Controller, zumindest soweit, wie das für ein Spiel praktikabel ist. Grafiken werden nur im ViewController erstellt und der MainController verbindet Model und View. Die verwendeten Engines machen die vollständige Unabhängigkeit von Phsyik und Visualisierung praktisch unmöglich und es ist bei einem Spiel auch nicht sinnvoll, das anzustreben.
