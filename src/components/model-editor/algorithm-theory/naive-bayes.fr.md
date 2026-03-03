# Naive Bayes

Naive Bayes est un algorithme de classification qui utilise la **probabilité** pour décider quelle classe est la plus probable.

Il se demande :
- "Si cet exemple appartient à la classe A, quelle est la probabilité de ces caractéristiques ?"
- "S'il appartient à la classe B, quelle est la probabilité de ces caractéristiques ?"

Ensuite, il compare les scores et choisit la classe avec la probabilité la plus élevée.

Le mot **"naive"** signifie qu'il suppose les caractéristiques indépendantes (chaque caractéristique contribue séparément).
Cette hypothèse n'est pas toujours vraie, mais l'algorithme fonctionne très bien dans beaucoup de tâches réelles.

## Intuition simple (exemple de filtre anti-spam)

Imaginons que l'on veuille classer un message comme :
- **Spam**
- **Non spam**

Et que l'on regarde des mots comme : `free`, `win`, `meeting`.

Si un message contient "free win", ces mots sont beaucoup plus fréquents dans le spam, donc Naive Bayes donne une probabilité de spam plus élevée.

## Confiance (probabilité de base)

Naive Bayes calcule un score pour chaque classe, puis transforme ces scores en probabilités.

Pour chaque classe, il fait :

**Score(classe) = P(classe) x P(caractéristique1|classe) x P(caractéristique2|classe) x ...**

Puis il normalise :

**Probabilité(classe) = Score(classe) / (somme de tous les scores de classe)**

Pas à pas (message : `"free win"`), avec des comptages simples :
1. Imaginons que les données d'entraînement contiennent :
   - 10 messages spam, 10 messages non spam
   - En spam : `free` apparaît dans 6/10, `win` dans 3/10
   - En non spam : `free` apparaît dans 1/10, `win` dans 2/10
2. Convertir les comptages en probabilités :
   - `P(Spam) = 10/20 = 0.5`
   - `P(Non spam) = 10/20 = 0.5`
   - `P(free|Spam) = 6/10 = 0.6`
   - `P(win|Spam) = 3/10 = 0.3`
   - `P(free|Non spam) = 1/10 = 0.1`
   - `P(win|Non spam) = 2/10 = 0.2`
3. Calculer les scores des classes :
   - `Score(Spam) = 0.5 x 0.6 x 0.3 = 0.09`
   - `Score(Non spam) = 0.5 x 0.1 x 0.2 = 0.01`
4. Additionner les scores :
   - `Total = 0.09 + 0.01 = 0.10`
5. Convertir en probabilités :
   - `P(Spam|message) = 0.09 / 0.10 = 0.90 = 90%`
   - `P(Non spam|message) = 0.01 / 0.10 = 0.10 = 10%`
6. Choisir la probabilité la plus élevée :
   - Prédiction : **Spam** avec **90% de confiance**.

Pourquoi ça marche : l'algorithme compare "quelle classe explique le mieux le même message", puis rééchelonne pour que les probabilités fassent 100%.
Les scores peuvent être petits, car on multiplie des probabilités. C'est normal.

## Pourquoi c'est utile

- Très rapide à entraîner et à prédire
- Fonctionne bien pour la classification de texte
- Bon modèle de base pour commencer

## Exemple visuel

<svg width="760" height="420" viewBox="0 0 760 420" xmlns="http://www.w3.org/2000/svg">
  <rect width="760" height="420" fill="#f7f9fc"/>
  <text x="24" y="34" font-family="Arial, sans-serif" font-size="24" fill="#1f2937">Naive Bayes : classification basée sur la probabilité</text>

  <rect x="30" y="70" width="300" height="90" rx="12" fill="#e0f2fe" stroke="#0284c7"/>
  <text x="45" y="100" font-family="Arial, sans-serif" font-size="15" fill="#0c4a6e">Message :</text>
  <text x="45" y="125" font-family="Arial, sans-serif" font-size="18" fill="#0c4a6e">"free win"</text>
  <text x="45" y="146" font-family="Arial, sans-serif" font-size="13" fill="#075985">Caractéristiques : free, win</text>

  <line x1="340" y1="115" x2="420" y2="115" stroke="#64748b" stroke-width="3"/>
  <polygon points="420,115 410,109 410,121" fill="#64748b"/>

  <rect x="440" y="70" width="280" height="120" rx="12" fill="#fff7ed" stroke="#ea580c"/>
  <text x="455" y="98" font-family="Arial, sans-serif" font-size="18" fill="#9a3412">Classe : Spam</text>
  <text x="455" y="124" font-family="Arial, sans-serif" font-size="14" fill="#7c2d12">P(caract. | Spam) = élevée</text>
  <text x="455" y="148" font-family="Arial, sans-serif" font-size="16" fill="#7c2d12">Score = 0.09</text>
  <text x="455" y="172" font-family="Arial, sans-serif" font-size="16" fill="#7c2d12">Confiance = 90%</text>

  <rect x="440" y="220" width="280" height="120" rx="12" fill="#ecfeff" stroke="#0891b2"/>
  <text x="455" y="248" font-family="Arial, sans-serif" font-size="18" fill="#164e63">Classe : Non spam</text>
  <text x="455" y="274" font-family="Arial, sans-serif" font-size="14" fill="#0e7490">P(caract. | Non spam) = plus faible</text>
  <text x="455" y="298" font-family="Arial, sans-serif" font-size="16" fill="#0e7490">Score = 0.01</text>
  <text x="455" y="322" font-family="Arial, sans-serif" font-size="16" fill="#0e7490">Confiance = 10%</text>

  <rect x="30" y="240" width="360" height="100" rx="12" fill="#dcfce7" stroke="#16a34a"/>
  <text x="50" y="278" font-family="Arial, sans-serif" font-size="18" fill="#166534">Prédiction : SPAM</text>
  <text x="50" y="305" font-family="Arial, sans-serif" font-size="16" fill="#166534">car 90% &gt; 10%</text>
</svg>
