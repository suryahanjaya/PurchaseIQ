import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  CheckCircle2,
  GitBranch,
  ChevronRight,
  ArrowRight,
  Cpu,
  Layers,
  Shuffle,
  FileText,
  TrendingUp,
  BrainCircuit,
  MoveRight,
  BarChart2,
  SplitSquareHorizontal,
  Database,
  Gauge,
  AlertCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { useSession } from "../../context/SessionContext";

const CONFIDENCE = 85;

function AnimatedArc({ value, animate }: { value: number; animate: boolean }) {
  const radius = 72;
  const stroke = 10;
  const norm = radius - stroke / 2;
  const circ = norm * 2 * Math.PI;
  const offset = circ - (animate ? (value / 100) * circ : circ);

  return (
    <svg
      width={radius * 2}
      height={radius * 2}
      className="rotate-[-90deg]"
      style={{ display: "block" }}
    >
      <circle
        cx={radius}
        cy={radius}
        r={norm}
        fill="transparent"
        stroke="#F1F5F9"
        strokeWidth={stroke}
      />
      <circle
        cx={radius}
        cy={radius}
        r={norm}
        fill="transparent"
        stroke="#22C55E"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${circ} ${circ}`}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)" }}
      />
    </svg>
  );
}

const modelSteps = [
  {
    icon: Layers,
    title: "Entropy-Based Feature Selection",
    desc: "Evaluates each feature's information gain to determine the most predictive split at every node.",
    color: "#3B82F6",
    bg: "#EFF6FF",
  },
  {
    icon: Shuffle,
    title: "Recursive Splitting",
    desc: "Recursively partitions the dataset into subsets, optimising purity at each decision node.",
    color: "#7C3AED",
    bg: "#F5F3FF",
  },
  {
    icon: FileText,
    title: "Rule Generation",
    desc: "Each path from root to leaf forms a human-readable IF-THEN rule that drives the final prediction.",
    color: "#059669",
    bg: "#ECFDF5",
  },
];

const decisionRules = [
  { condition: "Page Value (68.4)", operator: ">", threshold: "50", met: true },
  { condition: "Bounce Rate (0.015)", operator: "<", threshold: "0.02", met: true },
  { condition: "Exit Rate (0.032)", operator: "<", threshold: "0.04", met: true },
];

/* ─────────────── EMPTY STATE ─────────────── */
function PredictionEmptyState() {
  const navigate = useNavigate();
  const { sessionPhase, viewMode, loadSession, analyzeSession } = useSession();
  const sessionLoaded = sessionPhase === "loaded";

  // Business View: one-click analysis trigger (no Session Data screen needed)
  const handleStartAnalysisBusiness = () => {
    if (sessionPhase === "empty") loadSession();
    analyzeSession(); // already on /prediction — phase change triggers PredictionAnalyzing
  };

  return (
    <div
      className="flex flex-col items-center justify-center px-4 md:px-8 py-10"
      style={{ minHeight: "calc(100vh - 64px)" }}
    >
      {/* Stepper hint */}
      <div className="flex items-center gap-2 mb-10">
        {viewMode === "business" ? (
          // Business View: simplified 2-step stepper
          [
            { label: "Run Analysis", active: true },
            { label: "View Results", active: false },
          ].map((s, i) => (
            <div key={s.label} className="flex items-center gap-2">
              {i > 0 && <div className="w-8 h-px bg-slate-200" />}
              <div className="flex items-center gap-1.5">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: s.active ? "#3B82F6" : "#E2E8F0" }}
                >
                  <span style={{ fontSize: "10px", fontWeight: 800, color: s.active ? "white" : "#94A3B8" }}>
                    {i + 1}
                  </span>
                </div>
                <span style={{ fontSize: "12px", fontWeight: 600, color: s.active ? "#1E293B" : "#94A3B8" }}>
                  {s.label}
                </span>
              </div>
            </div>
          ))
        ) : (
          // Technical View: full 3-step stepper
          [
            { label: "Load Session", done: sessionLoaded },
            { label: "Analyze", done: false, active: sessionLoaded },
            { label: "View Results", done: false, active: false },
          ].map((s, i) => (
            <div key={s.label} className="flex items-center gap-2">
              {i > 0 && (
                <div
                  className="w-8 h-px"
                  style={{ background: s.done || (i === 1 && sessionLoaded) ? "#93C5FD" : "#E2E8F0" }}
                />
              )}
              <div className="flex items-center gap-1.5">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center"
                  style={{
                    background: s.done ? "#22C55E" : (s as any).active ? "#3B82F6" : "#E2E8F0",
                  }}
                >
                  {s.done ? (
                    <CheckCircle2 className="w-3 h-3 text-white" />
                  ) : (
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 800,
                        color: (s as any).active ? "white" : "#94A3B8",
                      }}
                    >
                      {i + 1}
                    </span>
                  )}
                </div>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: s.done ? "#15803D" : (s as any).active ? "#1E293B" : "#94A3B8",
                  }}
                >
                  {s.label}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Empty state card */}
      <div
        className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-12 text-center flex flex-col items-center"
        style={{ maxWidth: "480px", width: "100%" }}
      >
        <div className="relative mb-6">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center"
            style={{ background: "#F8FAFC", border: "1.5px dashed #CBD5E1" }}
          >
            <BrainCircuit className="w-9 h-9 text-slate-300" />
          </div>
          <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center">
            <span style={{ fontSize: "10px", color: "#94A3B8" }}>?</span>
          </div>
        </div>

        <h2
          className="text-slate-800 mb-2"
          style={{ fontSize: "20px", fontWeight: 800, letterSpacing: "-0.01em" }}
        >
          No Prediction Available
        </h2>
        <p
          className="text-slate-400 mb-8"
          style={{ fontSize: "14px", lineHeight: "1.7", maxWidth: "320px" }}
        >
          {viewMode === "business"
            ? "Click Start Analysis to run the Decision Tree model and see the purchase prediction for this session."
            : "Load and analyze a session to generate prediction results from the Decision Tree model."
          }
        </p>

        {viewMode === "business" ? (
          // Business View: single one-click CTA
          <button
            onClick={handleStartAnalysisBusiness}
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-sm hover:shadow-md active:scale-95 w-full justify-center"
            style={{ fontSize: "14px", fontWeight: 700, minHeight: "44px" }}
          >
            Start Analysis
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : sessionLoaded ? (
          <div className="flex flex-col items-center gap-3 w-full">
            <div
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border border-emerald-100"
              style={{ background: "#ECFDF5" }}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="text-emerald-700" style={{ fontSize: "12px", fontWeight: 600 }}>
                Session data is ready — return to Session Data and click Analyze
              </span>
            </div>
            <button
              onClick={() => navigate("/session-data")}
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-sm hover:shadow-md active:scale-95 w-full justify-center"
              style={{ fontSize: "14px", fontWeight: 700, minHeight: "44px" }}
            >
              Go Analyze Session
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate("/session-data")}
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-sm hover:shadow-md active:scale-95 w-full justify-center"
            style={{ fontSize: "14px", fontWeight: 700, minHeight: "44px" }}
          >
            Go to Session Data
            <ArrowRight className="w-4 h-4" />
          </button>
        )}

        <p className="text-slate-300 mt-4" style={{ fontSize: "12px" }}>
          {viewMode === "business"
            ? "Powered by Decision Tree (CART) · 87.4% accuracy"
            : "The prediction requires at least one analyzed session"
          }
        </p>
      </div>

      {/* What you'll see preview */}
      <div className="mt-6 md:mt-8 flex flex-col sm:flex-row items-stretch gap-3" style={{ maxWidth: "480px", width: "100%" }}>
        {[
          { icon: CheckCircle2, label: "Purchase likelihood", color: "#22C55E" },
          { icon: BarChart2, label: "Confidence score", color: "#3B82F6" },
          { icon: GitBranch, label: viewMode === "business" ? "Decision logic" : "Decision rules", color: "#7C3AED" },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl bg-white border border-slate-100"
            >
              <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: item.color }} />
              <span className="text-slate-500" style={{ fontSize: "11px", fontWeight: 600 }}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────── ANALYZING (loading) ─────────────── */
function PredictionAnalyzing({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const t = setTimeout(onComplete, 1800);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{ minHeight: "calc(100vh - 64px)" }}
    >
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-12 py-10 text-center" style={{ maxWidth: "420px", width: "100%" }}>
        <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-5">
          <Cpu className="w-8 h-8 text-blue-500 animate-pulse" />
        </div>
        <p className="text-slate-800 mb-2" style={{ fontSize: "18px", fontWeight: 700 }}>
          Running Decision Tree Model
        </p>
        <p className="text-slate-400 mb-6" style={{ fontSize: "13px" }}>
          Analyzing session signals and applying decision rules…
        </p>

        {/* Animated progress bar */}
        <div className="h-1.5 rounded-full bg-slate-100 mb-6 overflow-hidden">
          <div
            className="h-full rounded-full bg-blue-500"
            style={{ animation: "analyzeFill 1.6s ease-out forwards" }}
          />
        </div>

        <div className="space-y-2.5 text-left">
          {[
            { label: "Evaluating feature entropy…", delay: "0s" },
            { label: "Traversing decision nodes…", delay: "0.4s" },
            { label: "Generating prediction rule…", delay: "0.8s" },
          ].map((step) => (
            <div key={step.label} className="flex items-center gap-3">
              <div
                className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"
                style={{ animationDelay: step.delay }}
              />
              <span className="text-slate-500" style={{ fontSize: "12px" }}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes analyzeFill {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </div>
  );
}

/* ─────────────── SIMPLE TREE DIAGRAM ─────────────── */
function SimpleTreeDiagram({ activePath }: { activePath: "buy" | "nobuy" }) {
  const isBuy = activePath === "buy";
  const activeStroke = isBuy ? "#22C55E" : "#EF4444";

  type NodeDef = { label: string; sub: string; x: number; y: number; leaf?: true; buy?: boolean };
  const nodes: Record<string, NodeDef> = {
    root:  { label: "Page Value",  sub: "Is value high?",      x: 240, y: 20 },
    left:  { label: "Bounce Rate", sub: "Is rate low?",        x: 110, y: 120 },
    right: { label: "Low Intent",  sub: "No purchase likely",  x: 380, y: 120, leaf: true, buy: false },
    ll:    { label: "Purchase",    sub: "Likely to buy ✓",     x: 30,  y: 220, leaf: true, buy: true  },
    lr:    { label: "No Purchase", sub: "High bounce risk",    x: 200, y: 220, leaf: true, buy: false },
  };

  const edges: [string, string][] = [
    ["root","left"], ["root","right"], ["left","ll"], ["left","lr"]
  ];
  const activePaths: [string,string][] = isBuy
    ? [["root","left"], ["left","ll"]]
    : [["root","right"]];

  const isActive = (a: string, b: string) => activePaths.some(([x,y]) => x===a && y===b);

  const renderEdge = (a: string, b: string) => {
    const from = nodes[a]; const to = nodes[b];
    const active = isActive(a, b);
    return (
      <line key={`${a}-${b}`}
        x1={from.x+60} y1={from.y+34}
        x2={to.x+60}   y2={to.y}
        stroke={active ? activeStroke : "#E2E8F0"}
        strokeWidth={active ? 2.5 : 1.5}
        strokeDasharray={active ? undefined : "4 3"}
      />
    );
  };

  const renderNode = (key: string, n: NodeDef) => {
    const onPath =
      key === "root" ||
      (isBuy && (key === "left" || key === "ll")) ||
      (!isBuy && key === "right");
    const bg = n.buy === true ? "#ECFDF5" : n.buy === false ? "#FEF2F2" : onPath ? "#EFF6FF" : "#F8FAFC";
    const border = n.buy === true ? "#A7F3D0" : n.buy === false ? "#FECACA" : onPath ? "#BFDBFE" : "#E2E8F0";
    const tc = n.buy === true ? "#059669" : n.buy === false ? "#DC2626" : onPath ? "#1D4ED8" : "#64748B";
    const sc = n.buy === true ? "#4ADE80" : n.buy === false ? "#F87171" : onPath ? "#60A5FA" : "#94A3B8";
    return (
      <g key={key} transform={`translate(${n.x},${n.y})`}>
        <rect width={120} height={34} rx={8} fill={bg} stroke={border} strokeWidth={onPath ? 2 : 1} />
        <text x={60} y={14} textAnchor="middle" style={{ fontSize: "11px", fontWeight: 700, fill: tc }}>{n.label}</text>
        <text x={60} y={26} textAnchor="middle" style={{ fontSize: "9px", fontWeight: 500, fill: sc }}>{n.sub}</text>
      </g>
    );
  };

  return (
    <svg width="100%" viewBox="0 0 560 270" style={{ overflow: "visible" }}>
      {edges.map(([a, b]) => renderEdge(a, b))}
      {/* Edge labels */}
      <text x={165} y={92} style={{ fontSize: "9px", fill: "#3B82F6", fontWeight: 600 }}>Yes (high)</text>
      <text x={330} y={92} style={{ fontSize: "9px", fill: "#94A3B8", fontWeight: 600 }}>No (low)</text>
      <text x={58}  y={194} style={{ fontSize: "9px", fill: "#22C55E", fontWeight: 600 }}>Low bounce</text>
      <text x={214} y={194} style={{ fontSize: "9px", fill: "#94A3B8", fontWeight: 600 }}>High bounce</text>
      {Object.entries(nodes).map(([k, n]) => renderNode(k, n))}
    </svg>
  );
}

/* ─────────────── THRESHOLD CHART DATA ─────────────── */
const thresholdImpactData = [
  { threshold: 0.1, users: 8940 },
  { threshold: 0.2, users: 7230 },
  { threshold: 0.3, users: 5810 },
  { threshold: 0.4, users: 4500 },
  { threshold: 0.5, users: 3240 },
  { threshold: 0.6, users: 2180 },
  { threshold: 0.7, users: 1350 },
  { threshold: 0.8, users: 720  },
  { threshold: 0.9, users: 290  },
];

const ThresholdTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-slate-900 px-3 py-2 rounded-xl shadow-xl">
        <p className="text-slate-300" style={{ fontSize: "10px" }}>Threshold: {label}</p>
        <p className="text-white" style={{ fontSize: "14px", fontWeight: 800 }}>{payload[0].value.toLocaleString()} users</p>
      </div>
    );
  }
  return null;
};

/* ─────────────── RESULT ─────────────── */
function PredictionResult() {
  const navigate = useNavigate();
  const { viewMode } = useSession();
  const [arcReady, setArcReady] = useState(false);
  const [threshold, setThreshold] = useState(0.5);

  useEffect(() => {
    const t = setTimeout(() => setArcReady(true), 150);
    return () => clearTimeout(t);
  }, []);

  const confidenceRatio = CONFIDENCE / 100;
  const isPurchase = confidenceRatio >= threshold;
  const resultColor = isPurchase ? "#059669" : "#DC2626";
  const resultGradient = isPurchase
    ? "linear-gradient(135deg, #059669 0%, #10B981 50%, #34D399 100%)"
    : "linear-gradient(135deg, #DC2626 0%, #EF4444 50%, #F87171 100%)";
  const resultLabel = isPurchase ? "Likely to Purchase" : "Unlikely to Purchase";
  const resultDesc = isPurchase
    ? viewMode === "business"
      ? "This user is showing strong purchase signals — high page engagement and low bounce rate suggest genuine buying intent."
      : "The decision tree model predicts this visitor has a high intent to complete a purchase in this session."
    : viewMode === "business"
      ? "This user is not showing strong enough purchase signals at the current threshold. Consider adjusting targeting."
      : "Based on the current threshold, this session does not meet the purchase likelihood criteria.";

  const estimatedUsers = thresholdImpactData.reduce((prev, curr) =>
    Math.abs(curr.threshold - threshold) < Math.abs(prev.threshold - threshold) ? curr : prev
  ).users;

  return (
    <div
      className="px-4 md:px-8 py-5 md:py-8 max-w-[1280px] mx-auto space-y-4 md:space-y-6"
      style={{ animation: "fadeSlideUp 0.35s ease both" }}
    >
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .threshold-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #2563EB;
          border: 3px solid white;
          box-shadow: 0 1px 6px rgba(37,99,235,0.4);
          cursor: pointer;
        }
        .threshold-slider::-webkit-slider-runnable-track {
          height: 6px;
          border-radius: 9999px;
        }
        .threshold-slider {
          -webkit-appearance: none;
          appearance: none;
          outline: none;
          cursor: pointer;
          background: transparent;
        }
      `}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3"
            style={{ background: isPurchase ? "#ECFDF5" : "#FEF2F2", border: `1px solid ${isPurchase ? "#A7F3D0" : "#FECACA"}` }}
          >
            <CheckCircle2 className="w-3 h-3" style={{ color: resultColor }} />
            <span className="uppercase tracking-widest" style={{ fontSize: "10px", fontWeight: 700, color: resultColor }}>
              Analysis Complete
            </span>
          </div>
          <h1 className="text-slate-800" style={{ fontSize: "clamp(22px, 5vw, 28px)", fontWeight: 800, lineHeight: "1.2", letterSpacing: "-0.02em" }}>
            Prediction Result
          </h1>
          <p className="text-slate-500 mt-1.5" style={{ fontSize: "14px" }}>
            {viewMode === "business"
              ? "AI-powered purchase prediction for this user session"
              : "Model trained on historical e-commerce session data"
            }
          </p>
        </div>
        {/* Single primary CTA */}
        <button
          onClick={() => navigate("/insights")}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm w-full sm:w-auto"
          style={{ fontSize: "13px", fontWeight: 700, minHeight: "44px" }}
        >
          View Insights
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* ── Business-friendly insight strip ── */}
      {viewMode === "business" && (
        <div
          className="flex items-start gap-3 px-4 py-3.5 rounded-2xl border"
          style={{ background: isPurchase ? "#F0FDF4" : "#FEF2F2", borderColor: isPurchase ? "#BBF7D0" : "#FECACA" }}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: resultColor }} />
          <p style={{ fontSize: "13px", lineHeight: "1.5", color: isPurchase ? "#15803D" : "#991B1B" }}>
            <strong>
              {isPurchase
                ? "Users with high page value and low bounce rate are likely to purchase"
                : "Users with low page engagement and high bounce rate are unlikely to purchase"
              }
            </strong>
            {" — "}
            {isPurchase
              ? "prioritise marketing spend on segments like this user."
              : "consider re-engagement campaigns for this user segment."
            }
          </p>
        </div>
      )}

      {/* ── Model Info Strip — Technical View only ── */}
      {viewMode === "technical" && (
      <div
        className="flex items-center gap-3 px-4 py-3.5 rounded-2xl border overflow-x-auto"
        style={{ background: "#FAFBFF", borderColor: "#E2E8F0" }}
      >
        <div className="flex items-center gap-2 pr-4 shrink-0" style={{ borderRight: "1px solid #E2E8F0" }}>
          <div className="w-6 h-6 rounded-md bg-violet-100 flex items-center justify-center shrink-0">
            <GitBranch className="w-3.5 h-3.5 text-violet-500" />
          </div>
          <span className="text-slate-500 whitespace-nowrap" style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}>
            Model
          </span>
        </div>
        {[
          { icon: GitBranch,            label: "Decision Tree",     color: "#7C3AED", bg: "#F5F3FF" },
          { icon: SplitSquareHorizontal, label: "Entropy",          color: "#2563EB", bg: "#EFF6FF" },
          { icon: Layers,               label: "Depth: 5",          color: "#0891B2", bg: "#ECFEFF" },
          { icon: Database,             label: "12,330 Sessions",   color: "#D97706", bg: "#FFFBEB" },
          { icon: Gauge,                label: "87.4% Accuracy",    color: "#22C55E", bg: "#ECFDF5" },
        ].map((chip) => {
          const Icon = chip.icon;
          return (
            <div key={chip.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg shrink-0" style={{ background: chip.bg }}>
              <Icon className="w-3 h-3 shrink-0" style={{ color: chip.color }} />
              <span className="whitespace-nowrap" style={{ fontSize: "11px", fontWeight: 700, color: chip.color }}>{chip.label}</span>
            </div>
          );
        })}
      </div>
      )}

      {/* ── PREDICTION THRESHOLD SLIDER ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
              <MoveRight className="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <p className="text-slate-800" style={{ fontSize: "14px", fontWeight: 700 }}>
                Prediction Threshold
              </p>
              <p className="text-slate-400" style={{ fontSize: "11px" }}>
                Adjust threshold to control target segmentation
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-400" style={{ fontSize: "11px" }}>Threshold:</span>
            <div
              className="px-3 py-1.5 rounded-lg border"
              style={{ background: "#F8FAFC", borderColor: "#E2E8F0" }}
            >
              <span className="text-slate-800" style={{ fontSize: "15px", fontWeight: 800 }}>
                {threshold.toFixed(2)}
              </span>
            </div>
            <div
              className="px-3 py-1.5 rounded-lg"
              style={{ background: isPurchase ? "#ECFDF5" : "#FEF2F2" }}
            >
              <span style={{ fontSize: "12px", fontWeight: 700, color: resultColor }}>
                {isPurchase ? "→ Purchase" : "→ No Purchase"}
              </span>
            </div>
          </div>
        </div>

        {/* Slider */}
        <div className="relative mb-3">
          <div
            className="h-1.5 rounded-full absolute top-1/2 -translate-y-1/2 w-full"
            style={{
              background: `linear-gradient(to right, ${isPurchase ? "#22C55E" : "#EF4444"} 0%, ${isPurchase ? "#22C55E" : "#EF4444"} ${confidenceRatio * 100}%, #E2E8F0 ${confidenceRatio * 100}%, #E2E8F0 100%)`,
            }}
          />
          {/* Confidence marker */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full z-10"
            style={{ left: `${confidenceRatio * 100}%`, background: "#2563EB", marginLeft: "-1px" }}
          />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={threshold}
            onChange={(e) => setThreshold(parseFloat(e.target.value))}
            className="threshold-slider relative z-20 w-full h-6"
            style={{ background: "transparent" }}
          />
        </div>

        <div className="flex items-center justify-between text-slate-400" style={{ fontSize: "10px", fontWeight: 600 }}>
          <span>0.00 — Predict All</span>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-blue-500" style={{ fontWeight: 700 }}>
              Model Confidence: {CONFIDENCE}% (0.{CONFIDENCE})
            </span>
          </div>
          <span>1.00 — Predict None</span>
        </div>

        <div className="grid grid-cols-3 gap-2 md:gap-3 mt-4">
          {[
            { label: "Conservative", sublabel: "High Precision", value: 0.7, desc: "Fewer but more accurate predictions" },
            { label: "Balanced",     sublabel: "Default",        value: 0.5, desc: "Recommended for most use cases" },
            { label: "Aggressive",   sublabel: "High Recall",    value: 0.3, desc: "More predictions, higher false positives" },
          ].map((preset) => (
            <button
              key={preset.label}
              onClick={() => setThreshold(preset.value)}
              className="text-left px-2 md:px-3 py-2.5 rounded-xl border transition-all"
              style={{
                background: Math.abs(threshold - preset.value) < 0.05 ? "#EFF6FF" : "#F8FAFC",
                borderColor: Math.abs(threshold - preset.value) < 0.05 ? "#BFDBFE" : "#E2E8F0",
                minHeight: "44px",
              }}
            >
              <div className="flex flex-wrap items-center gap-1 mb-0.5">
                <p style={{ fontSize: "11px", fontWeight: 700, color: Math.abs(threshold - preset.value) < 0.05 ? "#2563EB" : "#475569" }}>
                  {preset.label}
                </p>
                <span className="px-1.5 py-0.5 rounded-full hidden sm:inline" style={{ fontSize: "9px", fontWeight: 600, background: "#F1F5F9", color: "#64748B" }}>
                  {preset.sublabel}
                </span>
              </div>
              <p className="text-slate-400 hidden md:block" style={{ fontSize: "10px" }}>{preset.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* ── Threshold vs Target Users Chart ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-5 gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-violet-50 border border-violet-100 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-violet-500" />
            </div>
            <div>
              <p className="text-slate-800" style={{ fontSize: "15px", fontWeight: 700 }}>Threshold vs Target Users</p>
              <p className="text-slate-400" style={{ fontSize: "11px" }}>
                Lower threshold increases campaign size but may reduce precision
              </p>
            </div>
          </div>
          <div className="px-3 py-1.5 rounded-xl border" style={{ background: "#F5F3FF", borderColor: "#DDD6FE" }}>
            <span className="text-violet-600" style={{ fontSize: "12px", fontWeight: 700 }}>
              ~{estimatedUsers.toLocaleString()} users at {threshold.toFixed(2)}
            </span>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={thresholdImpactData} margin={{ left: 4, right: 16, top: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis
              dataKey="threshold"
              tick={{ fontSize: 10, fill: "#94A3B8" }} tickLine={false} axisLine={false}
              tickFormatter={(v) => v.toFixed(1)}
              label={{ value: "Threshold", position: "insideBottomRight", offset: -4, style: { fontSize: 11, fill: "#94A3B8" } }}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#94A3B8" }} tickLine={false} axisLine={false}
              tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}K` : v}
              label={{ value: "Target Users", angle: -90, position: "insideLeft", style: { fontSize: 11, fill: "#94A3B8" } }}
            />
            <Tooltip content={<ThresholdTooltip />} />
            <ReferenceLine
              x={parseFloat(threshold.toFixed(1))}
              stroke="#2563EB" strokeWidth={2} strokeDasharray="4 3"
              label={{ value: `▼ ${threshold.toFixed(2)}`, position: "top", style: { fontSize: 10, fill: "#2563EB", fontWeight: 700 } }}
            />
            <Line type="monotone" dataKey="users" stroke="#7C3AED" strokeWidth={2.5} dot={false}
              activeDot={{ r: 5, fill: "#7C3AED", stroke: "white", strokeWidth: 2 }} />
          </LineChart>
        </ResponsiveContainer>

        <div className="flex items-start gap-3 mt-4 px-4 py-3 rounded-xl" style={{ background: "#F5F3FF", border: "1px solid #DDD6FE" }}>
          <AlertCircle className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />
          <p className="text-violet-700" style={{ fontSize: "12px", lineHeight: "1.5" }}>
            At threshold <strong>{threshold.toFixed(2)}</strong>, approximately{" "}
            <strong>{estimatedUsers.toLocaleString()} users</strong> would be targeted in your campaign.
            {threshold <= 0.35 && " High campaign volume — monitor precision closely."}
            {threshold > 0.35 && threshold <= 0.6 && " Balanced campaign size with good precision."}
            {threshold > 0.6 && " Conservative targeting — high precision, smaller audience."}
          </p>
        </div>
      </div>

      {/* Result banner + confidence — stack on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-5">
        {/* Result banner */}
        <div
          className="md:col-span-3 rounded-2xl p-6 md:p-8 relative overflow-hidden transition-all duration-500"
          style={{ background: resultGradient }}
        >
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-10"
            style={{ background: "white", transform: "translate(30%, -30%)" }} />
          <div className="relative z-10">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 md:mb-6"
              style={{ background: "rgba(255,255,255,0.2)" }}
            >
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span className="text-white" style={{ fontSize: "12px", fontWeight: 600 }}>
                Decision Tree Classification
              </span>
            </div>
            <h2 className="text-white mb-2" style={{ fontSize: "clamp(24px, 6vw, 36px)", fontWeight: 900, lineHeight: "1.1", letterSpacing: "-0.02em" }}>
              {resultLabel}
            </h2>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.75)", lineHeight: "1.6" }}>
              {resultDesc}
            </p>
            <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-6 md:mt-8">
              {[
                { label: "Classification", value: isPurchase ? "PURCHASE" : "NO PURCHASE" },
                { label: "Confidence",     value: `${CONFIDENCE}%` },
                { label: "Threshold",      value: threshold.toFixed(2) },
                { label: "Rules Applied",  value: "3 / 3" },
              ].map((s) => (
                <div key={s.label} className="px-3 py-2 rounded-xl" style={{ background: "rgba(255,255,255,0.2)" }}>
                  <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>{s.label}</p>
                  <p className="text-white" style={{ fontSize: "13px", fontWeight: 800 }}>{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Confidence gauge */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5 md:p-6 flex flex-col">
          <p className="text-slate-800 mb-5" style={{ fontSize: "14px", fontWeight: 700 }}>Confidence Score</p>
          <div className="flex items-center justify-center flex-1">
            <div className="relative flex items-center justify-center">
              <AnimatedArc value={CONFIDENCE} animate={arcReady} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-slate-800" style={{ fontSize: "32px", fontWeight: 900, lineHeight: "1" }}>
                  {CONFIDENCE}%
                </span>
                <span className="text-slate-400" style={{ fontSize: "11px", fontWeight: 600 }}>confidence</span>
              </div>
            </div>
          </div>
          <div className="space-y-3 mt-5">
            {[
              { label: "Purchase Probability",    pct: CONFIDENCE,       color: "#22C55E" },
              { label: "No Purchase Probability", pct: 100 - CONFIDENCE, color: "#EF4444" },
            ].map((row) => (
              <div key={row.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-500" style={{ fontSize: "12px" }}>{row.label}</span>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: row.color }}>{row.pct}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-1000"
                    style={{ width: arcReady ? `${row.pct}%` : "0%", background: row.color }} />
                </div>
              </div>
            ))}
            {/* Threshold line indicator */}
            <div className="mt-3 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-slate-500" style={{ fontSize: "11px" }}>Threshold</span>
                <span className="text-blue-600" style={{ fontSize: "12px", fontWeight: 700 }}>{(threshold * 100).toFixed(0)}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden relative">
                <div className="h-full rounded-full bg-blue-200" style={{ width: `${threshold * 100}%` }} />
                <div
                  className="absolute top-0 bottom-0 w-0.5 rounded-full"
                  style={{ left: `${threshold * 100}%`, background: "#2563EB" }}
                />
              </div>
            </div>
            <div className="mt-2 px-3 py-2 rounded-lg text-center transition-all"
              style={{ background: isPurchase ? "#ECFDF5" : "#FEF2F2" }}>
              <span style={{ fontSize: "12px", fontWeight: 700, color: resultColor }}>
                {isPurchase ? "High Confidence — Purchase Predicted" : "Below Threshold — No Purchase"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Decision Logic (Simplified) — Business View only ── */}
      {viewMode === "business" && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
              <GitBranch className="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <p className="text-slate-800" style={{ fontSize: "15px", fontWeight: 700 }}>
                Decision Logic (Simplified)
              </p>
              <p className="text-slate-400" style={{ fontSize: "11px" }}>
                The path through the model for this session
              </p>
            </div>
            <div
              className="ml-auto px-3 py-1 rounded-full"
              style={{ background: isPurchase ? "#ECFDF5" : "#FEF2F2", fontSize: "12px", fontWeight: 700, color: resultColor }}
            >
              {isPurchase ? "✓ Purchase Path" : "✗ No-Purchase Path"}
            </div>
          </div>

          {/* Tree diagram — scrollable on mobile */}
          <div className="overflow-x-auto -mx-2 px-2">
            <div style={{ minWidth: "340px" }}>
              <SimpleTreeDiagram activePath={isPurchase ? "buy" : "nobuy"} />
            </div>
          </div>

          <div className="flex items-center gap-5 mt-2 flex-wrap">
            {[
              { bg: "#EFF6FF", border: "#BFDBFE", label: "Decision node" },
              { bg: "#ECFDF5", border: "#A7F3D0", label: "Purchase outcome" },
              { bg: "#FEF2F2", border: "#FECACA", label: "No-purchase outcome" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ background: l.bg, border: `1.5px solid ${l.border}` }} />
                <span className="text-slate-500" style={{ fontSize: "11px" }}>{l.label}</span>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <div className="w-7 h-px" style={{ background: "#22C55E", height: "2px" }} />
              <span className="text-slate-500" style={{ fontSize: "11px" }}>Active path</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-7" style={{ borderTop: "1.5px dashed #E2E8F0" }} />
              <span className="text-slate-500" style={{ fontSize: "11px" }}>Inactive path</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Technical-only sections ── */}
      {viewMode === "technical" && (<>

      {/* Decision Tree Model section */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 md:p-7">
        <div className="flex items-center gap-2.5 mb-4 md:mb-6">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
            <GitBranch className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <p className="text-slate-800" style={{ fontSize: "15px", fontWeight: 700 }}>
              Decision Tree Model
            </p>
            <p className="text-slate-400" style={{ fontSize: "11px" }}>
              Model trained on historical e-commerce session data
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          {modelSteps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={i}
                className="rounded-xl p-4 md:p-5 border"
                style={{ background: step.bg, borderColor: step.color + "30" }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                  style={{ background: step.color + "20" }}
                >
                  <Icon className="w-4 h-4" style={{ color: step.color }} />
                </div>
                <p className="text-slate-800 mb-2" style={{ fontSize: "13px", fontWeight: 700 }}>
                  {step.title}
                </p>
                <p className="text-slate-500" style={{ fontSize: "12px", lineHeight: "1.6" }}>
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Decision Rule Explanation */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 md:p-7">
        <div className="flex items-center gap-2.5 mb-4 md:mb-6">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
            <FileText className="w-4 h-4 text-slate-300" />
          </div>
          <div>
            <p className="text-slate-800" style={{ fontSize: "15px", fontWeight: 700 }}>
              Decision Rule Explanation
            </p>
            <p className="text-slate-400" style={{ fontSize: "11px" }}>
              The path taken through the decision tree for this session
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-5 md:gap-6">
          {/* Rule trace */}
          <div className="md:col-span-3 space-y-3">
            {decisionRules.map((rule, i) => (
              <div key={i} className="flex items-center gap-3 md:gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "#ECFDF5" }}>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                  {i < decisionRules.length - 1 && (
                    <div className="w-px h-5 bg-slate-100 mt-1" />
                  )}
                </div>
                <div
                  className="flex-1 flex flex-wrap items-center gap-2 px-3 md:px-4 py-3 rounded-xl border"
                  style={{ background: "#F8FAFC", borderColor: "#E2E8F0" }}
                >
                  <span className="text-slate-400 shrink-0" style={{ fontSize: "11px", fontWeight: 700 }}>
                    {i === 0 ? "IF" : "AND"}
                  </span>
                  <code className="text-slate-800" style={{ fontSize: "12px", fontWeight: 600 }}>
                    {rule.condition}
                  </code>
                  <span
                    className="px-2 py-0.5 rounded-md"
                    style={{ fontSize: "12px", fontWeight: 800, background: "#ECFDF5", color: "#059669" }}
                  >
                    {rule.operator}
                  </span>
                  <code className="text-blue-600" style={{ fontSize: "12px", fontWeight: 700 }}>
                    {rule.threshold}
                  </code>
                  <div className="ml-auto">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                </div>
              </div>
            ))}
            <div className="flex items-center gap-3 md:gap-4 pt-1">
              <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "#ECFDF5" }}>
                <ChevronRight className="w-4 h-4 text-emerald-500" />
              </div>
              <div
                className="flex-1 flex flex-wrap items-center gap-2 md:gap-3 px-3 md:px-4 py-3 rounded-xl border"
                style={{ background: "#ECFDF5", borderColor: "#A7F3D0" }}
              >
                <span className="text-emerald-600" style={{ fontSize: "11px", fontWeight: 700 }}>
                  THEN
                </span>
                <span className="text-emerald-800" style={{ fontSize: "13px", fontWeight: 800 }}>
                  → Likely to Purchase
                </span>
                <span
                  className="ml-auto px-2.5 py-1 rounded-lg text-white"
                  style={{ fontSize: "12px", fontWeight: 700, background: "#059669" }}
                >
                  {CONFIDENCE}% confidence
                </span>
              </div>
            </div>
          </div>

          {/* Code block */}
          <div className="md:col-span-2">
            <div className="rounded-xl bg-slate-900 p-5 h-full">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="ml-2 text-slate-500" style={{ fontSize: "10px", fontWeight: 600 }}>
                  decision_rule.py
                </span>
              </div>
              <div className="space-y-1.5">
                <p style={{ fontSize: "12px", color: "#94A3B8" }}># Applied Decision Rule</p>
                <p style={{ fontSize: "12px", lineHeight: "1.8" }}>
                  <span style={{ color: "#C084FC" }}>IF</span>
                  <span style={{ color: "#F1F5F9" }}> Page_Value </span>
                  <span style={{ color: "#34D399" }}>&gt; 50</span>
                </p>
                <p style={{ fontSize: "12px", lineHeight: "1.8" }}>
                  <span style={{ color: "#60A5FA" }}>AND</span>
                  <span style={{ color: "#F1F5F9" }}> Bounce_Rate </span>
                  <span style={{ color: "#34D399" }}>&lt; 0.02</span>
                </p>
                <p style={{ fontSize: "12px", lineHeight: "1.8" }}>
                  <span style={{ color: "#60A5FA" }}>AND</span>
                  <span style={{ color: "#F1F5F9" }}> Exit_Rate </span>
                  <span style={{ color: "#34D399" }}>&lt; 0.04</span>
                </p>
                <div className="mt-3 pt-3 border-t border-slate-700">
                  <p style={{ fontSize: "12px", lineHeight: "1.8" }}>
                    <span style={{ color: "#C084FC" }}>THEN</span>
                    <span style={{ color: "#34D399" }}> "Likely to Purchase"</span>
                  </p>
                  <p style={{ fontSize: "11px", color: "#64748B", marginTop: "8px" }}>confidence = 0.85</p>
                  <p style={{ fontSize: "11px", color: "#64748B" }}>node_depth = 3</p>
                  <p style={{ fontSize: "11px", color: "#64748B" }}>samples_at_leaf = 1,204</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Session values */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-slate-800" style={{ fontSize: "14px", fontWeight: 700 }}>
            Session Values Used
          </p>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ background: "#F0F7FF" }}>
            <TrendingUp className="w-3 h-3 text-blue-500" />
            <span className="text-blue-600" style={{ fontSize: "11px", fontWeight: 600 }}>
              All signals processed
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {[
            { label: "Page Value", value: "68.4" },
            { label: "Bounce Rate", value: "0.015" },
            { label: "Exit Rate", value: "0.032" },
            { label: "Product Views", value: "12" },
            { label: "Visitor Type", value: "Returning" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl px-4 py-3 border text-center"
              style={{ background: "#ECFDF5", borderColor: "#A7F3D0" }}
            >
              <p
                className="text-slate-500"
                style={{ fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}
              >
                {item.label}
              </p>
              <p style={{ fontSize: "18px", fontWeight: 800, lineHeight: "1.3", color: "#059669" }}>
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      </>)}
    </div>
  );
}

/* ─────────────── MAIN EXPORT ─────────────── */
export function Prediction() {
  const { predictionPhase, markAnimationPlayed, animationPlayed } = useSession();

  // If analyzing and animation not yet played → show loading then reveal result
  if (predictionPhase === "analyzing" && !animationPlayed) {
    return <PredictionAnalyzing onComplete={markAnimationPlayed} />;
  }

  // Result is ready
  if (predictionPhase === "done" || (predictionPhase === "analyzing" && animationPlayed)) {
    return <PredictionResult />;
  }

  // Default empty state
  return <PredictionEmptyState />;
}