# Neural network

A neural network is a model that learns patterns by combining many simple calculations.

Think of it as layers of tiny decision units (neurons):
- The **input layer** receives data.
- One or more **hidden layers** look for useful patterns.
- The **output layer** gives a score for each class.

## Simple intuition (image classification example)

Imagine we want to classify an image as:
- **Cat**
- **Dog**
- **Bird**

The network does not memorize one exact photo.  
It learns patterns like edges, shapes, textures, and combinations of those patterns.

## How it learns (training)

During training, it repeats this loop many times:
1. **Forward pass**: the input goes through the network and produces class scores.
2. **Compare with the correct answer**: compute an error (loss).
3. **Backpropagation**: find which connections contributed most to the error.
4. **Update weights**: adjust connections a little to reduce future error.

After many examples, predictions usually improve.

## Confidence (basic probability)

At the end, the model has one score per class.  
To convert scores into probabilities that add up to 100%, neural networks often use **Softmax**.

Step by step (example):
1. Output layer scores:
   - `Cat = 3.0`
   - `Dog = 1.0`
   - `Bird = 0.0`
2. Softmax turns these into probabilities:
   - `P(Cat) = 84%`
   - `P(Dog) = 11%`
   - `P(Bird) = 5%`
3. Pick the highest probability:
   - Prediction: **Cat** with **84% confidence**.

Important: confidence is an estimate, not a guarantee.

## Why it is useful

- Can learn complex patterns
- Works well with images, text, and sound
- Can improve a lot with more data

## Visual example

<svg width="760" height="420" viewBox="0 0 760 420" xmlns="http://www.w3.org/2000/svg">
  <rect width="760" height="420" fill="#f7f9fc"/>
  <text x="24" y="34" font-family="Arial, sans-serif" font-size="24" fill="#1f2937">Neural network: from input to probabilities</text>

  <rect x="30" y="80" width="180" height="180" rx="12" fill="#e0f2fe" stroke="#0284c7"/>
  <text x="50" y="110" font-family="Arial, sans-serif" font-size="16" fill="#0c4a6e">Input</text>
  <text x="50" y="138" font-family="Arial, sans-serif" font-size="14" fill="#075985">Image features</text>
  <text x="50" y="160" font-family="Arial, sans-serif" font-size="14" fill="#075985">edges, shapes...</text>

  <line x1="210" y1="170" x2="290" y2="170" stroke="#64748b" stroke-width="3"/>
  <polygon points="290,170 280,164 280,176" fill="#64748b"/>

  <rect x="300" y="80" width="180" height="180" rx="12" fill="#fff7ed" stroke="#ea580c"/>
  <text x="320" y="110" font-family="Arial, sans-serif" font-size="16" fill="#9a3412">Hidden layers</text>
  <text x="320" y="138" font-family="Arial, sans-serif" font-size="14" fill="#7c2d12">combine patterns</text>
  <text x="320" y="160" font-family="Arial, sans-serif" font-size="14" fill="#7c2d12">and compute scores</text>

  <line x1="480" y1="170" x2="560" y2="170" stroke="#64748b" stroke-width="3"/>
  <polygon points="560,170 550,164 550,176" fill="#64748b"/>

  <rect x="570" y="60" width="160" height="240" rx="12" fill="#ecfeff" stroke="#0891b2"/>
  <text x="588" y="90" font-family="Arial, sans-serif" font-size="16" fill="#164e63">Output</text>
  <text x="588" y="124" font-family="Arial, sans-serif" font-size="14" fill="#0e7490">Cat: 84%</text>
  <text x="588" y="152" font-family="Arial, sans-serif" font-size="14" fill="#0e7490">Dog: 11%</text>
  <text x="588" y="180" font-family="Arial, sans-serif" font-size="14" fill="#0e7490">Bird: 5%</text>
  <text x="588" y="220" font-family="Arial, sans-serif" font-size="16" fill="#0e7490">Prediction:</text>
  <text x="588" y="244" font-family="Arial, sans-serif" font-size="18" fill="#166534">CAT</text>
</svg>
