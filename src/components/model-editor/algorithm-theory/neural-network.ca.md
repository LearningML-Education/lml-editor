# Neural network

Una xarxa neuronal és un model que aprèn patrons combinant molts càlculs simples.

Pensa en capes de petites unitats de decisió (neurones):
- La **capa d'entrada** rep les dades.
- Una o més **capes ocultes** busquen patrons útils.
- La **capa de sortida** dona una puntuació per a cada classe.

## Intuïció simple (exemple de classificació d'imatges)

Imagina que volem classificar una imatge com:
- **Gat**
- **Gos**
- **Ocell**

La xarxa no memoritza una foto exacta.  
Aprèn patrons com vores, formes, textures i combinacions d'aquests patrons.

## Com aprèn (entrenament)

Durant l'entrenament, repeteix aquest cicle moltes vegades:
1. **Forward pass**: l'entrada passa per la xarxa i produeix puntuacions de classe.
2. **Comparar amb la resposta correcta**: calcula un error (loss).
3. **Backpropagation**: detecta quines connexions han contribuït més a l'error.
4. **Actualitzar pesos**: ajusta una mica les connexions per reduir l'error futur.

Després de molts exemples, les prediccions solen millorar.

## Confiança (probabilitat bàsica)

Al final, el model té una puntuació per classe.  
Per convertir puntuacions en probabilitats que sumin 100%, les xarxes neuronals solen usar **Softmax**.

Pas a pas (exemple):
1. Puntuacions de la capa de sortida:
   - `Gat = 3.0`
   - `Gos = 1.0`
   - `Ocell = 0.0`
2. Softmax ho converteix en probabilitats:
   - `P(Gat) = 84%`
   - `P(Gos) = 11%`
   - `P(Ocell) = 5%`
3. Triar la probabilitat més alta:
   - Predicció: **Gat** amb **84% de confiança**.

Important: la confiança és una estimació, no una garantia.

## Per què és útil

- Pot aprendre patrons complexos
- Funciona bé amb imatges, text i so
- Pot millorar molt amb més dades

## Exemple visual

<svg width="760" height="420" viewBox="0 0 760 420" xmlns="http://www.w3.org/2000/svg">
  <rect width="760" height="420" fill="#f7f9fc"/>
  <text x="24" y="34" font-family="Arial, sans-serif" font-size="24" fill="#1f2937">Xarxa neuronal: de l'entrada a les probabilitats</text>

  <rect x="30" y="80" width="180" height="180" rx="12" fill="#e0f2fe" stroke="#0284c7"/>
  <text x="50" y="110" font-family="Arial, sans-serif" font-size="16" fill="#0c4a6e">Entrada</text>
  <text x="50" y="138" font-family="Arial, sans-serif" font-size="14" fill="#075985">Característiques d'imatge</text>
  <text x="50" y="160" font-family="Arial, sans-serif" font-size="14" fill="#075985">vores, formes...</text>

  <line x1="210" y1="170" x2="290" y2="170" stroke="#64748b" stroke-width="3"/>
  <polygon points="290,170 280,164 280,176" fill="#64748b"/>

  <rect x="300" y="80" width="180" height="180" rx="12" fill="#fff7ed" stroke="#ea580c"/>
  <text x="320" y="110" font-family="Arial, sans-serif" font-size="16" fill="#9a3412">Capes ocultes</text>
  <text x="320" y="138" font-family="Arial, sans-serif" font-size="14" fill="#7c2d12">combinen patrons</text>
  <text x="320" y="160" font-family="Arial, sans-serif" font-size="14" fill="#7c2d12">i calculen puntuacions</text>

  <line x1="480" y1="170" x2="560" y2="170" stroke="#64748b" stroke-width="3"/>
  <polygon points="560,170 550,164 550,176" fill="#64748b"/>

  <rect x="570" y="60" width="160" height="240" rx="12" fill="#ecfeff" stroke="#0891b2"/>
  <text x="588" y="90" font-family="Arial, sans-serif" font-size="16" fill="#164e63">Sortida</text>
  <text x="588" y="124" font-family="Arial, sans-serif" font-size="14" fill="#0e7490">Gat: 84%</text>
  <text x="588" y="152" font-family="Arial, sans-serif" font-size="14" fill="#0e7490">Gos: 11%</text>
  <text x="588" y="180" font-family="Arial, sans-serif" font-size="14" fill="#0e7490">Ocell: 5%</text>
  <text x="588" y="220" font-family="Arial, sans-serif" font-size="16" fill="#0e7490">Predicció:</text>
  <text x="588" y="244" font-family="Arial, sans-serif" font-size="18" fill="#166534">GAT</text>
</svg>
