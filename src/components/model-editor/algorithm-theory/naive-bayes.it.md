# Naive Bayes

Naive Bayes è un algoritmo di classificazione che usa la **probabilità** per decidere quale classe è più probabile.

Si chiede:
- "Se questo esempio appartiene alla Classe A, quanto sono probabili queste caratteristiche?"
- "Se appartiene alla Classe B, quanto sono probabili queste caratteristiche?"

Poi confronta i punteggi e sceglie la classe con probabilità più alta.

La parola **"naive"** significa che assume le caratteristiche indipendenti (ogni caratteristica contribuisce separatamente).
Questa ipotesi non è sempre vera, ma l'algoritmo funziona sorprendentemente bene in molti casi reali.

## Intuizione semplice (esempio filtro spam)

Immagina di voler classificare un messaggio come:
- **Spam**
- **Non spam**

E controlli parole come: `free`, `win`, `meeting`.

Se un messaggio contiene "free win", quelle parole sono molto più comuni nello spam, quindi Naive Bayes assegna una probabilità di spam più alta.

## Confidenza (probabilità di base)

Naive Bayes calcola un punteggio per ogni classe e poi trasforma questi punteggi in probabilità.

Per ogni classe fa:

**Score(classe) = P(classe) x P(caratteristica1|classe) x P(caratteristica2|classe) x ...**

Poi normalizza:

**Probabilità(classe) = Score(classe) / (somma di tutti gli score delle classi)**

Passo dopo passo (messaggio: `"free win"`), con conteggi semplici:
1. Immagina che i dati di training abbiano:
   - 10 messaggi spam, 10 messaggi non spam
   - Nello spam: `free` appare in 6/10, `win` appare in 3/10
   - Nel non spam: `free` appare in 1/10, `win` appare in 2/10
2. Converti i conteggi in probabilità:
   - `P(Spam) = 10/20 = 0.5`
   - `P(Non spam) = 10/20 = 0.5`
   - `P(free|Spam) = 6/10 = 0.6`
   - `P(win|Spam) = 3/10 = 0.3`
   - `P(free|Non spam) = 1/10 = 0.1`
   - `P(win|Non spam) = 2/10 = 0.2`
3. Calcola gli score delle classi:
   - `Score(Spam) = 0.5 x 0.6 x 0.3 = 0.09`
   - `Score(Non spam) = 0.5 x 0.1 x 0.2 = 0.01`
4. Somma gli score:
   - `Total = 0.09 + 0.01 = 0.10`
5. Converti in probabilità:
   - `P(Spam|messaggio) = 0.09 / 0.10 = 0.90 = 90%`
   - `P(Non spam|messaggio) = 0.01 / 0.10 = 0.10 = 10%`
6. Scegli la probabilità più alta:
   - Predizione: **Spam** con **90% di confidenza**.

Perché funziona: l'algoritmo confronta "quale classe spiega meglio lo stesso messaggio" e poi riscala in modo che le probabilità sommino al 100%.
I valori di score possono essere piccoli perché moltiplichiamo probabilità, ed è normale.

## Perché è utile

- Molto veloce da addestrare e usare in predizione
- Funziona bene nella classificazione di testo
- Buon modello di base da cui partire

## Esempio visivo

<svg width="760" height="420" viewBox="0 0 760 420" xmlns="http://www.w3.org/2000/svg">
  <rect width="760" height="420" fill="#f7f9fc"/>
  <text x="24" y="34" font-family="Arial, sans-serif" font-size="24" fill="#1f2937">Naive Bayes: classificazione basata sulla probabilità</text>

  <rect x="30" y="70" width="300" height="90" rx="12" fill="#e0f2fe" stroke="#0284c7"/>
  <text x="45" y="100" font-family="Arial, sans-serif" font-size="15" fill="#0c4a6e">Messaggio:</text>
  <text x="45" y="125" font-family="Arial, sans-serif" font-size="18" fill="#0c4a6e">"free win"</text>
  <text x="45" y="146" font-family="Arial, sans-serif" font-size="13" fill="#075985">Caratteristiche: free, win</text>

  <line x1="340" y1="115" x2="420" y2="115" stroke="#64748b" stroke-width="3"/>
  <polygon points="420,115 410,109 410,121" fill="#64748b"/>

  <rect x="440" y="70" width="280" height="120" rx="12" fill="#fff7ed" stroke="#ea580c"/>
  <text x="455" y="98" font-family="Arial, sans-serif" font-size="18" fill="#9a3412">Classe: Spam</text>
  <text x="455" y="124" font-family="Arial, sans-serif" font-size="14" fill="#7c2d12">P(caratt. | Spam) = alta</text>
  <text x="455" y="148" font-family="Arial, sans-serif" font-size="16" fill="#7c2d12">Score = 0.09</text>
  <text x="455" y="172" font-family="Arial, sans-serif" font-size="16" fill="#7c2d12">Confidenza = 90%</text>

  <rect x="440" y="220" width="280" height="120" rx="12" fill="#ecfeff" stroke="#0891b2"/>
  <text x="455" y="248" font-family="Arial, sans-serif" font-size="18" fill="#164e63">Classe: Non spam</text>
  <text x="455" y="274" font-family="Arial, sans-serif" font-size="14" fill="#0e7490">P(caratt. | Non spam) = più bassa</text>
  <text x="455" y="298" font-family="Arial, sans-serif" font-size="16" fill="#0e7490">Score = 0.01</text>
  <text x="455" y="322" font-family="Arial, sans-serif" font-size="16" fill="#0e7490">Confidenza = 10%</text>

  <rect x="30" y="240" width="360" height="100" rx="12" fill="#dcfce7" stroke="#16a34a"/>
  <text x="50" y="278" font-family="Arial, sans-serif" font-size="18" fill="#166534">Predizione: SPAM</text>
  <text x="50" y="305" font-family="Arial, sans-serif" font-size="16" fill="#166534">perché 90% &gt; 10%</text>
</svg>
