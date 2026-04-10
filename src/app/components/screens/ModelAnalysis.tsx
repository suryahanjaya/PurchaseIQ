import { useState } from "react";
import { useNavigate, Navigate } from "react-router";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, LineChart, Line, ReferenceLine,
} from "recharts";
import {
  FlaskConical, BarChart2, GitBranch, CheckCircle2, AlertCircle,
  ArrowRight, ChevronRight, Info, Target, Layers, Shuffle,
  TrendingUp, FileText, SplitSquareHorizontal, Sliders, Database, AlertTriangle, Settings2,
} from "lucide-react";
import { useSession } from "../../context/SessionContext";

/* ── DATA ─────────────────────────────────── */

const perfMetrics = [
  { label: "Accuracy",  value: 87.4, color: "#22C55E", desc: "Overall correct classifications" },
  { label: "Precision", value: 83.2, color: "#3B82F6", desc: "Predicted positives that are correct" },
  { label: "Recall",    value: 79.6, color: "#7C3AED", desc: "Actual positives correctly identified" },
  { label: "F1 Score",  value: 81.3, color: "#F59E0B", desc: "Harmonic mean of precision & recall" },
  { label: "AUC-ROC",   value: 84.0, color: "#06B6D4", desc: "Discriminatory ability of the model" },
];

// Confusion matrix values (derived from stated metrics, test set = 2,466)
const confMatrix = {
  TP: 679,   // True Purchase
  FP: 137,   // False Purchase
  FN: 174,   // Missed Purchase
  TN: 1476,  // True No-Purchase
};

const featureData = [
  { name: "Page Value",    key: "page_value",    importance: 38.4, color: "#3B82F6", desc: "Strongest predictor of purchase intent" },
  { name: "Bounce Rate",   key: "bounce_rate",   importance: 27.1, color: "#7C3AED", desc: "Inversely correlated with conversion" },
  { name: "Exit Rate",     key: "exit_rate",     importance: 19.8, color: "#059669", desc: "High exit = low purchase likelihood" },
  { name: "Product Views", key: "product_views", importance: 14.7, color: "#D97706", desc: "Session engagement indicator" },
];

// Approximate ROC curve points (AUC ≈ 0.84)
const rocData = [
  { fpr: 0,    model: 0,    baseline: 0    },
  { fpr: 0.03, model: 0.40, baseline: 0.03 },
  { fpr: 0.06, model: 0.58, baseline: 0.06 },
  { fpr: 0.10, model: 0.70, baseline: 0.10 },
  { fpr: 0.15, model: 0.78, baseline: 0.15 },
  { fpr: 0.20, model: 0.82, baseline: 0.20 },
  { fpr: 0.30, model: 0.87, baseline: 0.30 },
  { fpr: 0.40, model: 0.90, baseline: 0.40 },
  { fpr: 0.50, model: 0.93, baseline: 0.50 },
  { fpr: 0.70, model: 0.96, baseline: 0.70 },
  { fpr: 0.90, model: 0.98, baseline: 0.90 },
  { fpr: 1.00, model: 1.00, baseline: 1.00 },
];

const decisionPaths = [
  {
    id: "path-buy",
    outcome: "purchase",
    outcomeLabel: "Likely to Purchase",
    confidence: 85,
    rules: [
      { feature: "Page Value",   op: ">", threshold: "50",   actual: "68.4",  met: true },
      { feature: "Bounce Rate",  op: "<", threshold: "0.02", actual: "0.015", met: true },
      { feature: "Exit Rate",    op: "<", threshold: "0.04", actual: "0.032", met: true },
    ],
    nodeDepth: 3,
    leafSamples: "1,204",
  },
  {
    id: "path-nobuy",
    outcome: "no-purchase",
    outcomeLabel: "Unlikely to Purchase",
    confidence: 72,
    rules: [
      { feature: "Page Value",  op: "≤", threshold: "50",  actual: "12.3", met: true },
      { feature: "Bounce Rate", op: "≥", threshold: "0.05", actual: "0.08", met: true },
    ],
    nodeDepth: 2,
    leafSamples: "3,842",
  },
];

/* ── HYPERPARAMETER SIMULATION DATA ─────────────────────── */
type MetricSet = { acc: number; prec: number; rec: number; f1: number; auc: number };
const depthMetrics: Record<number, MetricSet> = {
  1:  { acc: 72.1, prec: 64.8, rec: 57.3, f1: 60.8, auc: 68.2 },
  2:  { acc: 79.3, prec: 74.1, rec: 70.8, f1: 72.4, auc: 74.9 },
  3:  { acc: 83.2, prec: 79.4, rec: 75.9, f1: 77.6, auc: 79.5 },
  4:  { acc: 86.1, prec: 81.8, rec: 78.2, f1: 79.9, auc: 82.3 },
  5:  { acc: 87.4, prec: 83.2, rec: 79.6, f1: 81.3, auc: 84.0 },
  6:  { acc: 88.0, prec: 84.0, rec: 81.0, f1: 82.5, auc: 85.1 },
  7:  { acc: 88.2, prec: 84.1, rec: 82.0, f1: 83.0, auc: 85.6 },
  8:  { acc: 88.0, prec: 83.6, rec: 82.5, f1: 83.0, auc: 85.4 },
  9:  { acc: 87.5, prec: 83.0, rec: 83.0, f1: 83.0, auc: 85.1 },
  10: { acc: 87.0, prec: 82.5, rec: 83.4, f1: 82.9, auc: 84.8 },
};
const giniBias: MetricSet = { acc: -0.5, prec: -0.8, rec: 0.3, f1: -0.4, auc: -0.6 };

