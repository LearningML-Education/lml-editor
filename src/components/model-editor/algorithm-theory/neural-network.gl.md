# Neural network

Unha rede neuronal é un modelo que aprende patróns combinando moitos cálculos simples.

Pensa en capas de pequenas unidades de decisión (neuronas):
- A **capa de entrada** recibe os datos.
- Unha ou máis **capas ocultas** buscan patróns útiles.
- A **capa de saída** dá unha puntuación para cada clase.

## Intuición simple (exemplo de clasificación de imaxes)

Imaxina que queremos clasificar unha imaxe como:
- **Gato**
- **Can**
- **Paxaro**

A rede non memoriza unha foto exacta.  
Aprende patróns como bordos, formas, texturas e combinacións deses patróns.

## Como aprende (adestramento)

Durante o adestramento repite este ciclo moitas veces:
1. **Forward pass**: a entrada pasa pola rede e produce puntuacións de clase.
2. **Comparar coa resposta correcta**: calcula un erro (loss).
3. **Backpropagation**: detecta que conexións contribuíron máis ao erro.
4. **Actualizar pesos**: axusta un pouco as conexións para reducir o erro futuro.

Despois de moitos exemplos, as predicións adoitan mellorar.

## Confianza (probabilidade básica)

Ao final, o modelo ten unha puntuación por clase.  
Para converter puntuacións en probabilidades que sumen 100%, as redes neuronais adoitan usar **Softmax**.

Paso a paso (exemplo):
1. Puntuacións da capa de saída:
   - `Gato = 3.0`
   - `Can = 1.0`
   - `Paxaro = 0.0`
2. Softmax convérteo en probabilidades:
   - `P(Gato) = 84%`
   - `P(Can) = 11%`
   - `P(Paxaro) = 5%`
3. Escoller a probabilidade máis alta:
   - Predición: **Gato** con **84% de confianza**.

Importante: a confianza é unha estimación, non unha garantía.

## Por que é útil

- Pode aprender patróns complexos
- Funciona ben con imaxes, texto e son
- Pode mellorar moito con máis datos

## Exemplo visual

<svg width="760" height="420" viewBox="0 0 760 420" xmlns="http://www.w3.org/2000/svg">
  <rect width="760" height="420" fill="#f7f9fc"/>
  <text x="24" y="34" font-family="Arial, sans-serif" font-size="24" fill="#1f2937">Rede neuronal: da entrada ás probabilidades</text>

  <rect x="30" y="80" width="180" height="180" rx="12" fill="#e0f2fe" stroke="#0284c7"/>
  <text x="50" y="110" font-family="Arial, sans-serif" font-size="16" fill="#0c4a6e">Entrada</text>
  <text x="50" y="138" font-family="Arial, sans-serif" font-size="14" fill="#075985">Características da imaxe</text>
  <text x="50" y="160" font-family="Arial, sans-serif" font-size="14" fill="#075985">bordos, formas...</text>

  <line x1="210" y1="170" x2="290" y2="170" stroke="#64748b" stroke-width="3"/>
  <polygon points="290,170 280,164 280,176" fill="#64748b"/>

  <rect x="300" y="80" width="180" height="180" rx="12" fill="#fff7ed" stroke="#ea580c"/>
  <text x="320" y="110" font-family="Arial, sans-serif" font-size="16" fill="#9a3412">Capas ocultas</text>
  <text x="320" y="138" font-family="Arial, sans-serif" font-size="14" fill="#7c2d12">combinan patróns</text>
  <text x="320" y="160" font-family="Arial, sans-serif" font-size="14" fill="#7c2d12">e calculan puntuacións</text>

  <line x1="480" y1="170" x2="560" y2="170" stroke="#64748b" stroke-width="3"/>
  <polygon points="560,170 550,164 550,176" fill="#64748b"/>

  <rect x="570" y="60" width="160" height="240" rx="12" fill="#ecfeff" stroke="#0891b2"/>
  <text x="588" y="90" font-family="Arial, sans-serif" font-size="16" fill="#164e63">Saída</text>
  <text x="588" y="124" font-family="Arial, sans-serif" font-size="14" fill="#0e7490">Gato: 84%</text>
  <text x="588" y="152" font-family="Arial, sans-serif" font-size="14" fill="#0e7490">Can: 11%</text>
  <text x="588" y="180" font-family="Arial, sans-serif" font-size="14" fill="#0e7490">Paxaro: 5%</text>
  <text x="588" y="220" font-family="Arial, sans-serif" font-size="16" fill="#0e7490">Predición:</text>
  <text x="588" y="244" font-family="Arial, sans-serif" font-size="18" fill="#166534">GATO</text>
</svg>
