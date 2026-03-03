# Naive Bayes

Naive Bayes es un algoritmo de clasificación que usa **probabilidad** para decidir qué clase es la más probable.

Se pregunta:
- "Si este ejemplo pertenece a la Clase A, ¿qué probabilidad tienen estas características?"
- "Si pertenece a la Clase B, ¿qué probabilidad tienen estas características?"

Después compara las puntuaciones y elige la clase con mayor probabilidad.

La palabra **"naive"** significa que asume que las características son independientes (cada característica aporta por separado).
Esa suposición no siempre es cierta, pero el algoritmo funciona sorprendentemente bien en muchas tareas reales.

## Intuición simple (ejemplo de filtro de spam)

Imagina que queremos clasificar un mensaje como:
- **Spam**
- **No spam**

Y revisamos palabras como: `free`, `win`, `meeting`.

Si un mensaje dice "free win", esas palabras son mucho más comunes en spam, así que Naive Bayes da una probabilidad de spam más alta.

## Confianza (probabilidad básica)

Naive Bayes calcula una puntuación para cada clase y luego convierte esas puntuaciones en probabilidades.

Para cada clase hace esto:

**Score(clase) = P(clase) x P(característica1|clase) x P(característica2|clase) x ...**

Luego normaliza:

**Probabilidad(clase) = Score(clase) / (suma de todos los scores de clase)**

Paso a paso (mensaje: `"free win"`), con conteos simples:
1. Imagina que los datos de entrenamiento tienen:
   - 10 mensajes spam, 10 mensajes no spam
   - En spam: `free` aparece en 6/10, `win` aparece en 3/10
   - En no spam: `free` aparece en 1/10, `win` aparece en 2/10
2. Convierte conteos en probabilidades:
   - `P(Spam) = 10/20 = 0.5`
   - `P(No spam) = 10/20 = 0.5`
   - `P(free|Spam) = 6/10 = 0.6`
   - `P(win|Spam) = 3/10 = 0.3`
   - `P(free|No spam) = 1/10 = 0.1`
   - `P(win|No spam) = 2/10 = 0.2`
3. Calcula los scores de clase:
   - `Score(Spam) = 0.5 x 0.6 x 0.3 = 0.09`
   - `Score(No spam) = 0.5 x 0.1 x 0.2 = 0.01`
4. Suma los scores:
   - `Total = 0.09 + 0.01 = 0.10`
5. Convierte a probabilidades:
   - `P(Spam|mensaje) = 0.09 / 0.10 = 0.90 = 90%`
   - `P(No spam|mensaje) = 0.01 / 0.10 = 0.10 = 10%`
6. Elige la probabilidad más alta:
   - Predicción: **Spam** con **90% de confianza**.

Por eso funciona: el algoritmo compara "qué clase explica mejor el mismo mensaje" y luego reescala para que las probabilidades sumen 100%.
Los valores de score pueden ser pequeños porque multiplicamos probabilidades, y eso es normal.

## Por qué es útil

- Muy rápido para entrenar y predecir
- Funciona bien en clasificación de texto
- Buen modelo base para empezar

## Ejemplo visual

<svg width="760" height="420" viewBox="0 0 760 420" xmlns="http://www.w3.org/2000/svg">
  <rect width="760" height="420" fill="#f7f9fc"/>
  <text x="24" y="34" font-family="Arial, sans-serif" font-size="24" fill="#1f2937">Naive Bayes: clasificación basada en probabilidad</text>

  <rect x="30" y="70" width="300" height="90" rx="12" fill="#e0f2fe" stroke="#0284c7"/>
  <text x="45" y="100" font-family="Arial, sans-serif" font-size="15" fill="#0c4a6e">Mensaje:</text>
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
  <text x="455" y="248" font-family="Arial, sans-serif" font-size="18" fill="#164e63">Clase: No spam</text>
  <text x="455" y="274" font-family="Arial, sans-serif" font-size="14" fill="#0e7490">P(caract. | No spam) = menor</text>
  <text x="455" y="298" font-family="Arial, sans-serif" font-size="16" fill="#0e7490">Score = 0.01</text>
  <text x="455" y="322" font-family="Arial, sans-serif" font-size="16" fill="#0e7490">Confianza = 10%</text>

  <rect x="30" y="240" width="360" height="100" rx="12" fill="#dcfce7" stroke="#16a34a"/>
  <text x="50" y="278" font-family="Arial, sans-serif" font-size="18" fill="#166534">Predicción: SPAM</text>
  <text x="50" y="305" font-family="Arial, sans-serif" font-size="16" fill="#166534">porque 90% &gt; 10%</text>
</svg>
