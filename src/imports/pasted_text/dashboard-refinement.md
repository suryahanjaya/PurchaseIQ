Refine the existing e-commerce purchase prediction dashboard without changing the current layout, spacing, typography, color system, or component structure.

IMPORTANT CONSTRAINTS:
- Do NOT redesign or rearrange major sections
- Do NOT change existing visual style
- Only ADD new elements as small, well-integrated sections
- Preserve all current UI components and hierarchy
- Maintain a clean, modern, and professional design with strong visual hierarchy
- Avoid visual clutter and excessive elements

-----------------------------------
1. ADD WELCOME + ROLE SELECTION (SEPARATE SCREEN)
-----------------------------------
Create a new entry screen BEFORE the dashboard.

Content:
- Title: "E-commerce Purchase Prediction System"
- Subtitle: "Predict user purchase behavior and support data-driven decisions"
- Two options:
  - Business View
  - Technical View

Design:
- Centered card layout
- Clean spacing and balanced alignment
- Use existing color system and typography
- Maintain modern dashboard style

Optional:
- Technical View requires simple PIN input (visual only)

-----------------------------------
2. ROLE-BASED VISIBILITY (NO LAYOUT CHANGE)
-----------------------------------
Do NOT redesign pages.

Instead:
- Show/hide sections based on selected role

Business View:
- Keep existing screens
- Hide:
  - Model Analysis screen
  - Confusion Matrix
  - ROC Curve
  - Technical metrics

Technical View:
- Show all sections including technical analysis

-----------------------------------
3. ADD DECISION TREE DIAGRAM (BUSINESS VIEW)
-----------------------------------
Insert a NEW section under Prediction Result.

Title:
"Decision Logic (Simplified)"

Add:
- Small tree diagram (2–3 levels max)
- Use clean node boxes with connectors
- Highlight one decision path clearly

Design:
- Minimal, readable structure
- Use subtle color coding:
  - Decision nodes (neutral/blue)
  - Outcome nodes (green/red)

Do NOT include:
- entropy
- gini
- technical metrics

-----------------------------------
4. ADD CONFUSION MATRIX (TECHNICAL VIEW ONLY)
-----------------------------------
Insert into Model Analysis screen.

Add a NEW card below existing metrics.

Title:
"Confusion Matrix"

Content:
- 2x2 grid:
  TP | FP
  FN | TN

Enhancement:
- Use soft heatmap coloring for intensity
- Keep colors subtle and professional

Add small label:
"Actual vs Predicted"

-----------------------------------
5. ADD ROC CURVE (TECHNICAL VIEW)
-----------------------------------
Insert below Confusion Matrix.

Title:
"ROC Curve"

Display:
- X-axis: False Positive Rate
- Y-axis: True Positive Rate
- Model curve line
- Diagonal baseline

Add label:
"AUC Score: 0.89" (example)

Style:
- Thin lines
- Minimal gridlines
- Consistent color palette

-----------------------------------
6. ADD FEATURE IMPORTANCE VISIBILITY
-----------------------------------
If already exists:
- Keep existing chart

Enhance with:
Title:
"Feature Importance"

Subtitle:
"Key factors influencing purchase prediction"

Ensure:
- Clean bar spacing
- Clear labels

-----------------------------------
7. ADD THRESHOLD SLIDER (PREDICTION SCREEN)
-----------------------------------
Insert a small section BELOW prediction result.

Title:
"Prediction Threshold"

Add:
- Slider (default 0.5)

Helper text:
"Adjust threshold to control customer targeting size"

Optional labels:
- Conservative
- Balanced
- Aggressive

-----------------------------------
8. ADD THRESHOLD IMPACT CHART (BUSINESS VIEW)
-----------------------------------
Insert below threshold slider.

Title:
"Threshold vs Target Users"

Display:
- X-axis: Threshold
- Y-axis: Number of selected users

Style:
- Simple line chart
- Clean and minimal

Add note:
"Lower threshold increases campaign size but may reduce precision"

-----------------------------------
9. ADD CAMPAIGN PERFORMANCE (LIGHT SECTION)
-----------------------------------
Insert into Insights screen as a small card.

Title:
"Campaign Performance"

Content:
- Predicted Users
- Actual Conversions
- Conversion Rate

Add small chart:
"Predicted vs Actual Conversions"
- Simple bar chart comparison

-----------------------------------
10. ADD MODEL INFO CLARITY (TEXT ONLY)
-----------------------------------
Update wording only (no layout change):

Replace:
"Model built with scikit-learn"

With:
"Model implemented using custom Decision Tree algorithm (CART)"

-----------------------------------
11. MOBILE RESPONSIVE VERSION (SEPARATE FRAMES)
-----------------------------------
Create separate mobile screens.

Rules:
- Do NOT modify desktop layout
- Stack elements vertically
- Convert tables into list format
- Resize charts proportionally
- Ensure readability and touch-friendly spacing

-----------------------------------
GOAL
-----------------------------------
Enhance model visibility, interpretability, and stakeholder alignment using clean visual charts and structured UI additions without redesigning or breaking the existing layout.