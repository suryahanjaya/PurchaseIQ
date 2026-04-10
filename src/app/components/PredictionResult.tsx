import { CheckCircle2, XCircle, GitBranch, ChevronRight, Clock, TrendingUp } from "lucide-react";
import { FormInputs } from "./InputPanel";

export interface PredictionData {
  prediction: boolean;
  confidence: number;
  rules: string[];
  timestamp: string;
  inputs: FormInputs;
}

interface PredictionResultProps {
  result: PredictionData | null;
  hasRun: boolean;
}

function ConfidenceArc({ value }: { value: number }) {
  const radius = 52;
  const stroke = 8;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;
  const color = value >= 70 ? "#22c55e" : value >= 50 ? "#f59e0b" : "#ef4444";

  return (
    <svg height={radius * 2} width={radius * 2} className="rotate-[-90deg]">
      <circle
        stroke="#f1f5f9"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke={color}
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        style={{ transition: "stroke-dashoffset 1s ease" }}
      />
    </svg>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-12">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
        <GitBranch className="w-8 h-8 text-blue-300" />
      </div>
      <p className="text-slate-600 mb-1" style={{ fontSize: "14px", fontWeight: 600 }}>
        No prediction yet
      </p>
      <p className="text-slate-400 max-w-[200px]" style={{ fontSize: "12px" }}>
        Configure the input parameters and click "Predict Purchase" to see results
      </p>
    </div>
  );
}

function DecisionRule({ rule, index }: { rule: string; index: number }) {
  return (
    <div className="flex items-start gap-2">
      <div className="flex flex-col items-center">
        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
          <span className="text-blue-600" style={{ fontSize: "11px", fontWeight: 700 }}>{index + 1}</span>
        </div>
        <div className="w-px flex-1 bg-blue-100 mt-1 min-h-[8px]" />
      </div>
      <div className="flex-1 pb-2">
        <code className="text-blue-700 bg-blue-50 px-2 py-1 rounded-md" style={{ fontSize: "12px" }}>
          {rule}
        </code>
      </div>
    </div>
  );
}

