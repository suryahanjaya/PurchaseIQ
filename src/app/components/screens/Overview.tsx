import { useNavigate } from "react-router";
import {
  Database,
  GitBranch,
  Target,
  Lightbulb,
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Cpu,
  TrendingUp,
  Users,
  CheckCircle2,
  Layers,
  FlaskConical,
  SplitSquareHorizontal,
  Gauge,
  BarChart2,
  Megaphone,
  MousePointerClick,
  TrendingDown,
} from "lucide-react";
import { useSession } from "../../context/SessionContext";


const flowSteps = [
  {
    step: "01",
    icon: Database,
    title: "Session Data",
    desc: "Behavioral signals captured automatically from user activity",
    detail: "8 key features per session",
    color: "#3B82F6",
    bg: "#EFF6FF",
    border: "#BFDBFE",
  },
  {
    step: "02",
    icon: GitBranch,
    title: "Decision Tree",
    desc: "Entropy-based recursive feature splitting with rule generation",
    detail: "Max depth: 5 levels",
    color: "#7C3AED",
    bg: "#F5F3FF",
    border: "#DDD6FE",
  },
  {
    step: "03",
    icon: Target,
    title: "Prediction",
    desc: "Binary classification with confidence score output",
    detail: "Purchase / No Purchase",
    color: "#059669",
    bg: "#ECFDF5",
    border: "#A7F3D0",
  },
  {
    step: "04",
    icon: Lightbulb,
    title: "Insights",
    desc: "Feature importance analysis and business recommendations",
    detail: "Actionable strategies",
    color: "#D97706",
    bg: "#FFFBEB",
    border: "#FDE68A",
  },
];

const stats = [
  { icon: Users,       label: "Sessions Analyzed",  value: "24,891", delta: "+12.4% this month",  color: "#3B82F6" },
  { icon: ShieldCheck, label: "Model Accuracy",      value: "87.4%",  delta: "F1 Score: 81.3%",    color: "#22C55E" },
  { icon: TrendingUp,  label: "Purchase Rate",       value: "15.3%",  delta: "+2.1% vs baseline",  color: "#7C3AED" },
  { icon: Cpu,         label: "Avg. Inference Time", value: "< 1ms",  delta: "Real-time scoring",  color: "#D97706" },
];

const perfMetrics = [
  { label: "Accuracy",  value: 87.4, color: "#22C55E", desc: "Overall correct predictions" },
  { label: "Precision", value: 83.2, color: "#3B82F6", desc: "Predicted positives that are correct" },
  { label: "Recall",    value: 79.6, color: "#7C3AED", desc: "Actual positives correctly identified" },
  { label: "F1 Score",  value: 81.3, color: "#F59E0B", desc: "Harmonic mean of precision & recall" },
];

const modelInfoRows = [
  { label: "Algorithm",           value: "Decision Tree (CART)",         icon: GitBranch,             color: "#7C3AED", bg: "#F5F3FF" },
  { label: "Splitting Criterion", value: "Entropy (Information Gain)",    icon: SplitSquareHorizontal, color: "#2563EB", bg: "#EFF6FF" },
  { label: "Max Depth",           value: "5 levels",                      icon: Layers,                color: "#0891B2", bg: "#ECFEFF" },
  { label: "Training Data",       value: "12,330 sessions",               icon: Database,              color: "#D97706", bg: "#FFFBEB" },
  { label: "Target Variable",     value: "Revenue — Purchase Yes / No",   icon: Target,                color: "#059669", bg: "#ECFDF5" },
];

const campaignStats = [
  { icon: Megaphone,        label: "Predicted Buyers",    value: "3,809",  sub: "High-intent sessions",    color: "#3B82F6", bg: "#EFF6FF" },
  { icon: MousePointerClick, label: "Actual Conversions", value: "3,241",  sub: "Confirmed purchases",     color: "#22C55E", bg: "#ECFDF5" },
  { icon: TrendingUp,       label: "Conversion Rate",     value: "85.1%",  sub: "Prediction accuracy",     color: "#7C3AED", bg: "#F5F3FF" },
  { icon: TrendingDown,     label: "False Positive Rate", value: "14.9%",  sub: "Incorrectly flagged",     color: "#F59E0B", bg: "#FFFBEB" },
];

