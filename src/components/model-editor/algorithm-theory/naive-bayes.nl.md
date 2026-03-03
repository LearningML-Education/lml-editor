# Naive Bayes

Naive Bayes is een classificatie-algoritme dat **waarschijnlijkheid** gebruikt om te beslissen welke klasse het meest waarschijnlijk is.

Het stelt de vragen:
- "Als dit voorbeeld bij Klasse A hoort, hoe waarschijnlijk zijn deze kenmerken?"
- "Als het bij Klasse B hoort, hoe waarschijnlijk zijn deze kenmerken?"

Daarna vergelijkt het de scores en kiest het de klasse met de hoogste waarschijnlijkheid.

Het woord **"naive"** betekent dat het aanneemt dat kenmerken onafhankelijk zijn (elk kenmerk draagt apart bij).
Die aanname is niet altijd waar, maar het algoritme werkt verrassend goed in veel echte taken.

## Eenvoudige intuïtie (spamfilter-voorbeeld)

Stel dat we een bericht willen classificeren als:
- **Spam**
- **Geen spam**

En we controleren woorden zoals: `free`, `win`, `meeting`.

Als een bericht "free win" bevat, komen die woorden veel vaker voor in spam, dus geeft Naive Bayes een hogere spamkans.

## Vertrouwen (basiswaarschijnlijkheid)

Naive Bayes berekent een score per klasse en zet die scores daarna om naar waarschijnlijkheden.

Voor elke klasse doet het:

**Score(klasse) = P(klasse) x P(kenmerk1|klasse) x P(kenmerk2|klasse) x ...**

Daarna normaliseert het:

**Waarschijnlijkheid(klasse) = Score(klasse) / (som van alle klassescores)**

Stap voor stap (bericht: `"free win"`), met eenvoudige tellingen:
1. Stel dat de trainingsdata heeft:
   - 10 spam-berichten, 10 geen-spam-berichten
   - In spam: `free` komt voor in 6/10, `win` in 3/10
   - In geen spam: `free` komt voor in 1/10, `win` in 2/10
2. Zet tellingen om naar waarschijnlijkheden:
   - `P(Spam) = 10/20 = 0.5`
   - `P(Geen spam) = 10/20 = 0.5`
   - `P(free|Spam) = 6/10 = 0.6`
   - `P(win|Spam) = 3/10 = 0.3`
   - `P(free|Geen spam) = 1/10 = 0.1`
   - `P(win|Geen spam) = 2/10 = 0.2`
3. Bereken klassescores:
   - `Score(Spam) = 0.5 x 0.6 x 0.3 = 0.09`
   - `Score(Geen spam) = 0.5 x 0.1 x 0.2 = 0.01`
4. Tel de scores op:
   - `Total = 0.09 + 0.01 = 0.10`
5. Zet om naar waarschijnlijkheden:
   - `P(Spam|bericht) = 0.09 / 0.10 = 0.90 = 90%`
   - `P(Geen spam|bericht) = 0.01 / 0.10 = 0.10 = 10%`
6. Kies de hoogste waarschijnlijkheid:
   - Voorspelling: **Spam** met **90% vertrouwen**.

Waarom dit werkt: het algoritme vergelijkt "welke klasse hetzelfde bericht beter verklaart" en herschaalt daarna zodat de kansen optellen tot 100%.
De scorewaarden kunnen klein zijn omdat we kansen vermenigvuldigen, en dat is normaal.

## Waarom dit nuttig is

- Heel snel om te trainen en te voorspellen
- Werkt goed voor tekstclassificatie
- Goed basismodel om mee te starten

## Visueel voorbeeld

<svg width="760" height="420" viewBox="0 0 760 420" xmlns="http://www.w3.org/2000/svg">
  <rect width="760" height="420" fill="#f7f9fc"/>
  <text x="24" y="34" font-family="Arial, sans-serif" font-size="24" fill="#1f2937">Naive Bayes: classificatie op basis van waarschijnlijkheid</text>

  <rect x="30" y="70" width="300" height="90" rx="12" fill="#e0f2fe" stroke="#0284c7"/>
  <text x="45" y="100" font-family="Arial, sans-serif" font-size="15" fill="#0c4a6e">Bericht:</text>
  <text x="45" y="125" font-family="Arial, sans-serif" font-size="18" fill="#0c4a6e">"free win"</text>
  <text x="45" y="146" font-family="Arial, sans-serif" font-size="13" fill="#075985">Kenmerken: free, win</text>

  <line x1="340" y1="115" x2="420" y2="115" stroke="#64748b" stroke-width="3"/>
  <polygon points="420,115 410,109 410,121" fill="#64748b"/>

  <rect x="440" y="70" width="280" height="120" rx="12" fill="#fff7ed" stroke="#ea580c"/>
  <text x="455" y="98" font-family="Arial, sans-serif" font-size="18" fill="#9a3412">Klasse: Spam</text>
  <text x="455" y="124" font-family="Arial, sans-serif" font-size="14" fill="#7c2d12">P(kenm. | Spam) = hoog</text>
  <text x="455" y="148" font-family="Arial, sans-serif" font-size="16" fill="#7c2d12">Score = 0.09</text>
  <text x="455" y="172" font-family="Arial, sans-serif" font-size="16" fill="#7c2d12">Vertrouwen = 90%</text>

  <rect x="440" y="220" width="280" height="120" rx="12" fill="#ecfeff" stroke="#0891b2"/>
  <text x="455" y="248" font-family="Arial, sans-serif" font-size="18" fill="#164e63">Klasse: Geen spam</text>
  <text x="455" y="274" font-family="Arial, sans-serif" font-size="14" fill="#0e7490">P(kenm. | Geen spam) = lager</text>
  <text x="455" y="298" font-family="Arial, sans-serif" font-size="16" fill="#0e7490">Score = 0.01</text>
  <text x="455" y="322" font-family="Arial, sans-serif" font-size="16" fill="#0e7490">Vertrouwen = 10%</text>

  <rect x="30" y="240" width="360" height="100" rx="12" fill="#dcfce7" stroke="#16a34a"/>
  <text x="50" y="278" font-family="Arial, sans-serif" font-size="18" fill="#166534">Voorspelling: SPAM</text>
  <text x="50" y="305" font-family="Arial, sans-serif" font-size="16" fill="#166534">omdat 90% &gt; 10%</text>
</svg>
