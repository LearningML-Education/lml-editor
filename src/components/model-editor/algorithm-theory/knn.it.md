# KNN

KNN (K-Nearest Neighbors) è un algoritmo che classifica nuovi dati guardando gli esempi più simili.

Immagina di avere punti di due classi: blu e arancione. Ogni punto è un esempio noto.
Se appare un nuovo punto (verde), KNN trova i suoi **K vicini più vicini** (per esempio K=3 o K=5) e controlla quale classe compare più spesso.

- Se la maggioranza dei vicini è blu, il nuovo punto viene classificato come blu.
- Se la maggioranza dei vicini è arancione, il nuovo punto viene classificato come arancione.

KNN non impara una formula complessa. Impara memorizzando esempi e confrontando distanze. Per questo funziona bene quando i dati simili sono vicini tra loro.

**Idea chiave:**
K piccolo = decisioni più sensibili (può reagire al rumore).
K grande = decisioni più stabili (ma può perdere dettagli).

## Confidenza (probabilità di base)

In KNN, la confidenza può essere stimata in modo molto semplice:

**Confidenza per una classe = (vicini di quella classe) / K**

Se K = 5 e i vicini più vicini sono:
- 3 blu
- 2 arancioni

Allora:
- Confidenza(blu) = 3/5 = 0.6 = **60%**
- Confidenza(arancione) = 2/5 = 0.4 = **40%**

La previsione è **blu**, con **60% di confidenza**.

È un ottimo modo per lavorare sulla probabilità di base: rapporto, frazione, decimale e percentuale.

## Esempio visivo

<svg width="720" height="420" viewBox="0 0 720 420" xmlns="http://www.w3.org/2000/svg">
  <rect width="720" height="420" fill="#f7f9fc"/>
  <text x="24" y="36" font-family="Arial, sans-serif" font-size="24" fill="#1f2937">KNN: classificare con i vicini più vicini (K=5)</text>

  <g stroke="#dbe3ef" stroke-width="1">
    <line x1="80" y1="70" x2="80" y2="360"/><line x1="160" y1="70" x2="160" y2="360"/>
    <line x1="240" y1="70" x2="240" y2="360"/><line x1="320" y1="70" x2="320" y2="360"/>
    <line x1="400" y1="70" x2="400" y2="360"/><line x1="480" y1="70" x2="480" y2="360"/>
    <line x1="560" y1="70" x2="560" y2="360"/><line x1="640" y1="70" x2="640" y2="360"/>
    <line x1="80" y1="70" x2="640" y2="70"/><line x1="80" y1="130" x2="640" y2="130"/>
    <line x1="80" y1="190" x2="640" y2="190"/><line x1="80" y1="250" x2="640" y2="250"/>
    <line x1="80" y1="310" x2="640" y2="310"/><line x1="80" y1="360" x2="640" y2="360"/>
  </g>

  <g fill="#2563eb">
    <circle cx="180" cy="140" r="9"/><circle cx="220" cy="200" r="9"/><circle cx="260" cy="160" r="9"/>
    <circle cx="300" cy="220" r="9"/><circle cx="210" cy="270" r="9"/>
  </g>

  <g fill="#f97316">
    <circle cx="470" cy="130" r="9"/><circle cx="510" cy="180" r="9"/><circle cx="550" cy="140" r="9"/>
    <circle cx="500" cy="250" r="9"/><circle cx="560" cy="220" r="9"/>
  </g>

  <circle cx="380" cy="200" r="10" fill="#10b981" stroke="#065f46" stroke-width="2"/>
  <text x="395" y="195" font-family="Arial, sans-serif" font-size="14" fill="#065f46">Nuovo punto</text>

  <g stroke="#6b7280" stroke-width="2" stroke-dasharray="6 5">
    <line x1="380" y1="200" x2="300" y2="220"/>
    <line x1="380" y1="200" x2="260" y2="160"/>
    <line x1="380" y1="200" x2="510" y2="180"/>
    <line x1="380" y1="200" x2="470" y2="130"/>
    <line x1="380" y1="200" x2="220" y2="200"/>
  </g>

  <rect x="80" y="375" width="14" height="14" fill="#2563eb"/><text x="100" y="387" font-family="Arial, sans-serif" font-size="14" fill="#1f2937">Classe blu</text>
  <rect x="220" y="375" width="14" height="14" fill="#f97316"/><text x="240" y="387" font-family="Arial, sans-serif" font-size="14" fill="#1f2937">Classe arancione</text>
  <rect x="380" y="375" width="14" height="14" fill="#10b981"/><text x="400" y="387" font-family="Arial, sans-serif" font-size="14" fill="#1f2937">Punto da classificare</text>
</svg>