export function Overview() {
  const navigate = useNavigate();
  const { sessionPhase, predictionPhase, viewMode, loadSession, analyzeSession } = useSession();
  const sessionLoaded = sessionPhase === "loaded";
  const predictionDone = predictionPhase === "done";

  // Business: auto-load session then analyze → /prediction
  // Technical: go to /session-data first
  const handleStartAnalysis = () => {
    if (viewMode === "business") {
      if (sessionPhase === "loaded") {
        analyzeSession();
        navigate("/prediction");
      } else {
        loadSession();
        setTimeout(() => {
          analyzeSession();
          navigate("/prediction");
        }, 1350);
      }
    } else {
      navigate("/session-data");
    }
  };

  return (
    <div className="px-4 md:px-8 py-5 md:py-8 max-w-[1280px] mx-auto space-y-4 md:space-y-6">

      {/* ── 1. HERO ── */}
      <div
        className="rounded-2xl p-5 md:p-8 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1D4ED8 0%, #2563EB 40%, #3B82F6 100%)" }}
      >
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full opacity-10"
          style={{ background: "white", transform: "translate(30%, -40%)" }} />
        <div className="absolute bottom-0 left-[40%] w-[200px] h-[200px] rounded-full opacity-5"
          style={{ background: "white", transform: "translateY(50%)" }} />

        {/* Mobile layout */}
        <div className="relative z-10">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
            style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white" style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.04em" }}>
              SYSTEM OVERVIEW
            </span>
          </div>
          <h1 className="text-white mb-3" style={{ fontSize: "clamp(22px, 5vw, 32px)", fontWeight: 800, lineHeight: "1.2", letterSpacing: "-0.02em" }}>
            E-commerce Purchase<br />Prediction System
          </h1>
          <p className="mb-5 md:mb-6" style={{ fontSize: "14px", lineHeight: "1.7", color: "rgba(255,255,255,0.75)", maxWidth: "520px" }}>
            {viewMode === "business"
              ? "Identify which users are likely to purchase and take action — powered by a Decision Tree model running on real session behavior."
              : "Predicts whether a user will make a purchase based on session behavior using a Decision Tree model — enabling data-driven decisions for marketing and UX teams."
            }
          </p>
          {/* Single primary CTA */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={handleStartAnalysis}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-blue-700 hover:bg-blue-50 transition-colors"
              style={{ fontSize: "13px", fontWeight: 700, minHeight: "44px" }}
            >
              {predictionDone ? "View Prediction" : "Start Analysis"} <ArrowRight className="w-4 h-4" />
            </button>
            {viewMode === "technical" && (
              <button
                onClick={() => navigate("/model-analysis")}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border text-white hover:bg-white/10 transition-colors"
                style={{ fontSize: "13px", fontWeight: 600, borderColor: "rgba(255,255,255,0.3)", minHeight: "44px" }}
              >
                Model Analysis <ArrowUpRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Mobile stat cards — shown below buttons on mobile */}
          <div className="grid grid-cols-3 gap-3 mt-5 md:hidden">
            {[
              { label: "Accuracy", val: "87.4%" },
              { label: "Sessions", val: "24.8K" },
              { label: "Features", val: "4 Key" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl px-3 py-3 text-center"
                style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)" }}
              >
                <div className="text-white" style={{ fontSize: "18px", fontWeight: 800, lineHeight: "1" }}>{s.val}</div>
                <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.65)", fontWeight: 500, marginTop: "2px" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Hero stat pills — desktop only (absolute position) */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-3" style={{ zIndex: 10 }}>
          {[
            { label: "Accuracy", val: "87.4%" },
            { label: "Sessions", val: "24.8K" },
            { label: "Features", val: "4 Key" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl px-5 py-3 text-right"
              style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)" }}
            >
              <div className="text-white" style={{ fontSize: "22px", fontWeight: 800, lineHeight: "1" }}>{s.val}</div>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 2. MODEL EVALUATION SUMMARY ── Technical View only */}
      {viewMode === "technical" && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 md:p-6">
          <div className="flex items-start justify-between mb-5 md:mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                <Gauge className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <p className="text-slate-800" style={{ fontSize: "15px", fontWeight: 700 }}>
                  Model Evaluation Summary
                </p>
                <p className="text-slate-400" style={{ fontSize: "11px" }}>
                  Evaluated on held-out test set · 2,466 sessions
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/model-analysis")}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
              style={{ fontSize: "12px", fontWeight: 700 }}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              View Model Analysis
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-5 md:mb-6">
            {perfMetrics.map((m) => (
              <div
                key={m.label}
                className="rounded-2xl p-4 md:p-5 border text-center"
                style={{ background: m.color + "08", borderColor: m.color + "22" }}
              >
                <p style={{ fontSize: "clamp(22px, 5vw, 28px)", fontWeight: 900, color: m.color, lineHeight: "1" }}>
                  {m.value.toFixed(1)}<span style={{ fontSize: "13px" }}>%</span>
                </p>
                <p className="text-slate-700 mt-1" style={{ fontSize: "12px", fontWeight: 700 }}>{m.label}</p>
                <p className="text-slate-400 mt-0.5 hidden md:block" style={{ fontSize: "10px" }}>{m.desc}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {perfMetrics.map((m) => (
              <div key={`pb-${m.label}`}>
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: m.color }} />
                    <span className="text-slate-600" style={{ fontSize: "11px", fontWeight: 600 }}>{m.label}</span>
                  </div>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: m.color }}>{m.value}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${m.value}%`, background: m.color }} />
                </div>
              </div>
            ))}
          </div>

          <div
            className="mt-4 md:mt-5 flex flex-col sm:flex-row items-start sm:items-center gap-3 px-4 py-3 rounded-xl"
            style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <p className="text-emerald-700 flex-1" style={{ fontSize: "12px", lineHeight: "1.5" }}>
              <strong>Model demonstrates balanced performance and reliable prediction capability</strong> — Accuracy of 87.4% with F1 Score of 81.3% indicates strong generalisation on unseen e-commerce sessions.
            </p>
            <button
              onClick={() => navigate("/model-analysis")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-emerald-700 hover:bg-emerald-100 transition-colors shrink-0"
              style={{ fontSize: "11px", fontWeight: 700 }}
            >
              Full analysis <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}


      {/* ── 3. MODEL INFO + SYSTEM PIPELINE ── */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-5">

        {/* Left card: Business = How It Works compact; Technical = Model Information */}
        {viewMode === "business" ? (
          <div className="md:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5 md:p-6 flex flex-col">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                <Cpu className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <p className="text-slate-800" style={{ fontSize: "15px", fontWeight: 700 }}>How the Model Works</p>
                <p className="text-slate-400" style={{ fontSize: "11px" }}>3-step prediction pipeline</p>
              </div>
            </div>
            <div className="flex-1 space-y-3">
              {[
                { n: "1", label: "Collect Session Signals", desc: "Page value, bounce rate, exit rate, product views from the user's browsing session.", color: "#3B82F6", bg: "#EFF6FF" },
                { n: "2", label: "Run Decision Tree Model", desc: "CART algorithm applies IF-THEN rules to classify the session as purchase or no-purchase.", color: "#7C3AED", bg: "#F5F3FF" },
                { n: "3", label: "Generate Prediction", desc: "Returns a purchase likelihood score and confidence level for targeting decisions.", color: "#059669", bg: "#ECFDF5" },
              ].map((step) => (
                <div key={step.n} className="flex items-start gap-3 px-3 py-3 rounded-xl" style={{ background: step.bg, border: `1px solid ${step.color}20` }}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: step.color + "20" }}>
                    <span style={{ fontSize: "12px", fontWeight: 800, color: step.color }}>{step.n}</span>
                  </div>
                  <div>
                    <p style={{ fontSize: "12px", fontWeight: 700, color: "#1E293B" }}>{step.label}</p>
                    <p className="mt-0.5" style={{ fontSize: "11px", color: "#64748B", lineHeight: "1.5" }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="md:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5 md:p-6 flex flex-col">
            <div className="flex items-center gap-2.5 mb-4 md:mb-5">
              <div className="w-8 h-8 rounded-lg bg-violet-50 border border-violet-100 flex items-center justify-center">
                <FlaskConical className="w-4 h-4 text-violet-500" />
              </div>
              <div>
                <p className="text-slate-800" style={{ fontSize: "15px", fontWeight: 700 }}>Model Information</p>
                <p className="text-slate-400" style={{ fontSize: "11px" }}>Decision Tree configuration</p>
              </div>
            </div>

            <div className="flex-1 space-y-0.5">
              {modelInfoRows.map((row, i) => {
                const Icon = row.icon;
                return (
                  <div
                    key={row.label}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                    style={{ borderBottom: i < modelInfoRows.length - 1 ? "1px solid #F8FAFC" : "none" }}
                  >
                    <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0" style={{ background: row.bg }}>
                      <Icon className="w-3 h-3" style={{ color: row.color }} />
                    </div>
                    <span className="text-slate-400 shrink-0" style={{ fontSize: "11px", fontWeight: 600, minWidth: "100px" }}>
                      {row.label}
                    </span>
                    <span className="text-slate-700 ml-auto text-right" style={{ fontSize: "12px", fontWeight: 700 }}>
                      {row.value}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 md:mt-5 space-y-2">
              <div className="px-3 py-3 rounded-xl" style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                <p className="text-slate-500" style={{ fontSize: "11px", fontWeight: 700, marginBottom: "2px" }}>
                  Dataset
                </p>
                <p className="text-slate-600" style={{ fontSize: "12px", lineHeight: "1.5" }}>
                  Online Shoppers Purchasing Intention Dataset
                </p>
                <p className="text-slate-400" style={{ fontSize: "11px", marginTop: "2px" }}>
                  12,330 sessions · 18 features
                </p>
              </div>
              <div className="px-3 py-2.5 rounded-xl flex items-start gap-2" style={{ background: "#F5F3FF", border: "1px solid #DDD6FE" }}>
                <CheckCircle2 className="w-3.5 h-3.5 text-violet-400 mt-0.5 shrink-0" />
                <p className="text-violet-600" style={{ fontSize: "11px", lineHeight: "1.5" }}>
                  Model implemented using custom Decision Tree algorithm (CART)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* System Pipeline */}

        <div className="md:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-sm p-5 md:p-6">
          <div className="flex items-center justify-between mb-4 md:mb-5">
            <div>
              <p className="text-slate-400 uppercase tracking-widest mb-0.5" style={{ fontSize: "10px", fontWeight: 700 }}>
                System Pipeline
              </p>
              <h2 className="text-slate-800" style={{ fontSize: "15px", fontWeight: 700 }}>
                How the Prediction System Works
              </h2>
            </div>
            <button
              onClick={handleStartAnalysis}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
              style={{ fontSize: "12px", fontWeight: 600 }}
            >
              Try it <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {flowSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.step} className="flex items-center gap-3">
                  {/* Step number + icon */}
                  <div className="flex items-center gap-2 md:gap-3 w-36 md:w-48 shrink-0">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: step.color + "18" }}
                    >
                      <Icon className="w-4 h-4" style={{ color: step.color }} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-slate-800 truncate" style={{ fontSize: "12px", fontWeight: 700 }}>{step.title}</p>
                      <p className="truncate" style={{ fontSize: "10px", color: step.color, fontWeight: 600 }}>{step.detail}</p>
                    </div>
                  </div>

                  {/* Connector */}
                  {i < flowSteps.length - 1 && (
                    <div className="w-4 shrink-0 flex items-center">
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
                    </div>
                  )}

                  {/* Description bar */}
                  <div
                    className="flex-1 rounded-xl px-3 py-2.5 border min-w-0"
                    style={{ background: step.bg, borderColor: step.border }}
                  >
                    <p className="text-slate-600" style={{ fontSize: "11px", lineHeight: "1.5" }}>{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 4. STATS ROW ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: stat.color + "15" }}>
                  <Icon className="w-4 h-4" style={{ color: stat.color }} />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-300" />
              </div>
              <p className="text-slate-800" style={{ fontSize: "clamp(18px, 4vw, 24px)", fontWeight: 800, lineHeight: "1" }}>{stat.value}</p>
              <p className="text-slate-400 mt-1" style={{ fontSize: "11px", fontWeight: 600 }}>{stat.label}</p>
              <p className="mt-1.5" style={{ fontSize: "11px", color: "#22C55E", fontWeight: 600 }}>{stat.delta}</p>
            </div>
          );
        })}
      </div>

      {/* ── 5. CAMPAIGN PERFORMANCE ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 md:p-6">
        <div className="flex items-center justify-between mb-4 md:mb-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
              <Megaphone className="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <p className="text-slate-800" style={{ fontSize: "15px", fontWeight: 700 }}>Campaign Performance</p>
              <p className="text-slate-400 hidden sm:block" style={{ fontSize: "11px" }}>
                Prediction accuracy against actual conversions · Current month
              </p>
            </div>
          </div>
          <div
            className="px-3 py-1 rounded-full border"
            style={{ background: "#F0FDF4", borderColor: "#BBF7D0", fontSize: "11px", fontWeight: 700, color: "#15803D" }}
          >
            Live
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {campaignStats.map((c) => {
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
                <p style={{ fontSize: "clamp(20px, 5vw, 26px)", fontWeight: 900, color: c.color, lineHeight: "1" }}>{c.value}</p>
                <p className="text-slate-700 mt-1" style={{ fontSize: "12px", fontWeight: 700 }}>{c.label}</p>
                <p className="text-slate-400 mt-0.5" style={{ fontSize: "11px" }}>{c.sub}</p>
              </div>
            );
          })}
        </div>

        <div
          className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 py-3 rounded-xl gap-3"
          style={{ background: "#FAFBFF", border: "1px solid #E2E8F0" }}
        >
          <p className="text-slate-500" style={{ fontSize: "12px" }}>
            <strong className="text-slate-700">85.1%</strong> of sessions predicted as "Likely to Purchase" resulted in a confirmed conversion — exceeding the baseline conversion rate of 15.3%.
          </p>
          <button
            onClick={() => navigate("/insights")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors shrink-0 w-full sm:w-auto justify-center"
            style={{ fontSize: "12px", fontWeight: 600, minHeight: "44px" }}
          >
            View Insights <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── BOTTOM CTA ── */}
      <div
        className="rounded-2xl p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-blue-100"
        style={{ background: "#F0F7FF" }}
      >
        <div>
          <p className="text-slate-800 mb-1" style={{ fontSize: "15px", fontWeight: 700 }}>
            {viewMode === "business"
              ? "Ready to identify high-intent users?"
              : sessionLoaded ? "Session data ready — run your analysis" : "Ready to analyze a user session?"
            }
          </p>
          <p className="text-slate-500" style={{ fontSize: "13px" }}>
            {viewMode === "business"
              ? "Click Start Analysis to run the model and see which users are likely to purchase."
              : sessionLoaded
              ? "Navigate to Session Data and click Analyze Session to generate a prediction."
              : "Navigate through the tabs to explore session data, run predictions, and view insights."
            }
          </p>
        </div>
        <button
          onClick={handleStartAnalysis}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm w-full sm:w-auto shrink-0"
          style={{ fontSize: "13px", fontWeight: 700, minHeight: "44px" }}
        >
          {predictionDone ? "View Prediction" : "Start Analysis"}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}