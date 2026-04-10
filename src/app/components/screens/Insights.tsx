import { useNavigate } from "react-router";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Target,
  Users,
  Zap,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  BarChart2,
  Lightbulb,
  RefreshCw,
  PieChart,
  Megaphone,
  MousePointerClick,
  Sparkles,
} from "lucide-react";
import { useSession } from "../../context/SessionContext";

const featureData = [
  { name: "Page Value", key: "page_value", importance: 38.4, color: "#3B82F6", desc: "Strongest predictor of purchase intent" },
  { name: "Bounce Rate", key: "bounce_rate", importance: 27.1, color: "#7C3AED", desc: "Inversely correlated with conversion" },
  { name: "Exit Rate", key: "exit_rate", importance: 19.8, color: "#059669", desc: "High exit = low purchase likelihood" },
  { name: "Product Views", key: "product_views", importance: 14.7, color: "#D97706", desc: "Session engagement indicator" },
];

const insights = [
  {
    icon: TrendingUp,
    title: "High Page Value Boosts Conversion",
    body: "Sessions with Page Value above 50 are 3.1× more likely to result in a purchase. This is the most impactful feature in the model.",
    metric: "3.1× more likely",
    color: "#059669",
    bg: "#ECFDF5",
    border: "#A7F3D0",
  },
  {
    icon: TrendingDown,
    title: "High Bounce Rate Reduces Likelihood",
    body: "Sessions with Bounce Rate above 5% show a 68% reduction in purchase probability. Reducing bounce rate is a critical lever.",
    metric: "−68% probability",
    color: "#DC2626",
    bg: "#FEF2F2",
    border: "#FECACA",
  },
  {
    icon: Users,
    title: "Returning Visitors Convert Better",
    body: "Returning visitors are 2.3× more likely to make a purchase compared to new visitors in the same session conditions.",
    metric: "2.3× conversion rate",
    color: "#2563EB",
    bg: "#EFF6FF",
    border: "#BFDBFE",
  },
  {
    icon: AlertTriangle,
    title: "High Exit Rate Signals Drop-Off Risk",
    body: "Exit rates above 8% are strongly correlated with session abandonment. Pages with high exit rates should be reviewed immediately.",
    metric: "Exit > 8% = risk",
    color: "#D97706",
    bg: "#FFFBEB",
    border: "#FDE68A",
  },
];

const recommendations = [
  {
    icon: Target,
    title: "Target High-Intent Users",
    desc: "Focus advertising spend on user segments with Page Values consistently above 50. These users convert 3.1× better and deliver the highest ROI.",
    priority: "High",
    effort: "Low",
    impact: 92,
  },
  {
    icon: RefreshCw,
    title: "Improve Engagement to Reduce Bounce Rate",
    desc: "Optimise landing page content, load speed, and relevance targeting. Every 1% reduction in Bounce Rate correlates with a 2.4% lift in conversions.",
    priority: "High",
    effort: "Medium",
    impact: 88,
  },
  {
    icon: Users,
    title: "Re-engage Returning Visitors",
    desc: "Deploy personalised retargeting campaigns and loyalty incentives for returning visitors. They convert 2.3× better than new visitors.",
    priority: "Medium",
    effort: "Low",
    impact: 75,
  },
  {
    icon: Zap,
    title: "Optimise High Exit-Rate Pages",
    desc: "Audit product pages with exit rates above 8%. Add exit-intent overlays, improve CTAs, and test alternate layouts to recover lost sessions.",
    priority: "Medium",
    effort: "High",
    impact: 68,
  },
];

const campaignData = [
  { icon: Megaphone,         label: "Predicted Buyers",   value: "3,809", sub: "High-intent sessions flagged by model", color: "#3B82F6", bg: "#EFF6FF" },
  { icon: MousePointerClick, label: "Actual Conversions", value: "3,241", sub: "Confirmed purchases recorded",          color: "#22C55E", bg: "#ECFDF5" },
  { icon: TrendingUp,        label: "Conversion Rate",    value: "85.1%", sub: "Prediction accuracy vs real purchases",  color: "#7C3AED", bg: "#F5F3FF" },
];

