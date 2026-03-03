# KNN

KNN (K-Nearest Neighbors) is an algorithm that classifies new data by looking at the most similar examples.

Imagine you have points from two classes: blue and orange. Each point is a known example.
If a new point appears (green), KNN finds its **K nearest neighbors** (for example, K=3 or K=5) and checks which class appears most often.

- If most neighbors are blue, the new point is classified as blue.
- If most neighbors are orange, the new point is classified as orange.

KNN does not learn a complex formula. It learns by storing examples and comparing distances.
That is why it works well when similar data points are close to each other.

**Key idea:**
Small K = more sensitive decisions (can react to noise).
Large K = more stable decisions (but may miss small patterns).

## Confidence (basic probability)

In KNN, confidence can be estimated in a very simple way:

**Confidence for a class = (neighbors from that class) / K**

If K = 5 and the nearest neighbors are:
- 3 blue
- 2 orange

Then:
- Confidence(blue) = 3/5 = 0.6 = **60%**
- Confidence(orange) = 2/5 = 0.4 = **40%**

So the prediction is **blue**, with **60% confidence**.

This is a great way to practice basic probability: ratio, fraction, decimal, and percentage are all the same idea.

## Visual example

<svg width="720" height="420" viewBox="0 0 720 420" xmlns="http://www.w3.org/2000/svg">
  <rect width="720" height="420" fill="#f7f9fc"/>
  <text x="24" y="36" font-family="Arial, sans-serif" font-size="24" fill="#1f2937">KNN: classify by nearest neighbors (K=5)</text>

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
  <text x="395" y="195" font-family="Arial, sans-serif" font-size="14" fill="#065f46">New point</text>

  <g stroke="#6b7280" stroke-width="2" stroke-dasharray="6 5">
    <line x1="380" y1="200" x2="300" y2="220"/>
    <line x1="380" y1="200" x2="260" y2="160"/>
    <line x1="380" y1="200" x2="510" y2="180"/>
    <line x1="380" y1="200" x2="470" y2="130"/>
    <line x1="380" y1="200" x2="220" y2="200"/>
  </g>

  <rect x="80" y="375" width="14" height="14" fill="#2563eb"/><text x="100" y="387" font-family="Arial, sans-serif" font-size="14" fill="#1f2937">Blue class</text>
  <rect x="220" y="375" width="14" height="14" fill="#f97316"/><text x="240" y="387" font-family="Arial, sans-serif" font-size="14" fill="#1f2937">Orange class</text>
  <rect x="380" y="375" width="14" height="14" fill="#10b981"/><text x="400" y="387" font-family="Arial, sans-serif" font-size="14" fill="#1f2937">Point to classify</text>
</svg>
