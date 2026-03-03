# Naive Bayes

Naive Bayes és un algorisme de classificació que fa servir **probabilitat** per decidir quina classe és la més probable.

Es pregunta:
- "Si aquest exemple pertany a la Classe A, quina probabilitat tenen aquestes característiques?"
- "Si pertany a la Classe B, quina probabilitat tenen aquestes característiques?"

Després compara les puntuacions i tria la classe amb probabilitat més alta.

La paraula **"naive"** vol dir que assumeix que les característiques són independents (cada característica aporta per separat).
Aquesta suposició no sempre és certa, però l'algorisme funciona sorprenentment bé en moltes tasques reals.

## Intuïció simple (exemple de filtre de correu brossa)

Imagina que volem classificar un missatge com:
- **Spam**
- **No spam**

I revisem paraules com: `free`, `win`, `meeting`.

Si un missatge diu "free win", aquestes paraules són molt més comunes a l'spam, així que Naive Bayes dona una probabilitat d'spam més alta.

## Confiança (probabilitat bàsica)

Naive Bayes calcula una puntuació per a cada classe i després converteix aquestes puntuacions en probabilitats.

Per a cada classe fa això:

**Score(classe) = P(classe) x P(característica1|classe) x P(característica2|classe) x ...**

Després normalitza:

**Probabilitat(classe) = Score(classe) / (suma de tots els scores de classe)**

Pas a pas (missatge: `"free win"`), amb comptatges simples:
1. Imagina que les dades d'entrenament tenen:
   - 10 missatges spam, 10 missatges no spam
   - En spam: `free` apareix a 6/10, `win` apareix a 3/10
   - En no spam: `free` apareix a 1/10, `win` apareix a 2/10
2. Converteix comptatges en probabilitats:
   - `P(Spam) = 10/20 = 0.5`
   - `P(No spam) = 10/20 = 0.5`
   - `P(free|Spam) = 6/10 = 0.6`
   - `P(win|Spam) = 3/10 = 0.3`
   - `P(free|No spam) = 1/10 = 0.1`
   - `P(win|No spam) = 2/10 = 0.2`
3. Calcula els scores de classe:
   - `Score(Spam) = 0.5 x 0.6 x 0.3 = 0.09`
   - `Score(No spam) = 0.5 x 0.1 x 0.2 = 0.01`
4. Suma els scores:
   - `Total = 0.09 + 0.01 = 0.10`
5. Converteix a probabilitats:
   - `P(Spam|missatge) = 0.09 / 0.10 = 0.90 = 90%`
   - `P(No spam|missatge) = 0.01 / 0.10 = 0.10 = 10%`
6. Tria la probabilitat més alta:
   - Predicció: **Spam** amb **90% de confiança**.

Per això funciona: l'algorisme compara "quina classe explica millor el mateix missatge" i després reescala perquè les probabilitats sumin 100%.
Els valors de score poden ser petits perquè multipliquem probabilitats, i això és normal.

## Per què és útil

- Molt ràpid per entrenar i predir
- Funciona bé en classificació de text
- Bon model base per començar

## Exemple visual

<svg width="760" height="420" viewBox="0 0 760 420" xmlns="http://www.w3.org/2000/svg">
  <rect width="760" height="420" fill="#f7f9fc"/>
  <text x="24" y="34" font-family="Arial, sans-serif" font-size="24" fill="#1f2937">Naive Bayes: classificació basada en probabilitat</text>

  <rect x="30" y="70" width="300" height="90" rx="12" fill="#e0f2fe" stroke="#0284c7"/>
  <text x="45" y="100" font-family="Arial, sans-serif" font-size="15" fill="#0c4a6e">Missatge:</text>
  <text x="45" y="125" font-family="Arial, sans-serif" font-size="18" fill="#0c4a6e">"free win"</text>
  <text x="45" y="146" font-family="Arial, sans-serif" font-size="13" fill="#075985">Característiques: free, win</text>

  <line x1="340" y1="115" x2="420" y2="115" stroke="#64748b" stroke-width="3"/>
  <polygon points="420,115 410,109 410,121" fill="#64748b"/>

  <rect x="440" y="70" width="280" height="120" rx="12" fill="#fff7ed" stroke="#ea580c"/>
  <text x="455" y="98" font-family="Arial, sans-serif" font-size="18" fill="#9a3412">Classe: Spam</text>
  <text x="455" y="124" font-family="Arial, sans-serif" font-size="14" fill="#7c2d12">P(caract. | Spam) = alta</text>
  <text x="455" y="148" font-family="Arial, sans-serif" font-size="16" fill="#7c2d12">Score = 0.09</text>
  <text x="455" y="172" font-family="Arial, sans-serif" font-size="16" fill="#7c2d12">Confiança = 90%</text>

  <rect x="440" y="220" width="280" height="120" rx="12" fill="#ecfeff" stroke="#0891b2"/>
  <text x="455" y="248" font-family="Arial, sans-serif" font-size="18" fill="#164e63">Classe: No spam</text>
  <text x="455" y="274" font-family="Arial, sans-serif" font-size="14" fill="#0e7490">P(caract. | No spam) = més baixa</text>
  <text x="455" y="298" font-family="Arial, sans-serif" font-size="16" fill="#0e7490">Score = 0.01</text>
  <text x="455" y="322" font-family="Arial, sans-serif" font-size="16" fill="#0e7490">Confiança = 10%</text>

  <rect x="30" y="240" width="360" height="100" rx="12" fill="#dcfce7" stroke="#16a34a"/>
  <text x="50" y="278" font-family="Arial, sans-serif" font-size="18" fill="#166534">Predicció: SPAM</text>
  <text x="50" y="305" font-family="Arial, sans-serif" font-size="16" fill="#166534">perquè 90% &gt; 10%</text>
</svg>
