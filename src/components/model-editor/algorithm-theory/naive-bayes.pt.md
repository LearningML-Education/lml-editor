# Naive Bayes

Naive Bayes é um algoritmo de classificação que usa **probabilidade** para decidir qual classe é mais provável.

Ele pergunta:
- "Se este exemplo pertence à Classe A, qual a probabilidade destas características?"
- "Se pertence à Classe B, qual a probabilidade destas características?"

Depois compara as pontuações e escolhe a classe com maior probabilidade.

A palavra **"naive"** significa que ele assume que as características são independentes (cada característica contribui separadamente).
Essa suposição nem sempre é verdadeira, mas o algoritmo funciona surpreendentemente bem em muitas tarefas reais.

## Intuição simples (exemplo de filtro de spam)

Imagine que queremos classificar uma mensagem como:
- **Spam**
- **Não spam**

E verificamos palavras como: `free`, `win`, `meeting`.

Se uma mensagem diz "free win", essas palavras são muito mais comuns em spam, então o Naive Bayes dá uma probabilidade maior para spam.

## Confiança (probabilidade básica)

Naive Bayes calcula uma pontuação para cada classe e depois transforma essas pontuações em probabilidades.

Para cada classe, faz isto:

**Score(classe) = P(classe) x P(característica1|classe) x P(característica2|classe) x ...**

Depois normaliza:

**Probabilidade(classe) = Score(classe) / (soma de todos os scores das classes)**

Passo a passo (mensagem: `"free win"`), com contagens simples:
1. Imagine que os dados de treino têm:
   - 10 mensagens spam, 10 mensagens não spam
   - Em spam: `free` aparece em 6/10, `win` aparece em 3/10
   - Em não spam: `free` aparece em 1/10, `win` aparece em 2/10
2. Converta contagens em probabilidades:
   - `P(Spam) = 10/20 = 0.5`
   - `P(Não spam) = 10/20 = 0.5`
   - `P(free|Spam) = 6/10 = 0.6`
   - `P(win|Spam) = 3/10 = 0.3`
   - `P(free|Não spam) = 1/10 = 0.1`
   - `P(win|Não spam) = 2/10 = 0.2`
3. Calcule os scores das classes:
   - `Score(Spam) = 0.5 x 0.6 x 0.3 = 0.09`
   - `Score(Não spam) = 0.5 x 0.1 x 0.2 = 0.01`
4. Some os scores:
   - `Total = 0.09 + 0.01 = 0.10`
5. Converta em probabilidades:
   - `P(Spam|mensagem) = 0.09 / 0.10 = 0.90 = 90%`
   - `P(Não spam|mensagem) = 0.01 / 0.10 = 0.10 = 10%`
6. Escolha a maior probabilidade:
   - Previsão: **Spam** com **90% de confiança**.

Por isso funciona: o algoritmo compara "qual classe explica melhor a mesma mensagem" e depois reescala para que as probabilidades somem 100%.
Os valores de score podem ser pequenos porque multiplicamos probabilidades, e isso é normal.

## Por que é útil

- Muito rápido para treinar e prever
- Funciona bem em classificação de texto
- Bom modelo de base para começar

## Exemplo visual

<svg width="760" height="420" viewBox="0 0 760 420" xmlns="http://www.w3.org/2000/svg">
  <rect width="760" height="420" fill="#f7f9fc"/>
  <text x="24" y="34" font-family="Arial, sans-serif" font-size="24" fill="#1f2937">Naive Bayes: classificação baseada em probabilidade</text>

  <rect x="30" y="70" width="300" height="90" rx="12" fill="#e0f2fe" stroke="#0284c7"/>
  <text x="45" y="100" font-family="Arial, sans-serif" font-size="15" fill="#0c4a6e">Mensagem:</text>
  <text x="45" y="125" font-family="Arial, sans-serif" font-size="18" fill="#0c4a6e">"free win"</text>
  <text x="45" y="146" font-family="Arial, sans-serif" font-size="13" fill="#075985">Características: free, win</text>

  <line x1="340" y1="115" x2="420" y2="115" stroke="#64748b" stroke-width="3"/>
  <polygon points="420,115 410,109 410,121" fill="#64748b"/>

  <rect x="440" y="70" width="280" height="120" rx="12" fill="#fff7ed" stroke="#ea580c"/>
  <text x="455" y="98" font-family="Arial, sans-serif" font-size="18" fill="#9a3412">Classe: Spam</text>
  <text x="455" y="124" font-family="Arial, sans-serif" font-size="14" fill="#7c2d12">P(caract. | Spam) = alta</text>
  <text x="455" y="148" font-family="Arial, sans-serif" font-size="16" fill="#7c2d12">Score = 0.09</text>
  <text x="455" y="172" font-family="Arial, sans-serif" font-size="16" fill="#7c2d12">Confiança = 90%</text>

  <rect x="440" y="220" width="280" height="120" rx="12" fill="#ecfeff" stroke="#0891b2"/>
  <text x="455" y="248" font-family="Arial, sans-serif" font-size="18" fill="#164e63">Classe: Não spam</text>
  <text x="455" y="274" font-family="Arial, sans-serif" font-size="14" fill="#0e7490">P(caract. | Não spam) = menor</text>
  <text x="455" y="298" font-family="Arial, sans-serif" font-size="16" fill="#0e7490">Score = 0.01</text>
  <text x="455" y="322" font-family="Arial, sans-serif" font-size="16" fill="#0e7490">Confiança = 10%</text>

  <rect x="30" y="240" width="360" height="100" rx="12" fill="#dcfce7" stroke="#16a34a"/>
  <text x="50" y="278" font-family="Arial, sans-serif" font-size="18" fill="#166534">Previsão: SPAM</text>
  <text x="50" y="305" font-family="Arial, sans-serif" font-size="16" fill="#166534">porque 90% &gt; 10%</text>
</svg>