/* ── DATA QUALITY / CLASS IMBALANCE ────────────────────── */
const classDistribution = [
  { label: "No Purchase", count: 10422, pct: 84.5, color: "#EF4444", bg: "#FEF2F2", border: "#FECACA" },
  { label: "Purchase",    count: 1908,  pct: 15.5, color: "#22C55E", bg: "#ECFDF5", border: "#A7F3D0" },
];
const dataQualityRows = [
  { label: "Total Samples",        value: "12,330",  status: "info",  color: "#3B82F6" },
  { label: "Missing Values",       value: "0",       status: "good",  color: "#22C55E" },
  { label: "Duplicate Entries",    value: "0",       status: "good",  color: "#22C55E" },
  { label: "Feature Completeness", value: "100%",    status: "good",  color: "#22C55E" },
  { label: "Class Imbalance Ratio",value: "5.46 : 1",status: "warn",  color: "#F59E0B" },
  { label: "Total Features",       value: "18",      status: "info",  color: "#7C3AED" },
];

/* ── CUSTOM TOOLTIP ─────────────────────── */
const FeatureTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    const d = featureData.find((f) => f.name === label);
    return (
      <div className="bg-slate-900 px-4 py-3 rounded-xl shadow-xl">
        <p className="text-slate-300 mb-1" style={{ fontSize: "11px", fontWeight: 600 }}>{label}</p>
        <p className="text-white" style={{ fontSize: "16px", fontWeight: 800 }}>{payload[0].value.toFixed(1)}%</p>
        {d && <p className="text-slate-400 mt-1" style={{ fontSize: "11px" }}>{d.desc}</p>}
      </div>
    );
  }
  return null;
};

const RocTooltip = ({ active, payload }: any) => {
  if (active && payload?.length && payload[0].dataKey === "model") {
    return (
      <div className="bg-slate-900 px-3 py-2 rounded-lg shadow-xl">
        <p className="text-slate-300" style={{ fontSize: "10px" }}>FPR: {(payload[0].payload.fpr * 100).toFixed(0)}%</p>
        <p className="text-white" style={{ fontSize: "13px", fontWeight: 700 }}>TPR: {(payload[0].value * 100).toFixed(0)}%</p>
      </div>
    );
  }
  return null;
};

