# KNN

KNN (K-Nearest Neighbors) ist ein Algorithmus, der neue Daten klassifiziert, indem er auf die ähnlichsten Beispiele schaut.

Stell dir vor, du hast Punkte aus zwei Klassen: blau und orange. Jeder Punkt ist ein bekanntes Beispiel.
Wenn ein neuer Punkt erscheint (grün), sucht KNN seine **K nächsten Nachbarn** (zum Beispiel K=3 oder K=5) und prüft, welche Klasse am häufigsten vorkommt.

- Wenn die meisten Nachbarn blau sind, wird der neue Punkt als blau klassifiziert.
- Wenn die meisten Nachbarn orange sind, wird der neue Punkt als orange klassifiziert.

KNN lernt keine komplizierte Formel. Es lernt, indem es Beispiele speichert und Abstände vergleicht. Deshalb funktioniert es gut, wenn ähnliche Daten nah beieinander liegen.

**Kernidee:**
K klein = empfindlichere Entscheidungen (kann auf Rauschen reagieren).
K groß = stabilere Entscheidungen (kann aber Details verlieren).

## Vertrauen (Grundwahrscheinlichkeit)

Bei KNN kann das Vertrauen sehr einfach geschätzt werden:

**Vertrauen für eine Klasse = (Nachbarn dieser Klasse) / K**

Wenn K = 5 und die nächsten Nachbarn sind:
- 3 blau
- 2 orange

Dann:
- Vertrauen(blau) = 3/5 = 0.6 = **60%**
- Vertrauen(orange) = 2/5 = 0.4 = **40%**

Die Vorhersage ist **blau**, mit **60% Vertrauen**.

Das ist eine gute Übung für Grundwahrscheinlichkeit: Verhältnis, Bruch, Dezimalzahl und Prozent.

## Visuelles Beispiel

<svg width="720" height="420" viewBox="0 0 720 420" xmlns="http://www.w3.org/2000/svg">
  <rect width="720" height="420" fill="#f7f9fc"/>
  <text x="24" y="36" font-family="Arial, sans-serif" font-size="24" fill="#1f2937">KNN: Klassifizieren nach nächsten Nachbarn (K=5)</text>

  <g stroke="#dbe3ef" stroke-width="1">
    <line x1="80" y1="70" x2="80" y2="360"/><line x1="160" y1="70" x2="160" y2="360"/>
    <line x1="240" y1="70" x2="240" y2="360"/><line x1="320" y1="70" x2="320" y2="360"/>
    <line x1="400" y1="70" x2="400" y2="360"/><line x1="480" y1="70" x2="480" y2="360"/>
    <line x1="560" y1="70" x2="560" y2="360"/><line x1="640" y1="70" x2="640" y2="360"/>
    <line x1="80" y1="70" x2="640" y2="70"/><line x1="80" y1="130" x2="640" y2="130"/>
    <line x1="80" y1="190" x2="640" y2="190"/><line x1="80" y1="250" x2="640" y2="250"/>
    <line x1="80" y1="310" x2="640" y2="310"/><line x1="80" y1="360" x2="640" y2="360"/>
  </g>

  <g fill="#2563eb">
    <circle cx="180" cy="140" r="9"/><circle cx="220" cy="200" r="9"/><circle cx="260" cy="160" r="9"/>
    <circle cx="300" cy="220" r="9"/><circle cx="210" cy="270" r="9"/>
  </g>

  <g fill="#f97316">
    <circle cx="470" cy="130" r="9"/><circle cx="510" cy="180" r="9"/><circle cx="550" cy="140" r="9"/>
    <circle cx="500" cy="250" r="9"/><circle cx="560" cy="220" r="9"/>
  </g>

  <circle cx="380" cy="200" r="10" fill="#10b981" stroke="#065f46" stroke-width="2"/>
  <text x="395" y="195" font-family="Arial, sans-serif" font-size="14" fill="#065f46">Neuer Punkt</text>

  <g stroke="#6b7280" stroke-width="2" stroke-dasharray="6 5">
    <line x1="380" y1="200" x2="300" y2="220"/>
    <line x1="380" y1="200" x2="260" y2="160"/>
    <line x1="380" y1="200" x2="510" y2="180"/>
    <line x1="380" y1="200" x2="470" y2="130"/>
    <line x1="380" y1="200" x2="220" y2="200"/>
  </g>

  <rect x="80" y="375" width="14" height="14" fill="#2563eb"/><text x="100" y="387" font-family="Arial, sans-serif" font-size="14" fill="#1f2937">Blaue Klasse</text>
  <rect x="220" y="375" width="14" height="14" fill="#f97316"/><text x="240" y="387" font-family="Arial, sans-serif" font-size="14" fill="#1f2937">Orange Klasse</text>
  <rect x="380" y="375" width="14" height="14" fill="#10b981"/><text x="400" y="387" font-family="Arial, sans-serif" font-size="14" fill="#1f2937">Zu klassifizierender Punkt</text>
</svg>
