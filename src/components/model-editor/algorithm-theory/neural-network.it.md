# Neural network

Una rete neurale è un modello che impara schemi combinando molti calcoli semplici.

Pensa a strati di piccole unità decisionali (neuroni):
- Il **livello di input** riceve i dati.
- Uno o più **livelli nascosti** cercano schemi utili.
- Il **livello di output** dà un punteggio per ogni classe.

## Intuizione semplice (esempio di classificazione di immagini)

Immagina di voler classificare un'immagine come:
- **Gatto**
- **Cane**
- **Uccello**

La rete non memorizza una foto precisa.  
Impara schemi come bordi, forme, texture e combinazioni di questi schemi.

## Come impara (addestramento)

Durante l'addestramento ripete questo ciclo molte volte:
1. **Forward pass**: l'input attraversa la rete e produce punteggi di classe.
2. **Confronto con la risposta corretta**: calcola un errore (loss).
3. **Backpropagation**: trova quali connessioni hanno contribuito di più all'errore.
4. **Aggiornamento dei pesi**: regola un po' le connessioni per ridurre l'errore futuro.

Dopo molti esempi, le predizioni di solito migliorano.

## Confidenza (probabilità di base)

Alla fine, il modello ha un punteggio per ogni classe.  
Per convertire i punteggi in probabilità che sommano al 100%, le reti neurali usano spesso **Softmax**.

Passo dopo passo (esempio):
1. Punteggi del livello di output:
   - `Gatto = 3.0`
   - `Cane = 1.0`
   - `Uccello = 0.0`
2. Softmax li trasforma in probabilità:
   - `P(Gatto) = 84%`
   - `P(Cane) = 11%`
   - `P(Uccello) = 5%`
3. Scegli la probabilità più alta:
   - Predizione: **Gatto** con **84% di confidenza**.

Importante: la confidenza è una stima, non una garanzia.

## Perché è utile

- Può imparare schemi complessi
- Funziona bene con immagini, testo e audio
- Può migliorare molto con più dati

## Esempio visivo

<svg width="760" height="420" viewBox="0 0 760 420" xmlns="http://www.w3.org/2000/svg">
  <rect width="760" height="420" fill="#f7f9fc"/>
  <text x="24" y="34" font-family="Arial, sans-serif" font-size="24" fill="#1f2937">Rete neurale: dall'input alle probabilità</text>

  <rect x="30" y="80" width="180" height="180" rx="12" fill="#e0f2fe" stroke="#0284c7"/>
  <text x="50" y="110" font-family="Arial, sans-serif" font-size="16" fill="#0c4a6e">Input</text>
  <text x="50" y="138" font-family="Arial, sans-serif" font-size="14" fill="#075985">Caratteristiche immagine</text>
  <text x="50" y="160" font-family="Arial, sans-serif" font-size="14" fill="#075985">bordi, forme...</text>

  <line x1="210" y1="170" x2="290" y2="170" stroke="#64748b" stroke-width="3"/>
  <polygon points="290,170 280,164 280,176" fill="#64748b"/>

  <rect x="300" y="80" width="180" height="180" rx="12" fill="#fff7ed" stroke="#ea580c"/>
  <text x="320" y="110" font-family="Arial, sans-serif" font-size="16" fill="#9a3412">Livelli nascosti</text>
  <text x="320" y="138" font-family="Arial, sans-serif" font-size="14" fill="#7c2d12">combinano schemi</text>
  <text x="320" y="160" font-family="Arial, sans-serif" font-size="14" fill="#7c2d12">e calcolano punteggi</text>

  <line x1="480" y1="170" x2="560" y2="170" stroke="#64748b" stroke-width="3"/>
  <polygon points="560,170 550,164 550,176" fill="#64748b"/>

  <rect x="570" y="60" width="160" height="240" rx="12" fill="#ecfeff" stroke="#0891b2"/>
  <text x="588" y="90" font-family="Arial, sans-serif" font-size="16" fill="#164e63">Output</text>
  <text x="588" y="124" font-family="Arial, sans-serif" font-size="14" fill="#0e7490">Gatto: 84%</text>
  <text x="588" y="152" font-family="Arial, sans-serif" font-size="14" fill="#0e7490">Cane: 11%</text>
  <text x="588" y="180" font-family="Arial, sans-serif" font-size="14" fill="#0e7490">Uccello: 5%</text>
  <text x="588" y="220" font-family="Arial, sans-serif" font-size="16" fill="#0e7490">Predizione:</text>
  <text x="588" y="244" font-family="Arial, sans-serif" font-size="18" fill="#166534">GATTO</text>
</svg>