/* ── CONFUSION MATRIX ──────────────────── */
function ConfusionMatrix() {
  const total = confMatrix.TP + confMatrix.FP + confMatrix.FN + confMatrix.TN;
  const cells = [
    { key: "TP", label: "True Positive",  value: confMatrix.TP, pct: ((confMatrix.TP / total) * 100).toFixed(1), desc: "Correctly predicted purchase",    color: "#22C55E", bg: "#ECFDF5", border: "#A7F3D0", icon: CheckCircle2, row: "Purchase",    col: "Purchase" },
    { key: "FP", label: "False Positive", value: confMatrix.FP, pct: ((confMatrix.FP / total) * 100).toFixed(1), desc: "Predicted purchase, no purchase", color: "#EF4444", bg: "#FEF2F2", border: "#FECACA", icon: AlertCircle,  row: "Purchase",    col: "No Purchase" },
    { key: "FN", label: "False Negative", value: confMatrix.FN, pct: ((confMatrix.FN / total) * 100).toFixed(1), desc: "Predicted no purchase, bought",   color: "#F59E0B", bg: "#FFFBEB", border: "#FDE68A", icon: AlertCircle,  row: "No Purchase", col: "Purchase" },
    { key: "TN", label: "True Negative",  value: confMatrix.TN, pct: ((confMatrix.TN / total) * 100).toFixed(1), desc: "Correctly predicted no purchase",  color: "#22C55E", bg: "#ECFDF5", border: "#A7F3D0", icon: CheckCircle2, row: "No Purchase", col: "No Purchase" },
  ];

  return (
    <div>
      {/* Column headers */}
      <div className="flex mb-2">
        <div style={{ width: "120px" }} />
        <div className="flex-1 text-center">
          <span className="text-slate-500 uppercase tracking-widest" style={{ fontSize: "10px", fontWeight: 700 }}>
            Predicted: Purchase
          </span>
        </div>
        <div className="flex-1 text-center">
          <span className="text-slate-500 uppercase tracking-widest" style={{ fontSize: "10px", fontWeight: 700 }}>
            Predicted: No Purchase
          </span>
        </div>
      </div>
      {/* Row 1 */}
      <div className="flex gap-3 mb-3">
        <div className="flex items-center justify-end pr-3" style={{ width: "120px" }}>
          <span className="text-slate-500 uppercase tracking-widest text-right" style={{ fontSize: "10px", fontWeight: 700 }}>
            Actual:<br />Purchase
          </span>
        </div>
        {[cells[0], cells[1]].map((cell) => {
          const Icon = cell.icon;
          return (
            <div
              key={cell.key}
              className="flex-1 rounded-2xl border p-5"
              style={{ background: cell.bg, borderColor: cell.border }}
            >
              <div className="flex items-start justify-between mb-3">
                <span
                  className="px-2 py-0.5 rounded-full"
                  style={{ fontSize: "10px", fontWeight: 800, background: cell.color + "20", color: cell.color }}
                >
                  {cell.key}
                </span>
                <Icon className="w-4 h-4" style={{ color: cell.color }} />
              </div>
              <p style={{ fontSize: "32px", fontWeight: 900, color: cell.color, lineHeight: "1" }}>
                {cell.value.toLocaleString()}
              </p>
              <p className="text-slate-500 mt-1" style={{ fontSize: "11px", fontWeight: 700 }}>{cell.label}</p>
              <p className="text-slate-400 mt-0.5" style={{ fontSize: "11px", lineHeight: "1.4" }}>{cell.desc}</p>
              <p className="mt-2" style={{ fontSize: "11px", fontWeight: 700, color: cell.color }}>
                {cell.pct}% of test set
              </p>
            </div>
          );
        })}
      </div>
      {/* Row 2 */}
      <div className="flex gap-3">
        <div className="flex items-center justify-end pr-3" style={{ width: "120px" }}>
          <span className="text-slate-500 uppercase tracking-widest text-right" style={{ fontSize: "10px", fontWeight: 700 }}>
            Actual:<br />No Purchase
          </span>
        </div>
        {[cells[2], cells[3]].map((cell) => {
          const Icon = cell.icon;
          return (
            <div
              key={cell.key}
              className="flex-1 rounded-2xl border p-5"
              style={{ background: cell.bg, borderColor: cell.border }}
            >
              <div className="flex items-start justify-between mb-3">
                <span
                  className="px-2 py-0.5 rounded-full"
                  style={{ fontSize: "10px", fontWeight: 800, background: cell.color + "20", color: cell.color }}
                >
                  {cell.key}
                </span>
                <Icon className="w-4 h-4" style={{ color: cell.color }} />
              </div>
              <p style={{ fontSize: "32px", fontWeight: 900, color: cell.color, lineHeight: "1" }}>
                {cell.value.toLocaleString()}
              </p>
              <p className="text-slate-500 mt-1" style={{ fontSize: "11px", fontWeight: 700 }}>{cell.label}</p>
              <p className="text-slate-400 mt-0.5" style={{ fontSize: "11px", lineHeight: "1.4" }}>{cell.desc}</p>
              <p className="mt-2" style={{ fontSize: "11px", fontWeight: 700, color: cell.color }}>
                {cell.pct}% of test set
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── MAIN COMPONENT ─────────────────────── */
export function ModelAnalysis() {
  const navigate = useNavigate();
  const { viewMode } = useSession();
  const [activeTab, setActiveTab] = useState<"overview" | "confusion" | "roc">("overview");
  const [maxDepth, setMaxDepth] = useState(5);
  const [criterion, setCriterion] = useState<"entropy" | "gini">("entropy");

  // Business View: redirect to overview (this screen is Technical only)
  if (viewMode === "business") {
    return <Navigate to="/" replace />;
  }

  const allTabs = [
    { id: "overview",  label: "Performance Overview", techOnly: false },
    { id: "confusion", label: "Confusion Matrix",     techOnly: true  },
    { id: "roc",       label: "ROC Curve",            techOnly: true  },
  ] as const;
  const tabs = allTabs.filter((t) => !t.techOnly || viewMode === "technical");

  return (
    <div className="px-4 md:px-8 py-5 md:py-8 max-w-[1280px] mx-auto space-y-4 md:space-y-6" style={{ animation: "fadeSlideUp 0.35s ease both" }}>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 border border-violet-100 mb-3">
            <FlaskConical className="w-3 h-3 text-violet-500" />
            <span className="text-violet-700 uppercase tracking-widest" style={{ fontSize: "10px", fontWeight: 700 }}>
              Model Analysis
            </span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-violet-100 text-violet-600" style={{ fontSize: "9px", fontWeight: 700 }}>
              Technical View
            </span>
          </div>
          <h1 className="text-slate-800" style={{ fontSize: "clamp(22px, 5vw, 28px)", fontWeight: 800, lineHeight: "1.2", letterSpacing: "-0.02em" }}>
            Decision Tree Model Analysis
          </h1>
          <p className="text-slate-500 mt-1.5" style={{ fontSize: "14px" }}>
            Detailed evaluation of model performance, errors, and interpretability
          </p>
        </div>
        <button
          onClick={() => navigate("/insights")}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm w-full sm:w-auto shrink-0"
          style={{ fontSize: "13px", fontWeight: 700, minHeight: "44px" }}
        >
          View Insights <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Insight callout */}
      <div
        className="flex items-start gap-3 px-4 md:px-5 py-4 rounded-2xl border"
        style={{ background: "#F0FDF4", borderColor: "#BBF7D0" }}
      >
        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
        <p className="text-emerald-700" style={{ fontSize: "13px", lineHeight: "1.6" }}>
          <strong>Model demonstrates balanced performance and reliable prediction capability.</strong>{" "}
          With an accuracy of 87.4%, F1 Score of 81.3%, and AUC-ROC of 0.84, the Decision Tree generalises
          well on the held-out test set of 2,466 e-commerce sessions.
        </p>
      </div>

      {/* ── A. PERFORMANCE METRICS ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4 md:mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
              <BarChart2 className="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <p className="text-slate-800" style={{ fontSize: "15px", fontWeight: 700 }}>Performance Metrics</p>
              <p className="text-slate-400" style={{ fontSize: "11px" }}>Evaluated on 20% hold-out test set · 2,466 sessions</p>
            </div>
          </div>
          {/* Tab switcher — scrollable on mobile */}
          <div className="sm:ml-auto flex items-center gap-1 rounded-lg border border-slate-200 p-0.5 overflow-x-auto" style={{ background: "#F8FAFC" }}>
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className="px-2.5 md:px-3 py-1.5 rounded-md transition-all whitespace-nowrap"
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  background: activeTab === t.id ? "white" : "transparent",
                  color: activeTab === t.id ? "#1E293B" : "#94A3B8",
                  boxShadow: activeTab === t.id ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "overview" && (
          <div className="space-y-4 md:space-y-5">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {perfMetrics.map((m) => (
                <div
                  key={m.label}
                  className="rounded-xl px-3 md:px-4 py-4 text-center border"
                  style={{ background: m.color + "08", borderColor: m.color + "25" }}
                >
                  <p style={{ fontSize: "clamp(20px, 4vw, 26px)", fontWeight: 900, color: m.color, lineHeight: "1" }}>
                    {m.value.toFixed(1)}<span style={{ fontSize: "12px" }}>%</span>
                  </p>
                  <p className="text-slate-600 mt-1" style={{ fontSize: "12px", fontWeight: 700 }}>{m.label}</p>
                  <p className="text-slate-400 mt-0.5 hidden md:block" style={{ fontSize: "10px", lineHeight: "1.4" }}>{m.desc}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              {perfMetrics.map((m) => (
                <div key={`bar-${m.label}`} className="flex items-center gap-3 md:gap-4">
                  <span className="w-16 md:w-20 text-slate-600 shrink-0" style={{ fontSize: "12px", fontWeight: 600 }}>{m.label}</span>
                  <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${m.value}%`, background: m.color }} />
                  </div>
                  <span className="w-12 text-right shrink-0" style={{ fontSize: "12px", fontWeight: 800, color: m.color }}>
                    {m.value}%
                  </span>
                  <span className="hidden lg:block w-52 text-slate-400 shrink-0" style={{ fontSize: "11px" }}>— {m.desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "confusion" && (
          <div className="space-y-4 md:space-y-5">
            <div className="flex items-start gap-3 px-4 py-3 rounded-xl" style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
              <Info className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
              <p className="text-slate-500" style={{ fontSize: "12px", lineHeight: "1.6" }}>
                <strong className="text-slate-700">Confusion Matrix</strong> — Shows classification errors for purchase prediction on the test set (2,466 sessions).
                Green cells indicate correct predictions; coloured cells indicate errors.
              </p>
            </div>
            <div className="overflow-x-auto">
              <div style={{ minWidth: "420px" }}>
                <ConfusionMatrix />
              </div>
            </div>
          </div>
        )}

        {activeTab === "roc" && (
          <div className="space-y-4 md:space-y-5">
            <div className="flex items-start gap-3 px-4 py-3 rounded-xl" style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
              <Info className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
              <p className="text-slate-500" style={{ fontSize: "12px", lineHeight: "1.6" }}>
                <strong className="text-slate-700">ROC Curve</strong> — Plots the True Positive Rate vs. False Positive Rate at different classification thresholds.
                AUC-ROC of <strong>0.84</strong> indicates strong discriminatory ability. The dashed line represents a random classifier (AUC = 0.5).
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
              <div className="md:col-span-2">
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart margin={{ left: 0, right: 16, top: 8, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis
                      dataKey="fpr" type="number" domain={[0, 1]}
                      tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
                      tick={{ fontSize: 10, fill: "#94A3B8" }} tickLine={false} axisLine={false}
                      label={{ value: "False Positive Rate", position: "insideBottom", offset: -2, style: { fontSize: 11, fill: "#94A3B8" } }}
                    />
                    <YAxis
                      dataKey="model" type="number" domain={[0, 1]}
                      tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
                      tick={{ fontSize: 10, fill: "#94A3B8" }} tickLine={false} axisLine={false}
                      label={{ value: "True Positive Rate", angle: -90, position: "insideLeft", style: { fontSize: 11, fill: "#94A3B8" } }}
                    />
                    <Tooltip content={<RocTooltip />} />
                    <Line data={rocData} type="monotone" dataKey="model" stroke="#3B82F6" strokeWidth={2.5} dot={false} />
                    <ReferenceLine x={0.2} stroke="#22C55E" strokeDasharray="3 3" label={{ value: "Threshold 0.5", style: { fontSize: 10, fill: "#22C55E" } }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
                {[
                  { label: "AUC-ROC Score",    value: "0.840", color: "#3B82F6", desc: "Area under the ROC curve" },
                  { label: "At Threshold 0.5", value: "83.2%", color: "#22C55E", desc: "Precision at default threshold" },
                  { label: "Optimal Threshold",value: "0.48",  color: "#7C3AED", desc: "Maximises F1 Score" },
                  { label: "Random Classifier",value: "0.500", color: "#CBD5E1", desc: "Baseline comparison (dashed)" },
                ].map((item) => (
                  <div key={item.label} className="p-3 rounded-xl border border-slate-100 bg-slate-50">
                    <p className="text-slate-400" style={{ fontSize: "10px", fontWeight: 600 }}>{item.label}</p>
                    <p style={{ fontSize: "18px", fontWeight: 800, color: item.color, lineHeight: "1.2" }}>{item.value}</p>
                    <p className="text-slate-400" style={{ fontSize: "10px" }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── C. FEATURE IMPORTANCE ── */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-5">
        <div className="md:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
              <BarChart2 className="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <p className="text-slate-800" style={{ fontSize: "15px", fontWeight: 700 }}>Feature Importance</p>
              <p className="text-slate-400" style={{ fontSize: "11px" }}>Contribution to model decisions</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={featureData} layout="vertical" margin={{ left: -8, right: 16, top: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
              <XAxis type="number" domain={[0, 45]} tick={{ fontSize: 10, fill: "#94A3B8" }} tickLine={false} axisLine={false} unit="%" />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#64748B", fontWeight: 600 }} tickLine={false} axisLine={false} width={92} />
              <Tooltip content={<FeatureTooltip />} cursor={{ fill: "#F8FAFC" }} />
              <Bar dataKey="importance" radius={[0, 8, 8, 0]} maxBarSize={22}>
                {featureData.map((entry) => (
                  <Cell key={`fi-${entry.key}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-5 space-y-2.5">
            {featureData.map((f) => (
              <div key={f.key} className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: f.color }} />
                <span className="text-slate-600 flex-1" style={{ fontSize: "12px" }}>{f.name}</span>
                <div className="w-20 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${(f.importance / 40) * 100}%`, background: f.color }} />
                </div>
                <span className="w-10 text-right" style={{ fontSize: "12px", fontWeight: 700, color: f.color }}>{f.importance}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── D. DECISION TREE PATH VISUALIZATION ── */}
        <div className="md:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-lg bg-violet-50 border border-violet-100 flex items-center justify-center">
              <GitBranch className="w-4 h-4 text-violet-500" />
            </div>
            <div>
              <p className="text-slate-800" style={{ fontSize: "15px", fontWeight: 700 }}>Decision Tree Path Visualization</p>
              <p className="text-slate-400" style={{ fontSize: "11px" }}>Rule-based logic paths from root to leaf node</p>
            </div>
          </div>

          <div className="space-y-4">
            {decisionPaths.map((path) => {
              const isPurchase = path.outcome === "purchase";
              return (
                <div
                  key={path.id}
                  className="rounded-2xl border p-5"
                  style={{
                    background: isPurchase ? "#F0FDF4" : "#FEF2F2",
                    borderColor: isPurchase ? "#A7F3D0" : "#FECACA",
                  }}
                >
                  {/* Path header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ background: isPurchase ? "#22C55E" : "#EF4444" }}
                      >
                        {isPurchase
                          ? <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                          : <AlertCircle className="w-3.5 h-3.5 text-white" />
                        }
                      </div>
                      <span style={{ fontSize: "13px", fontWeight: 700, color: isPurchase ? "#15803D" : "#991B1B" }}>
                        {path.outcomeLabel}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400" style={{ fontSize: "11px" }}>Depth {path.nodeDepth} · {path.leafSamples} samples</span>
                      <span
                        className="px-2.5 py-1 rounded-full"
                        style={{
                          fontSize: "12px", fontWeight: 700,
                          background: isPurchase ? "#DCFCE7" : "#FEE2E2",
                          color: isPurchase ? "#15803D" : "#991B1B",
                        }}
                      >
                        {path.confidence}% confidence
                      </span>
                    </div>
                  </div>

                  {/* Rule chain */}
                  <div className="space-y-2">
                    {path.rules.map((rule, ri) => (
                      <div key={ri} className="flex items-center gap-3">
                        <div className="flex flex-col items-center">
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center text-white shrink-0"
                            style={{ background: isPurchase ? "#22C55E" : "#EF4444", fontSize: "9px", fontWeight: 800 }}
                          >
                            {ri === 0 ? "IF" : "&&"}
                          </div>
                          {ri < path.rules.length - 1 && <div className="w-px h-2" style={{ background: isPurchase ? "#A7F3D0" : "#FECACA" }} />}
                        </div>
                        <div
                          className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl"
                          style={{ background: "rgba(255,255,255,0.7)", border: `1px solid ${isPurchase ? "#A7F3D0" : "#FECACA"}` }}
                        >
                          <code className="text-slate-700" style={{ fontSize: "12px", fontWeight: 600 }}>{rule.feature}</code>
                          <span
                            className="px-1.5 py-0.5 rounded"
                            style={{ fontSize: "11px", fontWeight: 800, background: isPurchase ? "#D1FAE5" : "#FEE2E2", color: isPurchase ? "#059669" : "#DC2626" }}
                          >
                            {rule.op}
                          </span>
                          <code className="text-blue-600" style={{ fontSize: "12px", fontWeight: 700 }}>{rule.threshold}</code>
                          <span className="ml-auto text-slate-400" style={{ fontSize: "11px" }}>Session value: <strong className="text-slate-600">{rule.actual}</strong></span>
                          <CheckCircle2 className="w-3.5 h-3.5 ml-1" style={{ color: isPurchase ? "#22C55E" : "#EF4444" }} />
                        </div>
                      </div>
                    ))}

                    {/* Outcome */}
                    <div className="flex items-center gap-3 pt-1">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: isPurchase ? "#22C55E" : "#EF4444" }}
                      >
                        <ChevronRight className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div
                        className="flex-1 flex items-center justify-between px-3 py-2 rounded-xl"
                        style={{ background: isPurchase ? "#D1FAE5" : "#FEE2E2", border: `1px solid ${isPurchase ? "#6EE7B7" : "#FCA5A5"}` }}
                      >
                        <span style={{ fontSize: "12px", fontWeight: 800, color: isPurchase ? "#059669" : "#DC2626" }}>
                          → THEN: {path.outcomeLabel}
                        </span>
                        <span style={{ fontSize: "11px", fontWeight: 600, color: isPurchase ? "#059669" : "#DC2626" }}>
                          confidence = {(path.confidence / 100).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* IF-THEN summary */}
          <div className="mt-4 bg-slate-900 rounded-xl p-4 overflow-x-auto">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              <span className="ml-2 text-slate-500" style={{ fontSize: "10px", fontWeight: 600 }}>
                key_decision_rules.txt
              </span>
            </div>
            <div style={{ fontSize: "12px", lineHeight: "1.9" }}>
              <span style={{ color: "#C084FC" }}>IF </span>
              <span style={{ color: "#F1F5F9" }}>Page_Value </span>
              <span style={{ color: "#34D399" }}>&gt; 50 </span>
              <span style={{ color: "#60A5FA" }}>AND </span>
              <span style={{ color: "#F1F5F9" }}>Bounce_Rate </span>
              <span style={{ color: "#34D399" }}>&lt; 0.02 </span>
              <span style={{ color: "#60A5FA" }}>AND </span>
              <span style={{ color: "#F1F5F9" }}>Exit_Rate </span>
              <span style={{ color: "#34D399" }}>&lt; 0.04</span>
              <br />
              <span style={{ color: "#C084FC" }}>THEN </span>
              <span style={{ color: "#34D399" }}>"Likely to Purchase" </span>
              <span style={{ color: "#64748B" }}>(confidence = 0.85)</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── E. MODEL CONFIG QUICK REFERENCE ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-6">
        <div className="flex items-center gap-2.5 mb-4 md:mb-5">
          <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
            <FileText className="w-4 h-4 text-slate-500" />
          </div>
          <p className="text-slate-800" style={{ fontSize: "15px", fontWeight: 700 }}>Model Configuration Reference</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {[
            { icon: GitBranch,             label: "Algorithm",      value: "Decision Tree (CART)",    color: "#7C3AED", bg: "#F5F3FF" },
            { icon: SplitSquareHorizontal, label: "Criterion",      value: "Entropy",                 color: "#2563EB", bg: "#EFF6FF" },
            { icon: Layers,               label: "Max Depth",      value: "5",                       color: "#0891B2", bg: "#ECFEFF" },
            { icon: TrendingUp,           label: "Train/Test Split", value: "80% / 20%",             color: "#22C55E", bg: "#ECFDF5" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl border"
                style={{ background: item.bg, borderColor: item.color + "30" }}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: item.color + "20" }}>
                  <Icon className="w-4 h-4" style={{ color: item.color }} />
                </div>
                <div>
                  <p className="text-slate-400" style={{ fontSize: "10px", fontWeight: 700 }}>{item.label}</p>
                  <p className="text-slate-800" style={{ fontSize: "13px", fontWeight: 800 }}>{item.value}</p>
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-slate-400 mt-4 text-center" style={{ fontSize: "11px" }}>
          Model implemented using custom Decision Tree algorithm (CART) · Online Shoppers Purchasing Intention Dataset · 12,330 sessions · 18 features
        </p>
      </div>

      {/* ── E.5 HYPERPARAMETER TUNING LAB ── Technical View only */}
      {viewMode === "technical" && (() => {
        const base = depthMetrics[maxDepth];
        const bias = criterion === "gini" ? giniBias : { acc: 0, prec: 0, rec: 0, f1: 0, auc: 0 };
        const tuned = {
          acc:  parseFloat((base.acc  + bias.acc ).toFixed(1)),
          prec: parseFloat((base.prec + bias.prec).toFixed(1)),
          rec:  parseFloat((base.rec  + bias.rec ).toFixed(1)),
          f1:   parseFloat((base.f1   + bias.f1  ).toFixed(1)),
          auc:  parseFloat((base.auc  + bias.auc ).toFixed(1)),
        };
        const isOverfitting  = maxDepth >= 8;
        const isUnderfitting = maxDepth <= 2;
        const isCurrent = maxDepth === 5 && criterion === "entropy";
        return (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-violet-50 border border-violet-100 flex items-center justify-center">
                  <Sliders className="w-4 h-4 text-violet-500" />
                </div>
                <div>
                  <p className="text-slate-800" style={{ fontSize: "15px", fontWeight: 700 }}>Hyperparameter Tuning Lab</p>
                  <p className="text-slate-400" style={{ fontSize: "11px" }}>Simulate the effect of different tree configurations on model performance</p>
                </div>
              </div>
              <div className="sm:ml-auto flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded-full" style={{ fontSize: "10px", fontWeight: 700, background: "#F5F3FF", color: "#7C3AED" }}>Technical View</span>
                {isCurrent && (
                  <span className="px-2 py-0.5 rounded-full" style={{ fontSize: "10px", fontWeight: 700, background: "#ECFDF5", color: "#15803D" }}>Current Config Active</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              {/* max_depth slider */}
              <div className="p-4 rounded-xl border border-slate-100" style={{ background: "#F8FAFC" }}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-slate-700" style={{ fontSize: "13px", fontWeight: 700 }}>max_depth</p>
                    <p className="text-slate-400" style={{ fontSize: "11px" }}>Controls tree depth to prevent overfitting</p>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white">
                    <span style={{ fontSize: "18px", fontWeight: 900, color: "#3B82F6" }}>{maxDepth}</span>
                  </div>
                </div>
                <input
                  type="range" min={1} max={10} step={1} value={maxDepth}
                  onChange={(e) => setMaxDepth(parseInt(e.target.value))}
                  className="w-full cursor-pointer"
                  style={{ accentColor: "#3B82F6" }}
                />
                <div className="flex justify-between mt-1" style={{ fontSize: "10px", color: "#94A3B8", fontWeight: 600 }}>
                  <span>1 (underfit)</span><span>5 (current)</span><span>10 (overfit)</span>
                </div>
                {isUnderfitting && (
                  <div className="mt-2 flex items-center gap-1.5" style={{ fontSize: "11px", color: "#D97706" }}>
                    <AlertTriangle className="w-3 h-3" />
                    <span style={{ fontWeight: 600 }}>Risk of underfitting — model may be too simple</span>
                  </div>
                )}
                {isOverfitting && (
                  <div className="mt-2 flex items-center gap-1.5" style={{ fontSize: "11px", color: "#DC2626" }}>
                    <AlertTriangle className="w-3 h-3" />
                    <span style={{ fontWeight: 600 }}>Risk of overfitting — model may not generalise</span>
                  </div>
                )}
              </div>

              {/* criterion selector */}
              <div className="p-4 rounded-xl border border-slate-100" style={{ background: "#F8FAFC" }}>
                <p className="text-slate-700 mb-1" style={{ fontSize: "13px", fontWeight: 700 }}>criterion</p>
                <p className="text-slate-400 mb-3" style={{ fontSize: "11px" }}>Splitting quality measure at each decision node</p>
                <div className="flex gap-2">
                  {(["entropy", "gini"] as const).map((c) => (
                    <button
                      key={c}
                      onClick={() => setCriterion(c)}
                      className="flex-1 py-2.5 rounded-xl border transition-all"
                      style={{
                        fontSize: "12px", fontWeight: 700,
                        background: criterion === c ? "#EFF6FF" : "white",
                        borderColor: criterion === c ? "#BFDBFE" : "#E2E8F0",
                        color: criterion === c ? "#1D4ED8" : "#94A3B8",
                      }}
                    >
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </button>
                  ))}
                </div>
                <div className="mt-3 p-3 rounded-lg" style={{ background: "white", border: "1px solid #E2E8F0" }}>
                  <p className="text-slate-500" style={{ fontSize: "11px", lineHeight: "1.5" }}>
                    {criterion === "entropy"
                      ? "Information Gain — tends to produce more balanced trees. Used in the current production model."
                      : "Gini Impurity — computationally lighter, slightly different split boundaries vs Entropy."
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Simulated metrics preview */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Settings2 className="w-3.5 h-3.5 text-slate-400" />
                <p className="text-slate-500" style={{ fontSize: "11px", fontWeight: 700 }}>
                  Simulated Performance Preview — depth={maxDepth}, criterion={criterion}
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-3">
                {([
                  { label: "Accuracy",  val: tuned.acc,  color: "#22C55E", prev: 87.4 },
                  { label: "Precision", val: tuned.prec, color: "#3B82F6", prev: 83.2 },
                  { label: "Recall",    val: tuned.rec,  color: "#7C3AED", prev: 79.6 },
                  { label: "F1 Score",  val: tuned.f1,   color: "#F59E0B", prev: 81.3 },
                  { label: "AUC-ROC",   val: tuned.auc,  color: "#06B6D4", prev: 84.0 },
                ] as { label: string; val: number; color: string; prev: number }[]).map((m) => {
                  const diff = parseFloat((m.val - m.prev).toFixed(1));
                  return (
                    <div key={m.label} className="rounded-xl px-3 py-3 text-center border" style={{ background: m.color + "08", borderColor: m.color + "25" }}>
                      <p style={{ fontSize: "clamp(16px, 3vw, 20px)", fontWeight: 900, color: m.color, lineHeight: "1" }}>
                        {m.val.toFixed(1)}<span style={{ fontSize: "10px" }}>%</span>
                      </p>
                      <p className="text-slate-600 mt-0.5" style={{ fontSize: "10px", fontWeight: 700 }}>{m.label}</p>
                      {!isCurrent && (
                        <p style={{ fontSize: "10px", fontWeight: 700, color: diff > 0 ? "#22C55E" : diff < 0 ? "#EF4444" : "#94A3B8", marginTop: "2px" }}>
                          {diff > 0 ? "+" : ""}{diff.toFixed(1)}%
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
              {!isCurrent && (
                <div className="flex items-center gap-2 mt-3 px-3 py-2.5 rounded-xl" style={{ background: "#FFF7ED", border: "1px solid #FED7AA" }}>
                  <Info className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                  <p className="text-orange-700" style={{ fontSize: "11px" }}>
                    This is a simulated preview based on trend analysis. The production model uses depth=5, criterion=entropy.
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* ── E.6 DATA QUALITY & CLASS DISTRIBUTION ── Technical View only */}
      {viewMode === "technical" && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
              <Database className="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <p className="text-slate-800" style={{ fontSize: "15px", fontWeight: 700 }}>Data Quality and Class Distribution</p>
              <p className="text-slate-400" style={{ fontSize: "11px" }}>Online Shoppers Purchasing Intention Dataset — 12,330 sessions</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Class imbalance visualization */}
            <div>
              <p className="text-slate-700 mb-3" style={{ fontSize: "13px", fontWeight: 700 }}>Class Distribution (Target Variable)</p>
              <div className="space-y-3">
                {classDistribution.map((cls) => (
                  <div key={cls.label}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-sm" style={{ background: cls.color }} />
                        <span className="text-slate-700" style={{ fontSize: "12px", fontWeight: 600 }}>{cls.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span style={{ fontSize: "12px", fontWeight: 800, color: cls.color }}>{cls.pct}%</span>
                        <span className="text-slate-400" style={{ fontSize: "10px" }}>({cls.count.toLocaleString()} samples)</span>
                      </div>
                    </div>
                    <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${cls.pct}%`, background: cls.color }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-start gap-2.5 px-3 py-3 rounded-xl border" style={{ background: "#FFFBEB", borderColor: "#FDE68A" }}>
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-amber-700" style={{ fontSize: "11px", lineHeight: "1.5" }}>
                  <strong>Class imbalance detected</strong> — Ratio 5.46:1 (No Purchase vs Purchase). The decision tree handles this natively through entropy-based splitting, but precision on the minority class (Purchase) warrants close monitoring in production.
                </p>
              </div>
            </div>

            {/* Data quality rows */}
            <div>
              <p className="text-slate-700 mb-3" style={{ fontSize: "13px", fontWeight: 700 }}>Dataset Statistics</p>
              <div className="space-y-2">
                {dataQualityRows.map((row) => (
                  <div key={row.label} className="flex items-center justify-between px-3 py-2.5 rounded-xl" style={{ background: row.color + "08", border: `1px solid ${row.color}25` }}>
                    <div className="flex items-center gap-2">
                      {row.status === "good" && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: row.color }} />}
                      {row.status === "warn" && <AlertTriangle className="w-3.5 h-3.5 shrink-0" style={{ color: row.color }} />}
                      {row.status === "info" && <Info className="w-3.5 h-3.5 shrink-0" style={{ color: row.color }} />}
                      <span className="text-slate-600" style={{ fontSize: "12px", fontWeight: 500 }}>{row.label}</span>
                    </div>
                    <span style={{ fontSize: "13px", fontWeight: 800, color: row.color }}>{row.value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 px-3 py-2.5 rounded-xl" style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                <p className="text-slate-400" style={{ fontSize: "11px", lineHeight: "1.5" }}>
                  No preprocessing for missing values or duplicates was required. Categorical features (Visitor Type, Traffic Type, Month) were label-encoded before training.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── F. MODEL NOTES ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-6">
        <div className="flex items-center gap-2.5 mb-4 md:mb-5">
          <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center">
            <Info className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <p className="text-slate-800" style={{ fontSize: "15px", fontWeight: 700 }}>Model Notes</p>
            <p className="text-slate-400" style={{ fontSize: "11px" }}>Implementation details and design decisions</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: Shuffle,
              title: "Entropy-Based Splitting",
              desc: "The model uses information gain (entropy) as the splitting criterion at each node. This measures how much each feature reduces uncertainty about the target class, ensuring the most predictive feature is always selected first.",
              color: "#3B82F6",
              bg: "#EFF6FF",
              border: "#BFDBFE",
            },
            {
              icon: Layers,
              title: "Max Depth: 5",
              desc: "Tree depth is capped at 5 levels to prevent overfitting. This constraint forces the model to learn the most impactful decision rules while remaining interpretable and generalisable to unseen sessions.",
              color: "#7C3AED",
              bg: "#F5F3FF",
              border: "#DDD6FE",
            },
            {
              icon: Target,
              title: "Balanced Performance",
              desc: "With Accuracy 87.4%, F1 Score 81.3%, and AUC-ROC 0.84, the model achieves a strong balance between precision and recall — avoiding both over-prediction and missed purchase signals on held-out test data.",
              color: "#059669",
              bg: "#ECFDF5",
              border: "#A7F3D0",
            },
          ].map((note) => {
            const Icon = note.icon;
            return (
              <div
                key={note.title}
                className="rounded-xl p-5 border"
                style={{ background: note.bg, borderColor: note.border }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: note.color + "20" }}>
                    <Icon className="w-4 h-4" style={{ color: note.color }} />
                  </div>
                  <p className="text-slate-800" style={{ fontSize: "13px", fontWeight: 700 }}>{note.title}</p>
                </div>
                <p className="text-slate-600" style={{ fontSize: "12px", lineHeight: "1.7" }}>{note.desc}</p>
              </div>
            );
          })}
        </div>
        <div
          className="mt-4 flex items-start gap-3 px-4 py-3.5 rounded-xl border"
          style={{ background: "#F8FAFC", borderColor: "#E2E8F0" }}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
          <p className="text-slate-600" style={{ fontSize: "12px", lineHeight: "1.6" }}>
            <strong className="text-slate-800">Training methodology:</strong> The dataset was split 80/20 for training and testing. No feature scaling was required as Decision Trees are scale-invariant. Categorical features were label-encoded. The model was validated using 5-fold cross-validation before final evaluation on the hold-out test set.
          </p>
        </div>
      </div>

    </div>
  );
}