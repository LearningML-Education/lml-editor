# Neural network

Sare neuronal bat eredu bat da, eta ereduak ikasten ditu kalkulu sinple asko konbinatuz.

Pentsatu erabaki-unitate txikien geruzetan (neuronak):
- **Sarrerako geruzak** datuak jasotzen ditu.
- **Ezkutuko geruza** batek edo gehiagok eredu erabilgarriak bilatzen dituzte.
- **Irteerako geruzak** puntuazio bat ematen du klase bakoitzerako.

## Intuizio sinplea (irudien sailkapen adibidea)

Imajinatu irudi bat honela sailkatu nahi dugula:
- **Katua**
- **Txakurra**
- **Txoria**

Sareak ez du argazki zehatz bat memorizatzen.  
Ereduak ikasten ditu: ertzak, formak, testurak eta horien konbinazioak.

## Nola ikasten duen (entrenamendua)

Entrenamenduan, ziklo hau askotan errepikatzen du:
1. **Forward pass**: sarrera sarean zehar pasatzen da eta klase-puntuazioak sortzen ditu.
2. **Erantzun zuzenarekin alderatu**: errorea kalkulatzen da (loss).
3. **Backpropagation**: errorean gehien lagundu duten konexioak aurkitzen dira.
4. **Pisuak eguneratu**: konexioak pixka bat doitzen dira etorkizuneko errorea murrizteko.

Adibide asko ikusita, iragarpenak normalean hobetzen dira.

## Konfiantza (oinarrizko probabilitatea)

Amaieran, ereduak puntuazio bat dauka klase bakoitzerako.  
Puntuazioak %100era batzen diren probabilitate bihurtzeko, sare neuronalek maiz **Softmax** erabiltzen dute.

Urratsez urrats (adibidea):
1. Irteerako geruzaren puntuazioak:
   - `Katua = 3.0`
   - `Txakurra = 1.0`
   - `Txoria = 0.0`
2. Softmaxek probabilitate bihurtzen ditu:
   - `P(Katua) = 84%`
   - `P(Txakurra) = 11%`
   - `P(Txoria) = 5%`
3. Probabilitate handiena aukeratu:
   - Iragarpena: **Katua**, **%84ko konfiantzarekin**.

Garrantzitsua: konfiantza estimazio bat da, ez bermea.

## Zergatik den erabilgarria

- Eredu konplexuak ikas ditzake
- Ondo dabil irudiekin, testuarekin eta soinuarekin
- Asko hobetu daiteke datu gehiagorekin

## Adibide bisuala

<svg width="760" height="420" viewBox="0 0 760 420" xmlns="http://www.w3.org/2000/svg">
  <rect width="760" height="420" fill="#f7f9fc"/>
  <text x="24" y="34" font-family="Arial, sans-serif" font-size="24" fill="#1f2937">Sare neuronala: sarreratik probabilitateetara</text>

  <rect x="30" y="80" width="180" height="180" rx="12" fill="#e0f2fe" stroke="#0284c7"/>
  <text x="50" y="110" font-family="Arial, sans-serif" font-size="16" fill="#0c4a6e">Sarrera</text>
  <text x="50" y="138" font-family="Arial, sans-serif" font-size="14" fill="#075985">Irudiaren ezaugarriak</text>
  <text x="50" y="160" font-family="Arial, sans-serif" font-size="14" fill="#075985">ertzak, formak...</text>

  <line x1="210" y1="170" x2="290" y2="170" stroke="#64748b" stroke-width="3"/>
  <polygon points="290,170 280,164 280,176" fill="#64748b"/>

  <rect x="300" y="80" width="180" height="180" rx="12" fill="#fff7ed" stroke="#ea580c"/>
  <text x="320" y="110" font-family="Arial, sans-serif" font-size="16" fill="#9a3412">Ezkutuko geruzak</text>
  <text x="320" y="138" font-family="Arial, sans-serif" font-size="14" fill="#7c2d12">ereduak konbinatzen dituzte</text>
  <text x="320" y="160" font-family="Arial, sans-serif" font-size="14" fill="#7c2d12">eta puntuazioak kalkulatzen dituzte</text>

  <line x1="480" y1="170" x2="560" y2="170" stroke="#64748b" stroke-width="3"/>
  <polygon points="560,170 550,164 550,176" fill="#64748b"/>

  <rect x="570" y="60" width="160" height="240" rx="12" fill="#ecfeff" stroke="#0891b2"/>
  <text x="588" y="90" font-family="Arial, sans-serif" font-size="16" fill="#164e63">Irteera</text>
  <text x="588" y="124" font-family="Arial, sans-serif" font-size="14" fill="#0e7490">Katua: 84%</text>
  <text x="588" y="152" font-family="Arial, sans-serif" font-size="14" fill="#0e7490">Txakurra: 11%</text>
  <text x="588" y="180" font-family="Arial, sans-serif" font-size="14" fill="#0e7490">Txoria: 5%</text>
  <text x="588" y="220" font-family="Arial, sans-serif" font-size="16" fill="#0e7490">Iragarpena:</text>
  <text x="588" y="244" font-family="Arial, sans-serif" font-size="18" fill="#166534">KATUA</text>
</svg>
