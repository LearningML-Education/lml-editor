# Naive Bayes

Naive Bayes é un algoritmo de clasificación que usa **probabilidade** para decidir que clase é a máis probable.

Faise estas preguntas:
- "Se este exemplo pertence á Clase A, que probabilidade teñen estas características?"
- "Se pertence á Clase B, que probabilidade teñen estas características?"

Despois compara as puntuacións e escolle a clase coa probabilidade máis alta.

A palabra **"naive"** significa que asume que as características son independentes (cada característica contribúe por separado).
Esa suposición non sempre é certa, pero o algoritmo funciona sorprendentemente ben en moitas tarefas reais.

## Intuición simple (exemplo de filtro de spam)

Imaxina que queremos clasificar unha mensaxe como:
- **Spam**
- **Non spam**

E revisamos palabras como: `free`, `win`, `meeting`.

Se unha mensaxe di "free win", esas palabras son moito máis comúns no spam, así que Naive Bayes dá unha probabilidade de spam máis alta.

## Confianza (probabilidade básica)

Naive Bayes calcula unha puntuación para cada clase e logo transforma esas puntuacións en probabilidades.

Para cada clase fai isto:

**Score(clase) = P(clase) x P(característica1|clase) x P(característica2|clase) x ...**

Logo normaliza:

**Probabilidade(clase) = Score(clase) / (suma de todos os scores das clases)**

Paso a paso (mensaxe: `"free win"`), con contaxes simples:
1. Imaxina que os datos de adestramento teñen:
   - 10 mensaxes spam, 10 mensaxes non spam
   - En spam: `free` aparece en 6/10, `win` aparece en 3/10
   - En non spam: `free` aparece en 1/10, `win` aparece en 2/10
2. Converte contaxes en probabilidades:
   - `P(Spam) = 10/20 = 0.5`
   - `P(Non spam) = 10/20 = 0.5`
   - `P(free|Spam) = 6/10 = 0.6`
   - `P(win|Spam) = 3/10 = 0.3`
   - `P(free|Non spam) = 1/10 = 0.1`
   - `P(win|Non spam) = 2/10 = 0.2`
3. Calcula os scores das clases:
   - `Score(Spam) = 0.5 x 0.6 x 0.3 = 0.09`
   - `Score(Non spam) = 0.5 x 0.1 x 0.2 = 0.01`
4. Suma os scores:
   - `Total = 0.09 + 0.01 = 0.10`
5. Converte a probabilidades:
   - `P(Spam|mensaxe) = 0.09 / 0.10 = 0.90 = 90%`
   - `P(Non spam|mensaxe) = 0.01 / 0.10 = 0.10 = 10%`
6. Escolle a probabilidade máis alta:
   - Predición: **Spam** con **90% de confianza**.

Por iso funciona: o algoritmo compara "que clase explica mellor a mesma mensaxe" e despois reescala para que as probabilidades sumen 100%.
Os valores de score poden ser pequenos porque multiplicamos probabilidades, e iso é normal.

## Por que é útil

- Moi rápido para adestrar e predicir
- Funciona ben en clasificación de texto
- Bo modelo base para comezar

## Exemplo visual

<svg width="760" height="420" viewBox="0 0 760 420" xmlns="http://www.w3.org/2000/svg">
  <rect width="760" height="420" fill="#f7f9fc"/>
  <text x="24" y="34" font-family="Arial, sans-serif" font-size="24" fill="#1f2937">Naive Bayes: clasificación baseada en probabilidade</text>

  <rect x="30" y="70" width="300" height="90" rx="12" fill="#e0f2fe" stroke="#0284c7"/>
  <text x="45" y="100" font-family="Arial, sans-serif" font-size="15" fill="#0c4a6e">Mensaxe:</text>
  <text x="45" y="125" font-family="Arial, sans-serif" font-size="18" fill="#0c4a6e">"free win"</text>
  <text x="45" y="146" font-family="Arial, sans-serif" font-size="13" fill="#075985">Características: free, win</text>

  <line x1="340" y1="115" x2="420" y2="115" stroke="#64748b" stroke-width="3"/>
  <polygon points="420,115 410,109 410,121" fill="#64748b"/>

  <rect x="440" y="70" width="280" height="120" rx="12" fill="#fff7ed" stroke="#ea580c"/>
  <text x="455" y="98" font-family="Arial, sans-serif" font-size="18" fill="#9a3412">Clase: Spam</text>
  <text x="455" y="124" font-family="Arial, sans-serif" font-size="14" fill="#7c2d12">P(caract. | Spam) = alta</text>
  <text x="455" y="148" font-family="Arial, sans-serif" font-size="16" fill="#7c2d12">Score = 0.09</text>
  <text x="455" y="172" font-family="Arial, sans-serif" font-size="16" fill="#7c2d12">Confianza = 90%</text>

  <rect x="440" y="220" width="280" height="120" rx="12" fill="#ecfeff" stroke="#0891b2"/>
  <text x="455" y="248" font-family="Arial, sans-serif" font-size="18" fill="#164e63">Clase: Non spam</text>
  <text x="455" y="274" font-family="Arial, sans-serif" font-size="14" fill="#0e7490">P(caract. | Non spam) = menor</text>
  <text x="455" y="298" font-family="Arial, sans-serif" font-size="16" fill="#0e7490">Score = 0.01</text>
  <text x="455" y="322" font-family="Arial, sans-serif" font-size="16" fill="#0e7490">Confianza = 10%</text>

  <rect x="30" y="240" width="360" height="100" rx="12" fill="#dcfce7" stroke="#16a34a"/>
  <text x="50" y="278" font-family="Arial, sans-serif" font-size="18" fill="#166534">Predición: SPAM</text>
  <text x="50" y="305" font-family="Arial, sans-serif" font-size="16" fill="#166534">porque 90% &gt; 10%</text>
</svg>
