# Neural network

Uma rede neural é um modelo que aprende padrões combinando muitos cálculos simples.

Pense em camadas de pequenas unidades de decisão (neurónios):
- A **camada de entrada** recebe os dados.
- Uma ou mais **camadas ocultas** procuram padrões úteis.
- A **camada de saída** dá uma pontuação para cada classe.

## Intuição simples (exemplo de classificação de imagens)

Imagine que queremos classificar uma imagem como:
- **Gato**
- **Cão**
- **Pássaro**

A rede não memoriza uma foto exata.  
Ela aprende padrões como bordas, formas, texturas e combinações desses padrões.

## Como aprende (treino)

Durante o treino, ela repete este ciclo muitas vezes:
1. **Forward pass**: a entrada passa pela rede e produz pontuações por classe.
2. **Comparar com a resposta correta**: calcula um erro (loss).
3. **Backpropagation**: encontra quais ligações contribuíram mais para o erro.
4. **Atualizar pesos**: ajusta um pouco as ligações para reduzir o erro futuro.

Depois de muitos exemplos, as previsões costumam melhorar.

## Confiança (probabilidade básica)

No final, o modelo tem uma pontuação para cada classe.  
Para converter pontuações em probabilidades que somem 100%, redes neurais costumam usar **Softmax**.

Passo a passo (exemplo):
1. Pontuações da camada de saída:
   - `Gato = 3.0`
   - `Cão = 1.0`
   - `Pássaro = 0.0`
2. Softmax transforma isso em probabilidades:
   - `P(Gato) = 84%`
   - `P(Cão) = 11%`
   - `P(Pássaro) = 5%`
3. Escolher a maior probabilidade:
   - Previsão: **Gato** com **84% de confiança**.

Importante: confiança é uma estimativa, não uma garantia.

## Por que é útil

- Pode aprender padrões complexos
- Funciona bem com imagens, texto e som
- Pode melhorar muito com mais dados

## Exemplo visual

<svg width="760" height="420" viewBox="0 0 760 420" xmlns="http://www.w3.org/2000/svg">
  <rect width="760" height="420" fill="#f7f9fc"/>
  <text x="24" y="34" font-family="Arial, sans-serif" font-size="24" fill="#1f2937">Rede neural: da entrada às probabilidades</text>

  <rect x="30" y="80" width="180" height="180" rx="12" fill="#e0f2fe" stroke="#0284c7"/>
  <text x="50" y="110" font-family="Arial, sans-serif" font-size="16" fill="#0c4a6e">Entrada</text>
  <text x="50" y="138" font-family="Arial, sans-serif" font-size="14" fill="#075985">Características da imagem</text>
  <text x="50" y="160" font-family="Arial, sans-serif" font-size="14" fill="#075985">bordas, formas...</text>

  <line x1="210" y1="170" x2="290" y2="170" stroke="#64748b" stroke-width="3"/>
  <polygon points="290,170 280,164 280,176" fill="#64748b"/>

  <rect x="300" y="80" width="180" height="180" rx="12" fill="#fff7ed" stroke="#ea580c"/>
  <text x="320" y="110" font-family="Arial, sans-serif" font-size="16" fill="#9a3412">Camadas ocultas</text>
  <text x="320" y="138" font-family="Arial, sans-serif" font-size="14" fill="#7c2d12">combinam padrões</text>
  <text x="320" y="160" font-family="Arial, sans-serif" font-size="14" fill="#7c2d12">e calculam pontuações</text>

  <line x1="480" y1="170" x2="560" y2="170" stroke="#64748b" stroke-width="3"/>
  <polygon points="560,170 550,164 550,176" fill="#64748b"/>

  <rect x="570" y="60" width="160" height="240" rx="12" fill="#ecfeff" stroke="#0891b2"/>
  <text x="588" y="90" font-family="Arial, sans-serif" font-size="16" fill="#164e63">Saída</text>
  <text x="588" y="124" font-family="Arial, sans-serif" font-size="14" fill="#0e7490">Gato: 84%</text>
  <text x="588" y="152" font-family="Arial, sans-serif" font-size="14" fill="#0e7490">Cão: 11%</text>
  <text x="588" y="180" font-family="Arial, sans-serif" font-size="14" fill="#0e7490">Pássaro: 5%</text>
  <text x="588" y="220" font-family="Arial, sans-serif" font-size="16" fill="#0e7490">Previsão:</text>
  <text x="588" y="244" font-family="Arial, sans-serif" font-size="18" fill="#166534">GATO</text>
</svg>
