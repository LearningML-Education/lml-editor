# Neural network

Ein neuronales Netz ist ein Modell, das Muster lernt, indem es viele einfache Berechnungen kombiniert.

Denk an Schichten kleiner Entscheidungseinheiten (Neuronen):
- Die **Eingabeschicht** erhält die Daten.
- Eine oder mehrere **versteckte Schichten** suchen nützliche Muster.
- Die **Ausgabeschicht** gibt einen Score für jede Klasse.

## Einfache Intuition (Beispiel Bildklassifikation)

Stell dir vor, wir wollen ein Bild klassifizieren als:
- **Katze**
- **Hund**
- **Vogel**

Das Netz merkt sich kein einzelnes Foto.  
Es lernt Muster wie Kanten, Formen, Texturen und Kombinationen davon.

## Wie es lernt (Training)

Beim Training wiederholt es diesen Zyklus oft:
1. **Forward pass**: Die Eingabe läuft durch das Netz und erzeugt Klassenscores.
2. **Mit der richtigen Antwort vergleichen**: Ein Fehler (Loss) wird berechnet.
3. **Backpropagation**: Es wird ermittelt, welche Verbindungen am meisten zum Fehler beigetragen haben.
4. **Gewichte aktualisieren**: Verbindungen werden leicht angepasst, um den zukünftigen Fehler zu verringern.

Nach vielen Beispielen werden die Vorhersagen meistens besser.

## Vertrauen (Grundwahrscheinlichkeit)

Am Ende hat das Modell einen Score pro Klasse.  
Um Scores in Wahrscheinlichkeiten umzuwandeln, die zusammen 100% ergeben, nutzen neuronale Netze oft **Softmax**.

Schritt für Schritt (Beispiel):
1. Scores der Ausgabeschicht:
   - `Katze = 3.0`
   - `Hund = 1.0`
   - `Vogel = 0.0`
2. Softmax macht daraus Wahrscheinlichkeiten:
   - `P(Katze) = 84%`
   - `P(Hund) = 11%`
   - `P(Vogel) = 5%`
3. Höchste Wahrscheinlichkeit auswählen:
   - Vorhersage: **Katze** mit **84% Vertrauen**.

Wichtig: Vertrauen ist eine Schätzung, keine Garantie.

## Warum es nützlich ist

- Kann komplexe Muster lernen
- Funktioniert gut mit Bildern, Text und Ton
- Kann sich mit mehr Daten stark verbessern

## Visuelles Beispiel

<svg width="760" height="420" viewBox="0 0 760 420" xmlns="http://www.w3.org/2000/svg">
  <rect width="760" height="420" fill="#f7f9fc"/>
  <text x="24" y="34" font-family="Arial, sans-serif" font-size="24" fill="#1f2937">Neuronales Netz: von Eingabe zu Wahrscheinlichkeiten</text>

  <rect x="30" y="80" width="180" height="180" rx="12" fill="#e0f2fe" stroke="#0284c7"/>
  <text x="50" y="110" font-family="Arial, sans-serif" font-size="16" fill="#0c4a6e">Eingabe</text>
  <text x="50" y="138" font-family="Arial, sans-serif" font-size="14" fill="#075985">Bildmerkmale</text>
  <text x="50" y="160" font-family="Arial, sans-serif" font-size="14" fill="#075985">Kanten, Formen...</text>

  <line x1="210" y1="170" x2="290" y2="170" stroke="#64748b" stroke-width="3"/>
  <polygon points="290,170 280,164 280,176" fill="#64748b"/>

  <rect x="300" y="80" width="180" height="180" rx="12" fill="#fff7ed" stroke="#ea580c"/>
  <text x="320" y="110" font-family="Arial, sans-serif" font-size="16" fill="#9a3412">Versteckte Schichten</text>
  <text x="320" y="138" font-family="Arial, sans-serif" font-size="14" fill="#7c2d12">kombinieren Muster</text>
  <text x="320" y="160" font-family="Arial, sans-serif" font-size="14" fill="#7c2d12">und berechnen Scores</text>

  <line x1="480" y1="170" x2="560" y2="170" stroke="#64748b" stroke-width="3"/>
  <polygon points="560,170 550,164 550,176" fill="#64748b"/>

  <rect x="570" y="60" width="160" height="240" rx="12" fill="#ecfeff" stroke="#0891b2"/>
  <text x="588" y="90" font-family="Arial, sans-serif" font-size="16" fill="#164e63">Ausgabe</text>
  <text x="588" y="124" font-family="Arial, sans-serif" font-size="14" fill="#0e7490">Katze: 84%</text>
  <text x="588" y="152" font-family="Arial, sans-serif" font-size="14" fill="#0e7490">Hund: 11%</text>
  <text x="588" y="180" font-family="Arial, sans-serif" font-size="14" fill="#0e7490">Vogel: 5%</text>
  <text x="588" y="220" font-family="Arial, sans-serif" font-size="16" fill="#0e7490">Vorhersage:</text>
  <text x="588" y="244" font-family="Arial, sans-serif" font-size="18" fill="#166534">KATZE</text>
</svg>
