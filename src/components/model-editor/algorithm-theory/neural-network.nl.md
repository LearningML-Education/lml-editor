# Neural network

Een neuraal netwerk is een model dat patronen leert door veel eenvoudige berekeningen te combineren.

Denk aan lagen met kleine besliseenheden (neuronen):
- De **invoerlaag** ontvangt de data.
- Een of meer **verborgen lagen** zoeken nuttige patronen.
- De **uitvoerlaag** geeft een score per klasse.

## Eenvoudige intuïtie (voorbeeld beeldclassificatie)

Stel dat we een afbeelding willen classificeren als:
- **Kat**
- **Hond**
- **Vogel**

Het netwerk onthoudt niet exact één foto.  
Het leert patronen zoals randen, vormen, texturen en combinaties daarvan.

## Hoe het leert (training)

Tijdens training herhaalt het deze cyclus vaak:
1. **Forward pass**: de invoer gaat door het netwerk en produceert klassescores.
2. **Vergelijken met het juiste antwoord**: bereken een fout (loss).
3. **Backpropagation**: bepaal welke verbindingen het meest bijdroegen aan de fout.
4. **Gewichten updaten**: pas verbindingen een beetje aan om toekomstige fout te verlagen.

Na veel voorbeelden worden voorspellingen meestal beter.

## Vertrouwen (basiswaarschijnlijkheid)

Aan het einde heeft het model één score per klasse.  
Om scores om te zetten naar waarschijnlijkheden die samen 100% zijn, gebruiken neurale netwerken vaak **Softmax**.

Stap voor stap (voorbeeld):
1. Scores van de uitvoerlaag:
   - `Kat = 3.0`
   - `Hond = 1.0`
   - `Vogel = 0.0`
2. Softmax zet dit om in waarschijnlijkheden:
   - `P(Kat) = 84%`
   - `P(Hond) = 11%`
   - `P(Vogel) = 5%`
3. Kies de hoogste waarschijnlijkheid:
   - Voorspelling: **Kat** met **84% vertrouwen**.

Belangrijk: vertrouwen is een schatting, geen garantie.

## Waarom het nuttig is

- Kan complexe patronen leren
- Werkt goed met beelden, tekst en geluid
- Kan veel verbeteren met meer data

## Visueel voorbeeld

<svg width="760" height="420" viewBox="0 0 760 420" xmlns="http://www.w3.org/2000/svg">
  <rect width="760" height="420" fill="#f7f9fc"/>
  <text x="24" y="34" font-family="Arial, sans-serif" font-size="24" fill="#1f2937">Neuraal netwerk: van invoer naar waarschijnlijkheden</text>

  <rect x="30" y="80" width="180" height="180" rx="12" fill="#e0f2fe" stroke="#0284c7"/>
  <text x="50" y="110" font-family="Arial, sans-serif" font-size="16" fill="#0c4a6e">Invoer</text>
  <text x="50" y="138" font-family="Arial, sans-serif" font-size="14" fill="#075985">Beeldkenmerken</text>
  <text x="50" y="160" font-family="Arial, sans-serif" font-size="14" fill="#075985">randen, vormen...</text>

  <line x1="210" y1="170" x2="290" y2="170" stroke="#64748b" stroke-width="3"/>
  <polygon points="290,170 280,164 280,176" fill="#64748b"/>

  <rect x="300" y="80" width="180" height="180" rx="12" fill="#fff7ed" stroke="#ea580c"/>
  <text x="320" y="110" font-family="Arial, sans-serif" font-size="16" fill="#9a3412">Verborgen lagen</text>
  <text x="320" y="138" font-family="Arial, sans-serif" font-size="14" fill="#7c2d12">combineren patronen</text>
  <text x="320" y="160" font-family="Arial, sans-serif" font-size="14" fill="#7c2d12">en berekenen scores</text>

  <line x1="480" y1="170" x2="560" y2="170" stroke="#64748b" stroke-width="3"/>
  <polygon points="560,170 550,164 550,176" fill="#64748b"/>

  <rect x="570" y="60" width="160" height="240" rx="12" fill="#ecfeff" stroke="#0891b2"/>
  <text x="588" y="90" font-family="Arial, sans-serif" font-size="16" fill="#164e63">Uitvoer</text>
  <text x="588" y="124" font-family="Arial, sans-serif" font-size="14" fill="#0e7490">Kat: 84%</text>
  <text x="588" y="152" font-family="Arial, sans-serif" font-size="14" fill="#0e7490">Hond: 11%</text>
  <text x="588" y="180" font-family="Arial, sans-serif" font-size="14" fill="#0e7490">Vogel: 5%</text>
  <text x="588" y="220" font-family="Arial, sans-serif" font-size="16" fill="#0e7490">Voorspelling:</text>
  <text x="588" y="244" font-family="Arial, sans-serif" font-size="18" fill="#166534">KAT</text>
</svg>
