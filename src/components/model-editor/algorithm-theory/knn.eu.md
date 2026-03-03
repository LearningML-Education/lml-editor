# KNN

KNN (K-Nearest Neighbors) algoritmoak datu berriak sailkatzen ditu antzekoenak diren adibideei begiratuta.

Imajinatu bi klaseko puntuak dituzula: urdina eta laranja. Puntu bakoitza adibide ezagun bat da.
Puntu berri bat agertzen bada (berdea), KNNk bere **K auzokide hurbilenak** bilatzen ditu (adibidez, K=3 edo K=5) eta zein klase agertzen den gehien begiratzen du.

- Auzokide gehienak urdinak badira, puntu berria urdin gisa sailkatzen da.
- Auzokide gehienak laranjak badira, puntu berria laranja gisa sailkatzen da.

KNNk ez du formula konplexurik ikasten. Adibideak gordez eta distantziak alderatuz ikasten du. Horregatik dabil ondo antzeko datuak elkarrengandik gertu daudenean.

**Gako ideia:**
K txikia = erabaki sentikorragoak (zaratari erreakziona dezake).
K handia = erabaki egonkorragoak (baina xehetasunak gal ditzake).

## Konfiantza (oinarrizko probabilitatea)

KNNn, konfiantza oso modu sinplean estima daiteke:

**Klase baten konfiantza = (klase horretako auzokideak) / K**

K = 5 bada eta auzokide hurbilenak hauek badira:
- 3 urdin
- 2 laranja

Orduan:
- Konfiantza(urdina) = 3/5 = 0.6 = **60%**
- Konfiantza(laranja) = 2/5 = 0.4 = **40%**

Iragarpena **urdina** da, **%60ko konfiantzarekin**.

Oinarrizko probabilitatea lantzeko modu ona da: arrazoia, zatikia, hamartarra eta ehunekoa.

## Adibide bisuala

<svg width="720" height="420" viewBox="0 0 720 420" xmlns="http://www.w3.org/2000/svg">
  <rect width="720" height="420" fill="#f7f9fc"/>
  <text x="24" y="36" font-family="Arial, sans-serif" font-size="24" fill="#1f2937">KNN: auzokide hurbilenekin sailkatu (K=5)</text>

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
  <text x="395" y="195" font-family="Arial, sans-serif" font-size="14" fill="#065f46">Puntu berria</text>

  <g stroke="#6b7280" stroke-width="2" stroke-dasharray="6 5">
    <line x1="380" y1="200" x2="300" y2="220"/>
    <line x1="380" y1="200" x2="260" y2="160"/>
    <line x1="380" y1="200" x2="510" y2="180"/>
    <line x1="380" y1="200" x2="470" y2="130"/>
    <line x1="380" y1="200" x2="220" y2="200"/>
  </g>

  <rect x="80" y="375" width="14" height="14" fill="#2563eb"/><text x="100" y="387" font-family="Arial, sans-serif" font-size="14" fill="#1f2937">Klase urdina</text>
  <rect x="220" y="375" width="14" height="14" fill="#f97316"/><text x="240" y="387" font-family="Arial, sans-serif" font-size="14" fill="#1f2937">Klase laranja</text>
  <rect x="380" y="375" width="14" height="14" fill="#10b981"/><text x="400" y="387" font-family="Arial, sans-serif" font-size="14" fill="#1f2937">Sailkatzeko puntua</text>
</svg>