export function PredictionResult({ result, hasRun }: PredictionResultProps) {
  if (!hasRun || !result) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden h-full">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-500" />
          <span className="text-slate-800" style={{ fontSize: "13px", fontWeight: 700 }}>Prediction Result</span>
        </div>
        <EmptyState />
      </div>
    );
  }

  const { prediction, confidence, rules, timestamp } = result;

  const outcomeColor = prediction ? "#22c55e" : "#ef4444";
  const outcomeBg = prediction ? "bg-emerald-50" : "bg-red-50";
  const outcomeBorder = prediction ? "border-emerald-200" : "border-red-200";
  const outcomeTextColor = prediction ? "text-emerald-700" : "text-red-700";
  const confidenceLabel =
    confidence >= 85 ? "High Confidence" : confidence >= 65 ? "Moderate Confidence" : "Low Confidence";

  const fullRuleText = rules.length > 0
    ? `IF ${rules.join(" AND ")} THEN ${prediction ? "Likely to Purchase" : "Not Likely to Purchase"}`
    : "Default rule applied";

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-500" />
          <span className="text-slate-800" style={{ fontSize: "13px", fontWeight: 700 }}>Prediction Result</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400">
          <Clock className="w-3.5 h-3.5" />
          <span style={{ fontSize: "11px" }}>{timestamp}</span>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Main outcome */}
        <div className={`rounded-xl border ${outcomeBg} ${outcomeBorder} p-4 flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            {prediction ? (
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            ) : (
              <XCircle className="w-8 h-8 text-red-400" />
            )}
            <div>
              <p className={`${outcomeTextColor}`} style={{ fontSize: "16px", fontWeight: 800, lineHeight: "1.2" }}>
                {prediction ? "Likely to Purchase" : "Not Likely to Purchase"}
              </p>
              <p className={`${outcomeTextColor} opacity-70`} style={{ fontSize: "11px", marginTop: "2px" }}>
                Decision Tree Classification Result
              </p>
            </div>
          </div>

          {/* Confidence ring */}
          <div className="relative flex items-center justify-center">
            <ConfidenceArc value={confidence} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span style={{ fontSize: "16px", fontWeight: 800, color: outcomeColor, lineHeight: "1" }}>
                {confidence}%
              </span>
              <span className="text-slate-400" style={{ fontSize: "9px", fontWeight: 600, lineHeight: "1.2" }}>
                conf.
              </span>
            </div>
          </div>
        </div>

        {/* Confidence breakdown */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600" style={{ fontSize: "12px", fontWeight: 600 }}>Confidence Score</span>
            <span className="px-2 py-0.5 rounded-full" style={{
              fontSize: "11px",
              fontWeight: 600,
              background: confidence >= 85 ? "#dcfce7" : confidence >= 65 ? "#fef9c3" : "#fee2e2",
              color: confidence >= 85 ? "#166534" : confidence >= 65 ? "#854d0e" : "#991b1b",
            }}>
              {confidenceLabel}
            </span>
          </div>
          <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${confidence}%`, background: outcomeColor }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-slate-300" style={{ fontSize: "10px" }}>0%</span>
            <span className="text-slate-300" style={{ fontSize: "10px" }}>50%</span>
            <span className="text-slate-300" style={{ fontSize: "10px" }}>100%</span>
          </div>
        </div>

        {/* Probability breakdown */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3">
            <p className="text-emerald-600" style={{ fontSize: "11px", fontWeight: 600 }}>Purchase Prob.</p>
            <p className="text-emerald-700" style={{ fontSize: "20px", fontWeight: 800, lineHeight: "1.2" }}>
              {prediction ? confidence : 100 - confidence}%
            </p>
          </div>
          <div className="bg-red-50 border border-red-100 rounded-xl p-3">
            <p className="text-red-500" style={{ fontSize: "11px", fontWeight: 600 }}>No Purchase Prob.</p>
            <p className="text-red-600" style={{ fontSize: "20px", fontWeight: 800, lineHeight: "1.2" }}>
              {prediction ? 100 - confidence : confidence}%
            </p>
          </div>
        </div>

        {/* Decision rule explanation */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <GitBranch className="w-4 h-4 text-blue-500" />
            <span className="text-slate-800" style={{ fontSize: "12px", fontWeight: 700 }}>Decision Rule Explanation</span>
          </div>

          <div className="bg-slate-900 rounded-xl p-4 mb-3">
            <p className="text-blue-300 mb-1" style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.05em" }}>
              APPLIED RULE
            </p>
            <code className="text-slate-100" style={{ fontSize: "12px", lineHeight: "1.6" }}>
              {fullRuleText}
            </code>
          </div>

          <div className="space-y-1">
            {rules.map((rule, i) => (
              <DecisionRule key={i} rule={rule} index={i} />
            ))}
            <div className="flex items-start gap-2 pt-1">
              <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                style={{ background: prediction ? "#dcfce7" : "#fee2e2" }}>
                <ChevronRight className="w-3.5 h-3.5" style={{ color: prediction ? "#16a34a" : "#dc2626" }} />
              </div>
              <div className="flex-1 pb-1">
                <span
                  className="px-3 py-1 rounded-full"
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    background: prediction ? "#dcfce7" : "#fee2e2",
                    color: prediction ? "#166534" : "#991b1b",
                  }}
                >
                  → {prediction ? "Likely to Purchase" : "Not Likely to Purchase"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Input summary */}
        <div>
          <p className="text-slate-500 mb-2" style={{ fontSize: "11px", fontWeight: 600 }}>Input Summary</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "ProductRel.", value: result.inputs.productRelated },
              { label: "Duration", value: `${result.inputs.productRelatedDuration}s` },
              { label: "PageValues", value: result.inputs.pageValues },
              { label: "BounceRate", value: result.inputs.bounceRates },
              { label: "ExitRate", value: result.inputs.exitRates },
              { label: "Weekend", value: result.inputs.weekend ? "Yes" : "No" },
            ].map((item) => (
              <div key={item.label} className="bg-slate-50 rounded-lg p-2 text-center">
                <p className="text-slate-400" style={{ fontSize: "10px", fontWeight: 600 }}>{item.label}</p>
                <p className="text-slate-700" style={{ fontSize: "13px", fontWeight: 700 }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}