const campaignChartData = [
  { week: "Wk 1", predicted: 890, actual: 742 },
  { week: "Wk 2", predicted: 960, actual: 820 },
  { week: "Wk 3", predicted: 1040, actual: 882 },
  { week: "Wk 4", predicted: 919, actual: 797 },
];

const CampaignChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-slate-900 px-4 py-3 rounded-xl shadow-xl">
        <p className="text-slate-400 mb-1.5" style={{ fontSize: "11px", fontWeight: 600 }}>{label}</p>
        {payload.map((p: any) => (
          <p key={p.dataKey} style={{ fontSize: "12px", fontWeight: 700, color: p.fill }}>
            {p.dataKey === "predicted" ? "Predicted" : "Actual"}: {p.value.toLocaleString()}
          </p>
        ))}
        {payload.length === 2 && (
          <p className="text-slate-400 mt-1" style={{ fontSize: "10px" }}>
            Gap: {(payload[0].value - payload[1].value).toLocaleString()} (false positives)
          </p>
        )}
      </div>
    );
  }
  return null;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const d = featureData.find((f) => f.name === label);
    return (
      <div className="bg-slate-900 px-4 py-3 rounded-xl shadow-xl">
        <p className="text-slate-300 mb-1" style={{ fontSize: "11px", fontWeight: 600 }}>
          {label}
        </p>
        <p className="text-white" style={{ fontSize: "16px", fontWeight: 800 }}>
          {payload[0].value.toFixed(1)}%
        </p>
        {d && (
          <p className="text-slate-400 mt-1" style={{ fontSize: "11px" }}>
            {d.desc}
          </p>
        )}
      </div>
    );
  }
  return null;
};

function PriorityBadge({ priority }: { priority: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    High: { bg: "#FEE2E2", text: "#991B1B" },
    Medium: { bg: "#FEF9C3", text: "#854D0E" },
    Low: { bg: "#DCFCE7", text: "#166534" },
  };
  const c = colors[priority] ?? colors.Low;
  return (
    <span
      className="px-2 py-0.5 rounded-full"
      style={{ fontSize: "10px", fontWeight: 700, background: c.bg, color: c.text }}
    >
      {priority} Priority
    </span>
  );
}

function EffortBadge({ effort }: { effort: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    Low: { bg: "#DCFCE7", text: "#166534" },
    Medium: { bg: "#FEF9C3", text: "#854D0E" },
    High: { bg: "#FEE2E2", text: "#991B1B" },
  };
  const c = colors[effort] ?? colors.Medium;
  return (
    <span
      className="px-2 py-0.5 rounded-full"
      style={{ fontSize: "10px", fontWeight: 600, background: c.bg, color: c.text }}
    >
      {effort} Effort
    </span>
  );
}

