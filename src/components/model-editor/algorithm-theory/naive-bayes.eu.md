# Naive Bayes

Naive Bayes sailkapen algoritmo bat da, eta **probabilitatea** erabiltzen du zein klase den probableena erabakitzeko.

Galdera hauek egiten ditu:
- "Adibide hau A klasekoa bada, zein da ezaugarri hauen probabilitatea?"
- "B klasekoa bada, zein da ezaugarri hauen probabilitatea?"

Ondoren, puntuazioak alderatzen ditu eta probabilitate handiena duen klasea aukeratzen du.

**"naive"** hitzak esan nahi du ezaugarriak independenteak direla suposatzen duela (ezaugarri bakoitzak bere aldetik laguntzen du).
Suposizio hori ez da beti egia, baina algoritmoak oso ondo funtzionatzen du benetako zeregin askotan.

## Intuizio sinplea (spam iragazkiaren adibidea)

Imajinatu mezu bat honela sailkatu nahi dugula:
- **Spam**
- **Ez spam**

Eta hitz hauek begiratzen ditugula: `free`, `win`, `meeting`.

Mezu batek "free win" badu, hitz horiek askoz ohikoagoak dira spamean; beraz, Naive Bayesek spam probabilitate handiagoa ematen du.

## Konfiantza (oinarrizko probabilitatea)

Naive Bayesek klase bakoitzerako score bat kalkulatzen du, eta gero score horiek probabilitate bihurtzen ditu.

Klase bakoitzerako hau egiten du:

**Score(klasea) = P(klasea) x P(ezaugarria1|klasea) x P(ezaugarria2|klasea) x ...**

Ondoren normalizatu egiten du:

**Probabilitatea(klasea) = Score(klasea) / (klase score guztien batura)**

Urratsez urrats (mezua: `"free win"`), zenbaketa sinpleekin:
1. Imajinatu entrenamendu datuek hau dutela:
   - 10 spam mezu, 10 ez-spam mezu
   - Spamean: `free` 6/10ean agertzen da, `win` 3/10ean
   - Ez-spamean: `free` 1/10ean agertzen da, `win` 2/10ean
2. Zenbaketak probabilitate bihurtu:
   - `P(Spam) = 10/20 = 0.5`
   - `P(Ez spam) = 10/20 = 0.5`
   - `P(free|Spam) = 6/10 = 0.6`
   - `P(win|Spam) = 3/10 = 0.3`
   - `P(free|Ez spam) = 1/10 = 0.1`
   - `P(win|Ez spam) = 2/10 = 0.2`
3. Klase scoreak kalkulatu:
   - `Score(Spam) = 0.5 x 0.6 x 0.3 = 0.09`
   - `Score(Ez spam) = 0.5 x 0.1 x 0.2 = 0.01`
4. Scoreak batu:
   - `Total = 0.09 + 0.01 = 0.10`
5. Probabilitate bihurtu:
   - `P(Spam|mezua) = 0.09 / 0.10 = 0.90 = 90%`
   - `P(Ez spam|mezua) = 0.01 / 0.10 = 0.10 = 10%`
6. Handiena aukeratu:
   - Iragarpena: **Spam**, **%90eko konfiantzarekin**.

Horregatik dabil: algoritmoak alderatzen du "zein klasek azaltzen duen hobeto mezu bera", eta gero eskalatzen du probabilitateek %100 eman dezaten.
Score balioak txikiak izan daitezke probabilitateak biderkatzen ditugulako, eta hori normala da.

## Zergatik den erabilgarria

- Oso azkar entrenatzeko eta iragartzeko
- Testu sailkapenean ondo funtzionatzen du
- Hasteko oinarrizko eredu ona

## Adibide bisuala

<svg width="760" height="420" viewBox="0 0 760 420" xmlns="http://www.w3.org/2000/svg">
  <rect width="760" height="420" fill="#f7f9fc"/>
  <text x="24" y="34" font-family="Arial, sans-serif" font-size="24" fill="#1f2937">Naive Bayes: probabilitatean oinarritutako sailkapena</text>

  <rect x="30" y="70" width="300" height="90" rx="12" fill="#e0f2fe" stroke="#0284c7"/>
  <text x="45" y="100" font-family="Arial, sans-serif" font-size="15" fill="#0c4a6e">Mezua:</text>
  <text x="45" y="125" font-family="Arial, sans-serif" font-size="18" fill="#0c4a6e">"free win"</text>
  <text x="45" y="146" font-family="Arial, sans-serif" font-size="13" fill="#075985">Ezaugarriak: free, win</text>

  <line x1="340" y1="115" x2="420" y2="115" stroke="#64748b" stroke-width="3"/>
  <polygon points="420,115 410,109 410,121" fill="#64748b"/>

  <rect x="440" y="70" width="280" height="120" rx="12" fill="#fff7ed" stroke="#ea580c"/>
  <text x="455" y="98" font-family="Arial, sans-serif" font-size="18" fill="#9a3412">Klasea: Spam</text>
  <text x="455" y="124" font-family="Arial, sans-serif" font-size="14" fill="#7c2d12">P(ezaug. | Spam) = handia</text>
  <text x="455" y="148" font-family="Arial, sans-serif" font-size="16" fill="#7c2d12">Score = 0.09</text>
  <text x="455" y="172" font-family="Arial, sans-serif" font-size="16" fill="#7c2d12">Konfiantza = 90%</text>

  <rect x="440" y="220" width="280" height="120" rx="12" fill="#ecfeff" stroke="#0891b2"/>
  <text x="455" y="248" font-family="Arial, sans-serif" font-size="18" fill="#164e63">Klasea: Ez spam</text>
  <text x="455" y="274" font-family="Arial, sans-serif" font-size="14" fill="#0e7490">P(ezaug. | Ez spam) = txikiagoa</text>
  <text x="455" y="298" font-family="Arial, sans-serif" font-size="16" fill="#0e7490">Score = 0.01</text>
  <text x="455" y="322" font-family="Arial, sans-serif" font-size="16" fill="#0e7490">Konfiantza = 10%</text>

  <rect x="30" y="240" width="360" height="100" rx="12" fill="#dcfce7" stroke="#16a34a"/>
  <text x="50" y="278" font-family="Arial, sans-serif" font-size="18" fill="#166534">Iragarpena: SPAM</text>
  <text x="50" y="305" font-family="Arial, sans-serif" font-size="16" fill="#166534">90% &gt; 10% delako</text>
</svg>
