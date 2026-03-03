# Naive Bayes

Naive Bayes ist ein Klassifikationsalgorithmus, der **Wahrscheinlichkeit** nutzt, um zu entscheiden, welche Klasse am wahrscheinlichsten ist.

Er fragt:
- "Wenn dieses Beispiel zu Klasse A gehört, wie wahrscheinlich sind diese Merkmale?"
- "Wenn es zu Klasse B gehört, wie wahrscheinlich sind diese Merkmale?"

Dann vergleicht er die Werte und wählt die Klasse mit der höchsten Wahrscheinlichkeit.

Das Wort **"naive"** bedeutet, dass er annimmt, dass Merkmale unabhängig sind (jedes Merkmal trägt getrennt bei).
Diese Annahme stimmt nicht immer, aber der Algorithmus funktioniert in vielen realen Aufgaben erstaunlich gut.

## Einfache Intuition (Spamfilter-Beispiel)

Stell dir vor, wir wollen eine Nachricht klassifizieren als:
- **Spam**
- **Kein Spam**

Und wir prüfen Wörter wie: `free`, `win`, `meeting`.

Wenn eine Nachricht "free win" enthält, sind diese Wörter viel häufiger in Spam, deshalb gibt Naive Bayes eine höhere Spam-Wahrscheinlichkeit.

## Vertrauen (Grundwahrscheinlichkeit)

Naive Bayes berechnet für jede Klasse einen Score und wandelt diese Scores dann in Wahrscheinlichkeiten um.

Für jede Klasse gilt:

**Score(Klasse) = P(Klasse) x P(Merkmal1|Klasse) x P(Merkmal2|Klasse) x ...**

Dann wird normalisiert:

**Wahrscheinlichkeit(Klasse) = Score(Klasse) / (Summe aller Klassenscores)**

Schritt für Schritt (Nachricht: `"free win"`), mit einfachen Zählungen:
1. Stell dir vor, die Trainingsdaten enthalten:
   - 10 Spam-Nachrichten, 10 Nicht-Spam-Nachrichten
   - In Spam: `free` kommt in 6/10 vor, `win` in 3/10
   - In Nicht-Spam: `free` kommt in 1/10 vor, `win` in 2/10
2. Zählungen in Wahrscheinlichkeiten umrechnen:
   - `P(Spam) = 10/20 = 0.5`
   - `P(Kein Spam) = 10/20 = 0.5`
   - `P(free|Spam) = 6/10 = 0.6`
   - `P(win|Spam) = 3/10 = 0.3`
   - `P(free|Kein Spam) = 1/10 = 0.1`
   - `P(win|Kein Spam) = 2/10 = 0.2`
3. Klassenscores berechnen:
   - `Score(Spam) = 0.5 x 0.6 x 0.3 = 0.09`
   - `Score(Kein Spam) = 0.5 x 0.1 x 0.2 = 0.01`
4. Scores addieren:
   - `Total = 0.09 + 0.01 = 0.10`
5. In Wahrscheinlichkeiten umwandeln:
   - `P(Spam|Nachricht) = 0.09 / 0.10 = 0.90 = 90%`
   - `P(Kein Spam|Nachricht) = 0.01 / 0.10 = 0.10 = 10%`
6. Höchste Wahrscheinlichkeit auswählen:
   - Vorhersage: **Spam** mit **90% Vertrauen**.

Darum funktioniert es: Der Algorithmus vergleicht, "welche Klasse dieselbe Nachricht besser erklärt", und skaliert dann so, dass die Wahrscheinlichkeiten 100% ergeben.
Die Score-Werte können klein sein, weil wir Wahrscheinlichkeiten multiplizieren. Das ist normal.

## Warum es nützlich ist

- Sehr schnell beim Trainieren und Vorhersagen
- Funktioniert gut bei Textklassifikation
- Gutes Basismodell für den Start

## Visuelles Beispiel

<svg width="760" height="420" viewBox="0 0 760 420" xmlns="http://www.w3.org/2000/svg">
  <rect width="760" height="420" fill="#f7f9fc"/>
  <text x="24" y="34" font-family="Arial, sans-serif" font-size="24" fill="#1f2937">Naive Bayes: wahrscheinlichkeitsbasierte Klassifikation</text>

  <rect x="30" y="70" width="300" height="90" rx="12" fill="#e0f2fe" stroke="#0284c7"/>
  <text x="45" y="100" font-family="Arial, sans-serif" font-size="15" fill="#0c4a6e">Nachricht:</text>
  <text x="45" y="125" font-family="Arial, sans-serif" font-size="18" fill="#0c4a6e">"free win"</text>
  <text x="45" y="146" font-family="Arial, sans-serif" font-size="13" fill="#075985">Merkmale: free, win</text>

  <line x1="340" y1="115" x2="420" y2="115" stroke="#64748b" stroke-width="3"/>
  <polygon points="420,115 410,109 410,121" fill="#64748b"/>

  <rect x="440" y="70" width="280" height="120" rx="12" fill="#fff7ed" stroke="#ea580c"/>
  <text x="455" y="98" font-family="Arial, sans-serif" font-size="18" fill="#9a3412">Klasse: Spam</text>
  <text x="455" y="124" font-family="Arial, sans-serif" font-size="14" fill="#7c2d12">P(Merkmale | Spam) = hoch</text>
  <text x="455" y="148" font-family="Arial, sans-serif" font-size="16" fill="#7c2d12">Score = 0.09</text>
  <text x="455" y="172" font-family="Arial, sans-serif" font-size="16" fill="#7c2d12">Vertrauen = 90%</text>

  <rect x="440" y="220" width="280" height="120" rx="12" fill="#ecfeff" stroke="#0891b2"/>
  <text x="455" y="248" font-family="Arial, sans-serif" font-size="18" fill="#164e63">Klasse: Kein Spam</text>
  <text x="455" y="274" font-family="Arial, sans-serif" font-size="14" fill="#0e7490">P(Merkmale | Kein Spam) = niedriger</text>
  <text x="455" y="298" font-family="Arial, sans-serif" font-size="16" fill="#0e7490">Score = 0.01</text>
  <text x="455" y="322" font-family="Arial, sans-serif" font-size="16" fill="#0e7490">Vertrauen = 10%</text>

  <rect x="30" y="240" width="360" height="100" rx="12" fill="#dcfce7" stroke="#16a34a"/>
  <text x="50" y="278" font-family="Arial, sans-serif" font-size="18" fill="#166534">Vorhersage: SPAM</text>
  <text x="50" y="305" font-family="Arial, sans-serif" font-size="16" fill="#166534">weil 90% &gt; 10%</text>
</svg>
