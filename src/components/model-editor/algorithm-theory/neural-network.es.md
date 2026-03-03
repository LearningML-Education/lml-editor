# Neural network

Una red neuronal es un modelo que aprende patrones combinando muchos cálculos simples.

Piensa en capas de pequeñas unidades de decisión (neuronas):
- La **capa de entrada** recibe los datos.
- Una o más **capas ocultas** buscan patrones útiles.
- La **capa de salida** da una puntuación para cada clase.

## Intuición simple (ejemplo de clasificación de imágenes)

Imagina que queremos clasificar una imagen como:
- **Gato**
- **Perro**
- **Pájaro**

La red no memoriza una foto exacta.  
Aprende patrones como bordes, formas, texturas y combinaciones de esos patrones.

## Cómo aprende (entrenamiento)

Durante el entrenamiento, repite este ciclo muchas veces:
1. **Forward pass**: la entrada pasa por la red y produce puntuaciones de clase.
2. **Comparar con la respuesta correcta**: calcula un error (loss).
3. **Backpropagation**: detecta qué conexiones contribuyeron más al error.
4. **Actualizar pesos**: ajusta un poco las conexiones para reducir el error futuro.

Después de muchos ejemplos, las predicciones suelen mejorar.

## Confianza (probabilidad básica)

Al final, el modelo tiene una puntuación por clase.  
Para convertir puntuaciones en probabilidades que sumen 100%, las redes neuronales suelen usar **Softmax**.

Paso a paso (ejemplo):
1. Puntuaciones de la capa de salida:
   - `Gato = 3.0`
   - `Perro = 1.0`
   - `Pájaro = 0.0`
2. Softmax convierte esto en probabilidades:
   - `P(Gato) = 84%`
   - `P(Perro) = 11%`
   - `P(Pájaro) = 5%`
3. Elegir la probabilidad más alta:
   - Predicción: **Gato** con **84% de confianza**.

Importante: la confianza es una estimación, no una garantía.

## Por qué es útil

- Puede aprender patrones complejos
- Funciona bien con imágenes, texto y sonido
- Puede mejorar mucho con más datos

## Ejemplo visual

<svg width="760" height="420" viewBox="0 0 760 420" xmlns="http://www.w3.org/2000/svg">
  <rect width="760" height="420" fill="#f7f9fc"/>
  <text x="24" y="34" font-family="Arial, sans-serif" font-size="24" fill="#1f2937">Red neuronal: de la entrada a las probabilidades</text>

  <rect x="30" y="80" width="180" height="180" rx="12" fill="#e0f2fe" stroke="#0284c7"/>
  <text x="50" y="110" font-family="Arial, sans-serif" font-size="16" fill="#0c4a6e">Entrada</text>
  <text x="50" y="138" font-family="Arial, sans-serif" font-size="14" fill="#075985">Características de imagen</text>
  <text x="50" y="160" font-family="Arial, sans-serif" font-size="14" fill="#075985">bordes, formas...</text>

  <line x1="210" y1="170" x2="290" y2="170" stroke="#64748b" stroke-width="3"/>
  <polygon points="290,170 280,164 280,176" fill="#64748b"/>

  <rect x="300" y="80" width="180" height="180" rx="12" fill="#fff7ed" stroke="#ea580c"/>
  <text x="320" y="110" font-family="Arial, sans-serif" font-size="16" fill="#9a3412">Capas ocultas</text>
  <text x="320" y="138" font-family="Arial, sans-serif" font-size="14" fill="#7c2d12">combinan patrones</text>
  <text x="320" y="160" font-family="Arial, sans-serif" font-size="14" fill="#7c2d12">y calculan puntuaciones</text>

  <line x1="480" y1="170" x2="560" y2="170" stroke="#64748b" stroke-width="3"/>
  <polygon points="560,170 550,164 550,176" fill="#64748b"/>

  <rect x="570" y="60" width="160" height="240" rx="12" fill="#ecfeff" stroke="#0891b2"/>
  <text x="588" y="90" font-family="Arial, sans-serif" font-size="16" fill="#164e63">Salida</text>
  <text x="588" y="124" font-family="Arial, sans-serif" font-size="14" fill="#0e7490">Gato: 84%</text>
  <text x="588" y="152" font-family="Arial, sans-serif" font-size="14" fill="#0e7490">Perro: 11%</text>
  <text x="588" y="180" font-family="Arial, sans-serif" font-size="14" fill="#0e7490">Pájaro: 5%</text>
  <text x="588" y="220" font-family="Arial, sans-serif" font-size="16" fill="#0e7490">Predicción:</text>
  <text x="588" y="244" font-family="Arial, sans-serif" font-size="18" fill="#166534">GATO</text>
</svg>
