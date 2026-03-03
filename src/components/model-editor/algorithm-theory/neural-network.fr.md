# Neural network

Un réseau de neurones est un modèle qui apprend des motifs en combinant beaucoup de calculs simples.

Pense à des couches de petites unités de décision (neurones) :
- La **couche d'entrée** reçoit les données.
- Une ou plusieurs **couches cachées** cherchent des motifs utiles.
- La **couche de sortie** donne un score pour chaque classe.

## Intuition simple (exemple de classification d'images)

Imaginons qu'on veuille classer une image comme :
- **Chat**
- **Chien**
- **Oiseau**

Le réseau ne mémorise pas une photo exacte.  
Il apprend des motifs comme les bords, les formes, les textures et leurs combinaisons.

## Comment il apprend (entraînement)

Pendant l'entraînement, il répète ce cycle plusieurs fois :
1. **Forward pass** : l'entrée passe dans le réseau et produit des scores de classe.
2. **Comparer avec la bonne réponse** : on calcule une erreur (loss).
3. **Backpropagation** : on trouve quelles connexions ont le plus contribué à l'erreur.
4. **Mettre à jour les poids** : on ajuste un peu les connexions pour réduire l'erreur future.

Après beaucoup d'exemples, les prédictions s'améliorent en général.

## Confiance (probabilité de base)

À la fin, le modèle a un score par classe.  
Pour convertir les scores en probabilités qui font 100% au total, les réseaux de neurones utilisent souvent **Softmax**.

Pas à pas (exemple) :
1. Scores de la couche de sortie :
   - `Chat = 3.0`
   - `Chien = 1.0`
   - `Oiseau = 0.0`
2. Softmax transforme cela en probabilités :
   - `P(Chat) = 84%`
   - `P(Chien) = 11%`
   - `P(Oiseau) = 5%`
3. Choisir la probabilité la plus grande :
   - Prédiction : **Chat** avec **84% de confiance**.

Important : la confiance est une estimation, pas une garantie.

## Pourquoi c'est utile

- Peut apprendre des motifs complexes
- Fonctionne bien avec les images, le texte et le son
- Peut beaucoup progresser avec plus de données

## Exemple visuel

<svg width="760" height="420" viewBox="0 0 760 420" xmlns="http://www.w3.org/2000/svg">
  <rect width="760" height="420" fill="#f7f9fc"/>
  <text x="24" y="34" font-family="Arial, sans-serif" font-size="24" fill="#1f2937">Réseau de neurones : de l'entrée aux probabilités</text>

  <rect x="30" y="80" width="180" height="180" rx="12" fill="#e0f2fe" stroke="#0284c7"/>
  <text x="50" y="110" font-family="Arial, sans-serif" font-size="16" fill="#0c4a6e">Entrée</text>
  <text x="50" y="138" font-family="Arial, sans-serif" font-size="14" fill="#075985">Caractéristiques d'image</text>
  <text x="50" y="160" font-family="Arial, sans-serif" font-size="14" fill="#075985">bords, formes...</text>

  <line x1="210" y1="170" x2="290" y2="170" stroke="#64748b" stroke-width="3"/>
  <polygon points="290,170 280,164 280,176" fill="#64748b"/>

  <rect x="300" y="80" width="180" height="180" rx="12" fill="#fff7ed" stroke="#ea580c"/>
  <text x="320" y="110" font-family="Arial, sans-serif" font-size="16" fill="#9a3412">Couches cachées</text>
  <text x="320" y="138" font-family="Arial, sans-serif" font-size="14" fill="#7c2d12">combinent les motifs</text>
  <text x="320" y="160" font-family="Arial, sans-serif" font-size="14" fill="#7c2d12">et calculent des scores</text>

  <line x1="480" y1="170" x2="560" y2="170" stroke="#64748b" stroke-width="3"/>
  <polygon points="560,170 550,164 550,176" fill="#64748b"/>

  <rect x="570" y="60" width="160" height="240" rx="12" fill="#ecfeff" stroke="#0891b2"/>
  <text x="588" y="90" font-family="Arial, sans-serif" font-size="16" fill="#164e63">Sortie</text>
  <text x="588" y="124" font-family="Arial, sans-serif" font-size="14" fill="#0e7490">Chat : 84%</text>
  <text x="588" y="152" font-family="Arial, sans-serif" font-size="14" fill="#0e7490">Chien : 11%</text>
  <text x="588" y="180" font-family="Arial, sans-serif" font-size="14" fill="#0e7490">Oiseau : 5%</text>
  <text x="588" y="220" font-family="Arial, sans-serif" font-size="16" fill="#0e7490">Prédiction :</text>
  <text x="588" y="244" font-family="Arial, sans-serif" font-size="18" fill="#166534">CHAT</text>
</svg>
