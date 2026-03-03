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

Naive Bayes computes a score for each class, then turns those scores into probabilities.

For each class, it does:

**Score(class) = P(class) x P(feature1|class) x P(feature2|class) x ...**

Then it normalizes:

**Probability(class) = Score(class) / (sum of all class scores)**

Step by step (message: `"free win"`), with simple counts:
1. Imagine the training data has:
   - 10 spam messages, 10 not-spam messages
   - In spam: `free` appears in 6/10, `win` appears in 3/10
   - In not spam: `free` appears in 1/10, `win` appears in 2/10
2. Convert counts to probabilities:
   - `P(Spam) = 10/20 = 0.5`
   - `P(Not spam) = 10/20 = 0.5`
   - `P(free|Spam) = 6/10 = 0.6`
   - `P(win|Spam) = 3/10 = 0.3`
   - `P(free|Not spam) = 1/10 = 0.1`
   - `P(win|Not spam) = 2/10 = 0.2`
3. Compute class scores:
   - `Score(Spam) = 0.5 x 0.6 x 0.3 = 0.09`
   - `Score(Not spam) = 0.5 x 0.1 x 0.2 = 0.01`
4. Add scores:
   - `Total = 0.09 + 0.01 = 0.10`
5. Convert to probabilities:
   - `P(Spam|message) = 0.09 / 0.10 = 0.90 = 90%`
   - `P(Not spam|message) = 0.01 / 0.10 = 0.10 = 10%`
6. Pick the highest probability:
   - Prediction: **Spam** with **90% confidence**.

Why this works: the algorithm compares "how well each class explains the same message" and then rescales results so probabilities add up to 100%.
The raw score values can be small because we multiply probabilities, but that is normal.

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
  <text x="45" y="125" font-family="Arial, sans-serif" font-size="18" fill="#0c4a6e">"free win"</text>
  <text x="45" y="146" font-family="Arial, sans-serif" font-size="13" fill="#075985">Features: free, win</text>

  <line x1="340" y1="115" x2="420" y2="115" stroke="#64748b" stroke-width="3"/>
  <polygon points="420,115 410,109 410,121" fill="#64748b"/>

  <rect x="440" y="70" width="280" height="120" rx="12" fill="#fff7ed" stroke="#ea580c"/>
  <text x="455" y="98" font-family="Arial, sans-serif" font-size="18" fill="#9a3412">Class: Spam</text>
  <text x="455" y="124" font-family="Arial, sans-serif" font-size="14" fill="#7c2d12">P(features | Spam) = high</text>
  <text x="455" y="148" font-family="Arial, sans-serif" font-size="16" fill="#7c2d12">Score = 0.09</text>
  <text x="455" y="172" font-family="Arial, sans-serif" font-size="16" fill="#7c2d12">Confidence = 90%</text>

  <rect x="440" y="220" width="280" height="120" rx="12" fill="#ecfeff" stroke="#0891b2"/>
  <text x="455" y="248" font-family="Arial, sans-serif" font-size="18" fill="#164e63">Class: Not spam</text>
  <text x="455" y="274" font-family="Arial, sans-serif" font-size="14" fill="#0e7490">P(features | Not spam) = lower</text>
  <text x="455" y="298" font-family="Arial, sans-serif" font-size="16" fill="#0e7490">Score = 0.01</text>
  <text x="455" y="322" font-family="Arial, sans-serif" font-size="16" fill="#0e7490">Confidence = 10%</text>

  <rect x="30" y="240" width="360" height="100" rx="12" fill="#dcfce7" stroke="#16a34a"/>
  <text x="50" y="278" font-family="Arial, sans-serif" font-size="18" fill="#166534">Prediction: SPAM</text>
  <text x="50" y="305" font-family="Arial, sans-serif" font-size="16" fill="#166534">because 90% &gt; 10%</text>
</svg>
