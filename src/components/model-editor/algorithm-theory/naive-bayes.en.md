# Naive-Bayes

# Naive Bayes

Naive Bayes is a classification algorithm that uses **probability** to decide which class is most likely.

It asks:
- "If this example belongs to Class A, how likely are these features?"
- "If it belongs to Class B, how likely are these features?"

Then it compares scores and picks the class with the highest probability.

The word **"naive"** means it assumes features are independent (each feature contributes separately).
That assumption is not always true, but the algorithm still works surprisingly well in many real tasks.

## Simple intuition (spam filter example)

Imagine we want to classify a message as:
- **Spam**
- **Not spam**

And we check words like: `free`, `win`, `meeting`.

If a message says "free win", those words are much more common in spam, so Naive Bayes gives a higher spam probability.

## Confidence (basic probability)

Naive Bayes gives a score per class and we can normalize scores into probabilities.

Example:
- Score(Spam) = 0.72
- Score(Not spam) = 0.28

Then:
- Confidence(Spam) = **72%**
- Confidence(Not spam) = **28%**

Prediction: **Spam** with **72% confidence**.

## Why it is useful

- Very fast to train and predict
- Works well with text classification
- Good baseline model to start with

## Visual example

<svg width="760" height="420" viewBox="0 0 760 420" xmlns="http://www.w3.org/2000/svg">
  <rect width="760" height="420" fill="#f7f9fc"/>
  <text x="24" y="34" font-family="Arial, sans-serif" font-size="24" fill="#1f2937">Naive Bayes: probability-based classification</text>

  <rect x="30" y="70" width="300" height="90" rx="12" fill="#e0f2fe" stroke="#0284c7"/>
  <text x="45" y="100" font-family="Arial, sans-serif" font-size="15" fill="#0c4a6e">Message:</text>
  <text x="45" y="125" font-family="Arial, sans-serif" font-size="18" fill="#0c4a6e">"free win now"</text>
  <text x="45" y="146" font-family="Arial, sans-serif" font-size="13" fill="#075985">Features: free, win, now</text>

  <line x1="340" y1="115" x2="420" y2="115" stroke="#64748b" stroke-width="3"/>
  <polygon points="420,115 410,109 410,121" fill="#64748b"/>

  <rect x="440" y="70" width="280" height="120" rx="12" fill="#fff7ed" stroke="#ea580c"/>
  <text x="455" y="98" font-family="Arial, sans-serif" font-size="18" fill="#9a3412">Class: Spam</text>
  <text x="455" y="124" font-family="Arial, sans-serif" font-size="14" fill="#7c2d12">P(features | Spam) = high</text>
  <text x="455" y="148" font-family="Arial, sans-serif" font-size="16" fill="#7c2d12">Score = 0.72</text>
  <text x="455" y="172" font-family="Arial, sans-serif" font-size="16" fill="#7c2d12">Confidence = 72%</text>

  <rect x="440" y="220" width="280" height="120" rx="12" fill="#ecfeff" stroke="#0891b2"/>
  <text x="455" y="248" font-family="Arial, sans-serif" font-size="18" fill="#164e63">Class: Not spam</text>
  <text x="455" y="274" font-family="Arial, sans-serif" font-size="14" fill="#0e7490">P(features | Not spam) = lower</text>
  <text x="455" y="298" font-family="Arial, sans-serif" font-size="16" fill="#0e7490">Score = 0.28</text>
  <text x="455" y="322" font-family="Arial, sans-serif" font-size="16" fill="#0e7490">Confidence = 28%</text>

  <rect x="30" y="240" width="360" height="100" rx="12" fill="#dcfce7" stroke="#16a34a"/>
  <text x="50" y="278" font-family="Arial, sans-serif" font-size="18" fill="#166534">Prediction: SPAM</text>
  <text x="50" y="305" font-family="Arial, sans-serif" font-size="16" fill="#166534">because 72% &gt; 28%</text>
</svg>