/* ─────────────── EMPTY STATE ─────────────── */
function InsightsEmptyState() {
  const navigate = useNavigate();
  const { sessionPhase, predictionPhase, viewMode, loadSession, analyzeSession } = useSession();
  const sessionLoaded = sessionPhase === "loaded";
  const predictionDone = predictionPhase === "done" || predictionPhase === "analyzing";

  // Business View: trigger analysis and navigate to prediction to run the flow
  const handleStartAnalysisBusiness = () => {
    if (sessionPhase === "empty") loadSession();
    analyzeSession();
    navigate("/prediction");
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
            { label: "View Insights", active: false },
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
            { label: "Analyze", done: predictionDone },
            { label: "View Insights", active: true },
          ].map((s, i) => (
            <div key={s.label} className="flex items-center gap-2">
              {i > 0 && (
                <div
                  className="w-8 h-px"
                  style={{ background: s.done ? "#93C5FD" : "#E2E8F0" }}
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
        style={{ maxWidth: "520px", width: "100%" }}
      >
        {/* Icon area with mini ghost chart */}
        <div className="relative mb-6">
          <div
            className="w-24 h-20 rounded-2xl flex items-end justify-center gap-2 pb-4 px-4"
            style={{ background: "#F8FAFC", border: "1.5px dashed #CBD5E1" }}
          >
            {[60, 40, 75, 30].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm"
                style={{ height: `${h * 0.45}%`, background: "#E2E8F0" }}
              />
            ))}
          </div>
          <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center">
            <PieChart className="w-3 h-3 text-blue-400" />
          </div>
        </div>

        <h2
          className="text-slate-800 mb-2"
          style={{ fontSize: "20px", fontWeight: 800, letterSpacing: "-0.01em" }}
        >
          No Insights Available
        </h2>
        <p
          className="text-slate-400 mb-8"
          style={{ fontSize: "14px", lineHeight: "1.7", maxWidth: "360px" }}
        >
          {viewMode === "business"
            ? "Click Start Analysis to generate feature importance charts, key findings, and business recommendations."
            : "Insights will appear after a session is analyzed. Feature importance charts, key findings, and business recommendations will be displayed here."
          }
        </p>

        {/* Contextual CTA — adapts by role */}
        {viewMode === "business" ? (
          <button
            onClick={handleStartAnalysisBusiness}
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-sm hover:shadow-md active:scale-95 w-full justify-center"
            style={{ fontSize: "14px", fontWeight: 700, minHeight: "44px" }}
          >
            Start Analysis
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : !sessionLoaded ? (
          <button
            onClick={() => navigate("/session-data")}
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-sm hover:shadow-md active:scale-95"
            style={{ fontSize: "14px", fontWeight: 700 }}
          >
            Start: Load a Session
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : !predictionDone ? (
          <div className="flex flex-col items-center gap-3 w-full">
            <div
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border border-emerald-100"
              style={{ background: "#ECFDF5" }}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="text-emerald-700" style={{ fontSize: "12px", fontWeight: 600 }}>
                Session data ready — analyze it to unlock insights
              </span>
            </div>
            <button
              onClick={() => navigate("/session-data")}
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-sm hover:shadow-md active:scale-95 w-full justify-center"
              style={{ fontSize: "14px", fontWeight: 700 }}
            >
              Go Analyze Session
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : null}

        <p className="text-slate-300 mt-4" style={{ fontSize: "12px" }}>
          {viewMode === "business"
            ? "Powered by Decision Tree (CART) · 87.4% accuracy"
            : "Insights are generated automatically after model analysis"
          }
        </p>
      </div>

      {/* Preview tiles */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3" style={{ maxWidth: "520px", width: "100%" }}>
        {[
          { icon: BarChart2, label: "Feature Importance Chart", sub: "4 key predictors ranked" },
          { icon: Lightbulb, label: "Key Insights", sub: "Data-backed findings" },
          { icon: Target, label: "Business Recommendations", sub: "4 actionable strategies" },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="flex flex-col items-center gap-2 px-4 py-4 rounded-xl bg-white border border-slate-100 text-center"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center">
                <Icon className="w-4 h-4 text-slate-300" />
              </div>
              <p className="text-slate-600" style={{ fontSize: "11px", fontWeight: 700 }}>
                {item.label}
              </p>
              <p className="text-slate-400" style={{ fontSize: "10px" }}>
                {item.sub}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────── FULL INSIGHTS ─────────────── */
function InsightsFull() {
  const navigate = useNavigate();
  const { resetAll, viewMode } = useSession();

  const handleNewSession = () => {
    resetAll();
    navigate(viewMode === "business" ? "/" : "/session-data");
  };

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
      `}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-3">
            <BarChart2 className="w-3 h-3 text-blue-500" />
            <span
              className="text-blue-600 uppercase tracking-widest"
              style={{ fontSize: "10px", fontWeight: 700 }}
            >
              Model Insights
            </span>
          </div>
          <h1
            className="text-slate-800"
            style={{ fontSize: "clamp(22px, 5vw, 28px)", fontWeight: 800, lineHeight: "1.2", letterSpacing: "-0.02em" }}
          >
            Insights and Recommendations
          </h1>
          <p className="text-slate-500 mt-1.5" style={{ fontSize: "14px" }}>
            Derived from decision tree analysis of 24,891 e-commerce sessions
          </p>
        </div>
        <button
          onClick={() => navigate("/")}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors w-full sm:w-auto"
          style={{ fontSize: "13px", fontWeight: 600, minHeight: "44px" }}
        >
          Back to Overview
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Section A + B — stack on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-5">
        {/* Feature Importance */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5 md:p-6">
          <div className="flex items-center gap-2 mb-1">
            <BarChart2 className="w-4 h-4 text-blue-500" />
            <p className="text-slate-800" style={{ fontSize: "15px", fontWeight: 700 }}>
              Feature Importance
            </p>
          </div>
          <p className="text-slate-400 mb-4 md:mb-5" style={{ fontSize: "11px" }}>
            Contribution of each feature to the decision tree model
          </p>

          <ResponsiveContainer width="100%" height={180}>
            <BarChart
              data={featureData}
              layout="vertical"
              margin={{ left: -12, right: 16, top: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
              <XAxis
                type="number"
                domain={[0, 45]}
                tick={{ fontSize: 10, fill: "#94A3B8" }}
                tickLine={false}
                axisLine={false}
                unit="%"
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 11, fill: "#64748B", fontWeight: 600 }}
                tickLine={false}
                axisLine={false}
                width={96}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "#F8FAFC" }} />
              <Bar dataKey="importance" radius={[0, 8, 8, 0]} maxBarSize={22}>
                {featureData.map((entry) => (
                  <Cell key={`fi-cell-${entry.key}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-4 md:mt-5 space-y-3">
            {featureData.map((f) => (
              <div key={f.key} className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: f.color }} />
                <span className="text-slate-600 flex-1" style={{ fontSize: "12px" }}>
                  {f.name}
                </span>
                <div className="w-20 md:w-24 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(f.importance / 40) * 100}%`, background: f.color }}
                  />
                </div>
                <span
                  className="w-10 text-right"
                  style={{ fontSize: "12px", fontWeight: 700, color: f.color }}
                >
                  {f.importance}%
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 md:mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
            {[
              { label: "Accuracy", value: "87.4%" },
              { label: "Precision", value: "83.2%" },
              { label: "Recall", value: "79.6%" },
              { label: "F1 Score", value: "81.3%" },
            ].map((m) => (
              <div key={m.label} className="rounded-lg bg-slate-50 px-3 py-2 text-center">
                <p className="text-slate-400" style={{ fontSize: "10px", fontWeight: 600 }}>
                  {m.label}
                </p>
                <p className="text-slate-700" style={{ fontSize: "15px", fontWeight: 800 }}>
                  {m.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Key Insights */}
        <div className="md:col-span-3">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 md:p-6">
            <div className="flex items-center gap-2 mb-4 md:mb-5">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <p className="text-slate-800" style={{ fontSize: "15px", fontWeight: 700 }}>
                Key Insights
              </p>
              <span className="ml-auto px-2 py-0.5 rounded-full bg-amber-50 text-amber-600" style={{ fontSize: "11px", fontWeight: 600 }}>
                4 findings
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {insights.map((insight, i) => {
                const Icon = insight.icon;
                return (
                  <div
                    key={i}
                    className="rounded-xl p-4 border"
                    style={{ background: insight.bg, borderColor: insight.border }}
                  >
                    <div className="flex items-start gap-2.5 mb-2">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: insight.color + "20" }}
                      >
                        <Icon className="w-3.5 h-3.5" style={{ color: insight.color }} />
                      </div>
                      <p className="text-slate-800" style={{ fontSize: "12px", fontWeight: 700, lineHeight: "1.4" }}>
                        {insight.title}
                      </p>
                    </div>
                    <p className="text-slate-500 mb-3" style={{ fontSize: "11px", lineHeight: "1.6" }}>
                      {insight.body}
                    </p>
                    <div
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                      style={{ background: insight.color + "15" }}
                    >
                      <CheckCircle2 className="w-3 h-3" style={{ color: insight.color }} />
                      <span style={{ fontSize: "11px", fontWeight: 700, color: insight.color }}>
                        {insight.metric}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Business Recommendations — 1 col mobile, 2 cols sm, 4 cols desktop */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 md:mb-6">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Target className="w-4 h-4 text-blue-500" />
              <p className="text-slate-800" style={{ fontSize: "15px", fontWeight: 700 }}>
                Business Recommendations
              </p>
            </div>
            <p className="text-slate-400" style={{ fontSize: "11px" }}>
              Actionable strategies derived from model insights
            </p>
          </div>
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-100 w-fit"
            style={{ background: "#F0F7FF" }}
          >
            <Zap className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-blue-600" style={{ fontSize: "11px", fontWeight: 600 }}>
              4 action items
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {recommendations.map((rec, i) => {
            const Icon = rec.icon;
            return (
              <div
                key={i}
                className="bg-slate-50 rounded-xl border border-slate-100 p-4 md:p-5 hover:border-blue-200 hover:bg-blue-50/30 transition-all flex flex-col"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                    <Icon className="w-4 h-4 text-blue-500" />
                  </div>
                  <PriorityBadge priority={rec.priority} />
                </div>
                <p className="text-slate-800 mb-2" style={{ fontSize: "13px", fontWeight: 700, lineHeight: "1.4" }}>
                  {rec.title}
                </p>
                <p className="text-slate-500 flex-1" style={{ fontSize: "11px", lineHeight: "1.7" }}>
                  {rec.desc}
                </p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400" style={{ fontSize: "10px", fontWeight: 600 }}>
                      EXPECTED IMPACT
                    </span>
                    <EffortBadge effort={rec.effort} />
                  </div>
                  <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${rec.impact}%`,
                        background:
                          rec.impact >= 85 ? "#22C55E" : rec.impact >= 70 ? "#3B82F6" : "#F59E0B",
                      }}
                    />
                  </div>
                  <p
                    className="text-right"
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      color: rec.impact >= 85 ? "#16A34A" : rec.impact >= 70 ? "#2563EB" : "#D97706",
                    }}
                  >
                    {rec.impact}% potential
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Campaign Performance ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 md:mb-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
              <Megaphone className="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <p className="text-slate-800" style={{ fontSize: "15px", fontWeight: 700 }}>
                Campaign Performance
              </p>
              <p className="text-slate-400 hidden sm:block" style={{ fontSize: "11px" }}>
                Model prediction accuracy against actual conversions · Current month
              </p>
            </div>
          </div>
          <div
            className="px-3 py-1 rounded-full border w-fit"
            style={{ background: "#F0FDF4", borderColor: "#BBF7D0", fontSize: "11px", fontWeight: 700, color: "#15803D" }}
          >
            Live Tracking
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-4">
          {campaignData.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.label}
                className="rounded-2xl p-4 md:p-5 border"
                style={{ background: c.bg, borderColor: c.color + "30" }}
              >
                <div className="flex items-start justify-between mb-2 md:mb-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: c.color + "20" }}>
                    <Icon className="w-4 h-4" style={{ color: c.color }} />
                  </div>
                </div>
                <p style={{ fontSize: "clamp(22px, 5vw, 28px)", fontWeight: 900, color: c.color, lineHeight: "1" }}>{c.value}</p>
                <p className="text-slate-700 mt-1" style={{ fontSize: "12px", fontWeight: 700 }}>{c.label}</p>
                <p className="text-slate-400 mt-0.5" style={{ fontSize: "11px" }}>{c.sub}</p>
              </div>
            );
          })}
        </div>

        {/* Predicted vs Actual bar chart */}
        <div className="mt-4">
          <p className="text-slate-600 mb-3" style={{ fontSize: "12px", fontWeight: 700 }}>
            Predicted vs Actual Conversions — Weekly View
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={campaignChartData} margin={{ left: -8, right: 8, top: 4, bottom: 4 }} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#94A3B8" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} tickLine={false} axisLine={false}
                tickFormatter={(v) => v.toLocaleString()} />
              <Tooltip content={<CampaignChartTooltip />} cursor={{ fill: "#F8FAFC" }} />
              <Legend
                wrapperStyle={{ fontSize: "11px", fontWeight: 600, paddingTop: "8px" }}
                formatter={(value) => value === "predicted" ? "Predicted" : "Actual"}
              />
              <Bar dataKey="predicted" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={40} />
              <Bar dataKey="actual"    fill="#22C55E" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div
          className="flex items-start px-4 py-3 rounded-xl mt-4 gap-3"
          style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}
        >
          <p className="text-slate-500 flex-1" style={{ fontSize: "12px", lineHeight: "1.5" }}>
            <strong className="text-slate-700">85.1%</strong> of sessions predicted as "Likely to Purchase" resulted
            in a confirmed conversion — significantly above the baseline session conversion rate of 15.3%.
          </p>
        </div>
      </div>

      {/* ── Recommended Action card ── */}
      <div
        className="rounded-2xl p-5 md:p-6 border"
        style={{ background: "linear-gradient(135deg, #FFFBEB, #FEF3C7)", borderColor: "#FDE68A" }}
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#F59E0B20" }}>
            <Sparkles className="w-5 h-5" style={{ color: "#D97706" }} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <p className="text-slate-800" style={{ fontSize: "15px", fontWeight: 700 }}>
                Recommended Action
              </p>
              <span className="px-2 py-0.5 rounded-full" style={{ fontSize: "10px", fontWeight: 700, background: "#FEF9C3", color: "#92400E" }}>
                This Week
              </span>
            </div>
            <p className="text-slate-700" style={{ fontSize: "14px", lineHeight: "1.6" }}>
              <strong>Focus marketing efforts on high page value users this week.</strong> Sessions with Page Value above 50 convert 3.1× more — reallocating 20–30% of ad spend toward this segment could deliver significant ROI gains with minimal effort.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {[
                { label: "High Impact", color: "#15803D", bg: "#DCFCE7" },
                { label: "Low Effort", color: "#1D4ED8", bg: "#DBEAFE" },
                { label: "Immediate Action", color: "#92400E", bg: "#FEF3C7" },
              ].map((tag) => (
                <span
                  key={tag.label}
                  className="px-2.5 py-1 rounded-full"
                  style={{ fontSize: "11px", fontWeight: 600, color: tag.color, background: tag.bg }}
                >
                  {tag.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div
        className="rounded-2xl p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-blue-100"
        style={{ background: "linear-gradient(135deg, #EFF6FF, #F0F7FF)" }}
      >
        <div>
          <p className="text-slate-800 mb-1" style={{ fontSize: "15px", fontWeight: 700 }}>
            {viewMode === "business" ? "Ready to take action?" : "Complete System Analysis"}
          </p>
          <p className="text-slate-500" style={{ fontSize: "13px" }}>
            {viewMode === "business"
              ? "Return to the overview to review your prediction or start a new analysis."
              : "You've explored all 4 stages of the prediction pipeline. Start a new session to run another analysis."
            }
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleNewSession}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-blue-200 text-blue-600 bg-white hover:bg-blue-50 transition-colors"
            style={{ fontSize: "13px", fontWeight: 700, minHeight: "44px" }}
          >
            {viewMode === "business" ? "New Analysis" : "New Session"}
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
            style={{ fontSize: "13px", fontWeight: 700, minHeight: "44px" }}
          >
            Back to Overview
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── MAIN EXPORT ─────────────── */
export function Insights() {
  const { predictionPhase } = useSession();
  const isDone = predictionPhase === "done" || predictionPhase === "analyzing";

  if (!isDone) return <InsightsEmptyState />;
  return <InsightsFull />;
}