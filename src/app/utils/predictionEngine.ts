import { FormInputs } from "../components/InputPanel";
import { PredictionData } from "../components/PredictionResult";

/**
 * Simulates a Decision Tree prediction model for e-commerce purchase intent.
 * Based on the Online Shoppers Purchasing Intention Dataset logic.
 */
export function runPrediction(inputs: FormInputs): PredictionData {
  const { pageValues, bounceRates, exitRates, productRelated, visitorType, weekend } = inputs;

  const rules: string[] = [];
  let score = 0;

  // Node 1: PageValues threshold (highest importance feature)
  if (pageValues > 50) {
    score += 38;
    rules.push(`PageValues (${pageValues}) > 50`);
  } else if (pageValues > 20) {
    score += 18;
    rules.push(`PageValues (${pageValues}) > 20`);
  } else {
    rules.push(`PageValues (${pageValues}) ≤ 20`);
  }

  // Node 2: BounceRates threshold
  if (bounceRates < 0.02) {
    score += 25;
    rules.push(`BounceRates (${bounceRates}) < 0.02`);
  } else if (bounceRates < 0.05) {
    score += 12;
    rules.push(`BounceRates (${bounceRates}) < 0.05`);
  } else {
    score -= 10;
    rules.push(`BounceRates (${bounceRates}) ≥ 0.05`);
  }

  // Node 3: ExitRates threshold
  if (exitRates < 0.04) {
    score += 18;
    rules.push(`ExitRates (${exitRates}) < 0.04`);
  } else if (exitRates < 0.08) {
    score += 8;
  } else {
    score -= 8;
  }

  // Node 4: ProductRelated pages
  if (productRelated > 15) {
    score += 12;
    rules.push(`ProductRelated (${productRelated}) > 15`);
  } else if (productRelated > 5) {
    score += 6;
  }

  // Node 5: Visitor type
  if (visitorType === "Returning_Visitor") {
    score += 7;
  }

  // Node 6: Weekend penalty (slight)
  if (weekend) {
    score -= 3;
  }

  // Normalize score to confidence percentage
  // Score range roughly: -18 to +100 → map to 25% - 97%
  const normalized = Math.max(25, Math.min(97, 25 + ((score + 18) / 118) * 72));
  const confidence = Math.round(normalized);
  const prediction = confidence >= 58;

  const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  return {
    prediction,
    confidence,
    rules: rules.slice(0, 3), // Show top 3 rules
    timestamp,
    inputs,
  };
}
