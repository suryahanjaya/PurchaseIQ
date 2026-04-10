import { useNavigate, Navigate } from "react-router";
import {
  Eye,
  Clock,
  TrendingDown,
  LogOut,
  Layers,
  UserCheck,
  CalendarDays,
  ArrowRight,
  Info,
  Wifi,
  Activity,
  Database,
  Sparkles,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import { useSession } from "../../context/SessionContext";

const sessionMetrics = [
  {
    id: "product-views",
    icon: Eye,
    label: "Product Views",
    sublabel: "ProductRelated",
    value: "12",
    unit: "pages",
    description: "Number of product-related pages visited",
    bar: 0.6,
    color: "#3B82F6",
    bg: "#EFF6FF",
  },
  {
    id: "time-on-pages",
    icon: Clock,
    label: "Time on Product Pages",
    sublabel: "ProductRelated_Duration",
    value: "340",
    unit: "seconds",
    description: "Total time spent on product pages",
    bar: 0.55,
    color: "#6366F1",
    bg: "#F5F3FF",
  },
  {
    id: "bounce-rate",
    icon: TrendingDown,
    label: "Bounce Rate",
    sublabel: "BounceRates",
    value: "1.5%",
    unit: "0.015",
    description: "% of single-page sessions with no interaction",
    bar: 0.15,
    color: "#22C55E",
    bg: "#ECFDF5",
  },
  {
    id: "exit-rate",
    icon: LogOut,
    label: "Exit Rate",
    sublabel: "ExitRates",
    value: "3.2%",
    unit: "0.032",
    description: "% of sessions ending on this page",
    bar: 0.32,
    color: "#22C55E",
    bg: "#ECFDF5",
  },
  {
    id: "page-value",
    icon: Layers,
    label: "Page Value",
    sublabel: "PageValues",
    value: "68.4",
    unit: "score",
    description: "Average value of pages visited before purchase",
    bar: 0.68,
    color: "#D97706",
    bg: "#FFFBEB",
  },
  {
    id: "visitor-type",
    icon: UserCheck,
    label: "Visitor Type",
    sublabel: "VisitorType",
    value: "Returning",
    unit: "visitor",
    description: "Whether this is a new or returning user",
    bar: null,
    tag: "Returning Visitor",
    tagColor: "#059669",
    tagBg: "#ECFDF5",
    color: "#059669",
    bg: "#ECFDF5",
  },
  {
    id: "traffic-source",
    icon: Wifi,
    label: "Traffic Source",
    sublabel: "TrafficType",
    value: "Type 2",
    unit: "channel",
    description: "Channel through which the user arrived",
    bar: null,
    tag: "Organic Search",
    tagColor: "#2563EB",
    tagBg: "#EFF6FF",
    color: "#2563EB",
    bg: "#EFF6FF",
  },
  {
    id: "weekend",
    icon: CalendarDays,
    label: "Weekend Indicator",
    sublabel: "Weekend",
    value: "No",
    unit: "session",
    description: "Whether the session occurred on a weekend",
    bar: null,
    tag: "Weekday",
    tagColor: "#64748B",
    tagBg: "#F1F5F9",
    color: "#64748B",
    bg: "#F8FAFC",
  },
];

function MiniBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="mt-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-slate-400" style={{ fontSize: "10px", fontWeight: 600 }}>
          Signal Strength
        </span>
        <span style={{ fontSize: "10px", fontWeight: 700, color }}>
          {Math.round(value * 100)}%
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${value * 100}%`, background: color }}
        />
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-slate-100" />
        <div className="w-10 h-5 rounded-full bg-slate-100" />
      </div>
      <div className="w-20 h-3 rounded bg-slate-100 mb-2" />
      <div className="w-28 h-3.5 rounded bg-slate-100 mb-3" />
      <div className="w-16 h-7 rounded bg-slate-100 mb-4" />
      <div className="w-full h-1.5 rounded bg-slate-100" />
    </div>
  );
}

export function SessionData() {
  const navigate = useNavigate();
  const { sessionPhase, loadSession, analyzeSession, viewMode } = useSession();

  // Business view: this screen is hidden — redirect to overview
  if (viewMode === "business") {
    return <Navigate to="/" replace />;
  }

  const isLoading = sessionPhase === "loading";
  const isLoaded = sessionPhase === "loaded";

  const handleAnalyze = () => {
    analyzeSession();
    navigate("/prediction");
  };

  /* ── EMPTY STATE ── */
  if (sessionPhase === "empty") {
    return (
      <div
        className="flex flex-col items-center justify-center px-4 md:px-8 py-10"
        style={{ minHeight: "calc(100vh - 64px)" }}
      >
        {/* Stepper hint */}
        <div className="flex items-center gap-2 mb-8 md:mb-10">
          {[
            { label: "Load Session", active: true },
            { label: "Analyze", active: false },
            { label: "View Results", active: false },
          ].map((s, i) => (
            <div key={s.label} className="flex items-center gap-2">
              {i > 0 && (
                <div className="w-8 h-px bg-slate-200" />
              )}
              <div className="flex items-center gap-1.5">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center"
                  style={{
                    background: s.active ? "#3B82F6" : "#E2E8F0",
                  }}
                >
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: 800,
                      color: s.active ? "white" : "#94A3B8",
                    }}
                  >
                    {i + 1}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: s.active ? "#1E293B" : "#94A3B8",
                  }}
                >
                  {s.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state card */}
        <div
          className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-8 md:p-12 text-center flex flex-col items-center w-full"
          style={{ maxWidth: "480px" }}
        >
          {/* Icon area */}
          <div className="relative mb-6">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center"
              style={{ background: "#F8FAFC", border: "1.5px dashed #CBD5E1" }}
            >
              <Database className="w-9 h-9 text-slate-300" />
            </div>
            {/* Orbiting dots */}
            <div
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center"
            >
              <div className="w-2 h-2 rounded-full bg-blue-400" />
            </div>
            <div
              className="absolute -bottom-1 -left-1 w-4 h-4 rounded-full bg-slate-100 border-2 border-white"
            />
          </div>

          <h2
            className="text-slate-800 mb-2"
            style={{ fontSize: "20px", fontWeight: 800, letterSpacing: "-0.01em" }}
          >
            No Session Data Loaded
          </h2>
          <p
            className="text-slate-400 mb-8"
            style={{ fontSize: "14px", lineHeight: "1.7", maxWidth: "320px" }}
          >
            Load a sample session to simulate user behavior and feed data into
            the prediction model.
          </p>

          <button
            onClick={loadSession}
            className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-sm hover:shadow-md active:scale-95 w-full justify-center"
            style={{ fontSize: "14px", fontWeight: 700, minHeight: "44px" }}
          >
            <Sparkles className="w-4 h-4" />
            Load Sample Session
          </button>

          <p className="text-slate-300 mt-4" style={{ fontSize: "12px" }}>
            Uses pre-configured e-commerce behavioral data
          </p>
        </div>

        {/* Info cards below */}
        <div className="flex flex-col sm:flex-row items-stretch gap-3 mt-6 md:mt-8 w-full" style={{ maxWidth: "480px" }}>
          {[
            { icon: Activity, label: "8 behavioral signals", sub: "Auto-collected" },
            { icon: CheckCircle2, label: "No upload needed", sub: "Simulated data" },
            { icon: ArrowRight, label: "One-click flow", sub: "Load → Analyze" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex-1 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-white border border-slate-100"
              >
                <Icon className="w-4 h-4 text-blue-400 shrink-0" />
                <div>
                  <p className="text-slate-700" style={{ fontSize: "11px", fontWeight: 700 }}>
                    {item.label}
                  </p>
                  <p className="text-slate-400" style={{ fontSize: "10px" }}>
                    {item.sub}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* ── LOADED / LOADING STATE ── */
  return (
    <div className="px-4 md:px-8 py-5 md:py-8 max-w-[1280px] mx-auto space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-3">
            <Activity className="w-3 h-3 text-blue-500" />
            <span
              className="text-blue-600 uppercase tracking-widest"
              style={{ fontSize: "10px", fontWeight: 700 }}
            >
              {isLoading ? "Loading Session…" : "Live Session"}
            </span>
          </div>
          <h1
            className="text-slate-800"
            style={{ fontSize: "clamp(22px, 5vw, 28px)", fontWeight: 800, lineHeight: "1.2", letterSpacing: "-0.02em" }}
          >
            User Session Data
          </h1>
          <p className="text-slate-500 mt-1.5" style={{ fontSize: "14px", lineHeight: "1.6" }}>
            Data is automatically collected from user session behavior
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          {isLoaded && (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span className="text-emerald-700" style={{ fontSize: "12px", fontWeight: 600 }}>
                8 / 8 Signals Collected
              </span>
            </div>
          )}
          {isLoaded && (
            <>
              <button
                onClick={loadSession}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors"
                style={{ fontSize: "13px", fontWeight: 600, minHeight: "44px" }}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reload
              </button>
              <button
                onClick={handleAnalyze}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
                style={{ fontSize: "13px", fontWeight: 700, minHeight: "44px" }}
              >
                Analyze Session
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Loading progress bar */}
      {isLoading && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-4 md:px-6 md:py-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-slate-700" style={{ fontSize: "13px", fontWeight: 700 }}>
              Collecting session signals…
            </p>
            <span className="text-blue-500" style={{ fontSize: "12px", fontWeight: 600 }}>
              Processing
            </span>
          </div>
          <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-blue-500"
              style={{ animation: "progressFill 1.1s ease-out forwards" }}
            />
          </div>
          <style>{`
            @keyframes progressFill {
              from { width: 0%; }
              to { width: 100%; }
            }
          `}</style>
          <div className="flex flex-wrap items-center gap-3 md:gap-6 mt-3">
            {["Behavioral tracking", "Page scoring", "Visitor profiling", "Traffic analysis"].map((s, i) => (
              <div key={s} className="flex items-center gap-1.5">
                <div
                  className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
                <span className="text-slate-400" style={{ fontSize: "11px" }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info banner — only when loaded */}
      {isLoaded && (
        <div
          className="flex items-start gap-3 px-4 md:px-5 py-4 rounded-xl border border-blue-100"
          style={{ background: "#F0F7FF" }}
        >
          <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-0.5">
              <p className="text-blue-800" style={{ fontSize: "13px", fontWeight: 600 }}>
                Sample Session Loaded Successfully
              </p>
              <span
                className="px-2 py-0.5 rounded-full"
                style={{ fontSize: "9px", fontWeight: 700, background: "#DBEAFE", color: "#1D4ED8", letterSpacing: "0.04em" }}
              >
                DEMO MODE
              </span>
            </div>
            <p className="text-blue-600" style={{ fontSize: "12px", lineHeight: "1.6", marginTop: "2px" }}>
              Demo mode using simulated session data. All 8 behavioral signals have been collected. Click{" "}
              <strong>Analyze Session</strong> to run the Decision Tree model.
            </p>
          </div>
        </div>
      )}

      {/* Metric cards — 2 cols on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          : sessionMetrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <div
                  key={metric.id}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-5 hover:border-blue-200 hover:shadow-md transition-all"
                  style={{ animation: "fadeSlideUp 0.4s ease both" }}
                >
                  <div className="flex items-start justify-between mb-3 md:mb-4">
                    <div
                      className="w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center"
                      style={{ background: metric.bg }}
                    >
                      <Icon className="w-4 h-4" style={{ color: metric.color }} />
                    </div>
                    <div
                      className="px-2 py-0.5 rounded-full"
                      style={{
                        background: metric.bg,
                        fontSize: "9px",
                        fontWeight: 700,
                        color: metric.color,
                        letterSpacing: "0.05em",
                      }}
                    >
                      AUTO
                    </div>
                  </div>

                  <p
                    className="text-slate-400 mb-0.5"
                    style={{
                      fontSize: "9px",
                      fontWeight: 700,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                    }}
                  >
                    {metric.sublabel}
                  </p>
                  <p className="text-slate-700 mb-1" style={{ fontSize: "11px", fontWeight: 600 }}>
                    {metric.label}
                  </p>

                  {"tag" in metric && metric.tag ? (
                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className="px-2 py-1 rounded-lg"
                        style={{
                          fontSize: "12px",
                          fontWeight: 700,
                          background: (metric as any).tagBg,
                          color: (metric as any).tagColor,
                        }}
                      >
                        {metric.tag}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-1.5 mt-2">
                      <span
                        className="text-slate-800"
                        style={{ fontSize: "clamp(20px, 4vw, 26px)", fontWeight: 800, lineHeight: "1" }}
                      >
                        {metric.value}
                      </span>
                      <span className="text-slate-400" style={{ fontSize: "11px", fontWeight: 500 }}>
                        {metric.unit}
                      </span>
                    </div>
                  )}

                  {metric.bar !== null && metric.bar !== undefined && (
                    <MiniBar value={metric.bar as number} color={metric.color} />
                  )}

                  <p className="text-slate-400 mt-2 hidden md:block" style={{ fontSize: "11px", lineHeight: "1.5" }}>
                    {metric.description}
                  </p>
                </div>
              );
            })}
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Bottom section — only when loaded */}
      {isLoaded && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5 md:p-6">
            <p className="text-slate-800 mb-4" style={{ fontSize: "14px", fontWeight: 700 }}>
              Data Quality & Collection Status
            </p>
            <div className="space-y-3">
              {[
                { label: "Behavioral Signals", count: "8 / 8", pct: 100, color: "#22C55E" },
                { label: "Data Completeness",  count: "100%",  pct: 100, color: "#22C55E" },
                { label: "Collection Latency", count: "< 50ms", pct: 98, color: "#3B82F6" },
                { label: "Anomalies Detected", count: "0",      pct: 100, color: "#22C55E" },
              ].map((row) => (
                <div key={row.label} className="flex items-center gap-3 md:gap-4">
                  <span className="text-slate-600 shrink-0 w-36 md:w-44" style={{ fontSize: "12px", fontWeight: 500 }}>
                    {row.label}
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${row.pct}%`, background: row.color }}
                    />
                  </div>
                  <span
                    className="w-12 md:w-16 text-right shrink-0"
                    style={{ fontSize: "12px", fontWeight: 700, color: row.color }}
                  >
                    {row.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 md:p-6">
            <p className="text-slate-800 mb-4" style={{ fontSize: "14px", fontWeight: 700 }}>
              Session Summary
            </p>
            <div className="space-y-3">
              {[
                { label: "Session ID",    value: "SES-2024-8821" },
                { label: "Start Time",   value: "14:32:07" },
                { label: "Duration",     value: "8m 42s" },
                { label: "Pages Visited", value: "17 total" },
                { label: "Device",       value: "Desktop" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between">
                  <span className="text-slate-400" style={{ fontSize: "12px" }}>
                    {row.label}
                  </span>
                  <span className="text-slate-700" style={{ fontSize: "12px", fontWeight: 600 }}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
            <button
              onClick={handleAnalyze}
              className="w-full mt-5 flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              style={{ fontSize: "13px", fontWeight: 700, minHeight: "44px" }}
            >
              Analyze Session
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}