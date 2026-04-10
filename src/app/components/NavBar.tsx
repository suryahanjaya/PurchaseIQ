import { NavLink, useNavigate } from "react-router";
import { Brain, CheckCircle2, Check, FlaskConical, Briefcase, LogOut } from "lucide-react";
import { useSession } from "../context/SessionContext";

export function NavBar() {
  const { sessionPhase, predictionPhase, viewMode, exitDashboard } = useSession();
  const navigate = useNavigate();

  const sessionLoaded = sessionPhase === "loaded";
  const predictionDone = predictionPhase === "done" || predictionPhase === "analyzing";

  // Business view: Overview, Prediction, Insights only
  // Technical view: all screens
  const allNavItems = [
    { label: "Overview",       path: "/",               end: true,  step: "01", done: true,           showInBusiness: true  },
    { label: "Session Data",   path: "/session-data",               step: "02", done: sessionLoaded,  showInBusiness: false },
    { label: "Prediction",     path: "/prediction",                 step: "03", done: predictionDone, showInBusiness: true  },
    { label: "Insights",       path: "/insights",                   step: "04", done: predictionDone, showInBusiness: true  },
    { label: "Model Analysis", path: "/model-analysis",             step: "05", done: false,          showInBusiness: false },
  ];

  const navItems = allNavItems.filter(
    (item) => viewMode === "technical" || item.showInBusiness
  );

  // Recompute steps for display based on filtered items
  const displayItems = navItems.map((item, idx) => ({
    ...item,
    displayStep: String(idx + 1).padStart(2, "0"),
    technical: !item.showInBusiness && item.path === "/model-analysis",
  }));

  const handleSwitchRole = () => {
    exitDashboard();
    navigate("/");
  };

  return (
    <nav
      className="bg-white border-b border-slate-100 flex items-center px-4 md:px-8 shrink-0 flex-wrap gap-y-0"
      style={{ height: "64px" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 mr-4 md:mr-6">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm shrink-0">
          <Brain className="w-4 h-4 text-white" />
        </div>
        <div className="hidden sm:block">
          <span className="text-slate-800 block" style={{ fontSize: "14px", fontWeight: 800, lineHeight: "1" }}>
            PurchaseIQ
          </span>
          <span className="text-slate-400 block" style={{ fontSize: "10px", lineHeight: "1.4", fontWeight: 500 }}>
            Decision Tree Engine
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="hidden md:block w-px h-6 bg-slate-100 mr-5" />

      {/* Tabs — hidden on mobile (handled by bottom nav) */}
      <div className="hidden md:flex items-stretch gap-0.5 h-full overflow-x-auto">
        {displayItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              `relative flex items-center gap-2 px-3 md:px-4 whitespace-nowrap transition-colors ${
                isActive
                  ? "text-blue-600"
                  : item.done
                  ? "text-slate-600 hover:text-slate-800"
                  : "text-slate-400 hover:text-slate-500"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />
                )}
                {item.technical && !isActive ? (
                  <span
                    className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
                    style={{ background: "#EFF6FF", fontSize: "10px", fontWeight: 800, color: "#2563EB" }}
                  >
                    <FlaskConical style={{ width: 10, height: 10 }} />
                  </span>
                ) : item.done && !isActive ? (
                  <span className="w-5 h-5 rounded-md flex items-center justify-center shrink-0" style={{ background: "#ECFDF5" }}>
                    <Check className="w-3 h-3" style={{ color: "#16A34A", strokeWidth: 3 }} />
                  </span>
                ) : (
                  <span
                    className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
                    style={{
                      background: isActive ? "#EFF6FF" : "#F8FAFC",
                      fontSize: "10px",
                      fontWeight: 800,
                      color: isActive ? "#2563EB" : "#94A3B8",
                    }}
                  >
                    {item.displayStep}
                  </span>
                )}
                <span style={{ fontSize: "13px", fontWeight: 600 }}>{item.label}</span>
                {item.technical && viewMode === "technical" && !isActive && (
                  <span className="px-1.5 py-0.5 rounded-full" style={{ fontSize: "9px", fontWeight: 700, background: "#EFF6FF", color: "#2563EB" }}>
                    PRO
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Progress dots (desktop only) */}
      <div className="hidden md:flex mx-4 items-center gap-1">
        {displayItems.slice(0, 4).map((item, i) => (
          <div
            key={i}
            className="h-1 rounded-full transition-all duration-500"
            style={{ width: item.done ? "18px" : "6px", background: item.done ? "#3B82F6" : "#E2E8F0" }}
          />
        ))}
      </div>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-2 md:gap-3">

        {/* Technical Evaluation Mode label — technical view only */}
        {viewMode === "technical" && (
          <div
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-violet-200"
            style={{ background: "#F5F3FF" }}
          >
            <FlaskConical style={{ width: 10, height: 10, color: "#7C3AED" }} />
            <span style={{ fontSize: "10px", fontWeight: 700, color: "#7C3AED", letterSpacing: "0.03em" }}>
              Technical Evaluation Mode
            </span>
          </div>
        )}

        {/* Current view mode badge — non-interactive */}
        <div
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border"
          style={{
            background: viewMode === "business" ? "#F0F7FF" : "#F5F3FF",
            borderColor: viewMode === "business" ? "#BFDBFE" : "#DDD6FE",
          }}
        >
          {viewMode === "business"
            ? <Briefcase style={{ width: 10, height: 10, color: "#2563EB" }} />
            : <FlaskConical style={{ width: 10, height: 10, color: "#7C3AED" }} />
          }
          <span
            style={{
              fontSize: "11px",
              fontWeight: 700,
              color: viewMode === "business" ? "#1D4ED8" : "#6D28D9",
            }}
          >
            {viewMode === "business" ? "Business View" : "Technical View"}
          </span>
        </div>

        {/* Status badges (desktop only) */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-100">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-emerald-700" style={{ fontSize: "11px", fontWeight: 600 }}>Model Active</span>
        </div>
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100">
          <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-slate-600" style={{ fontSize: "11px", fontWeight: 600 }}>v2.4.1</span>
        </div>

        {/* Avatar + Switch Role + exit */}
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0"
            style={{ background: "linear-gradient(135deg, #60A5FA, #2563EB)", fontSize: "12px", fontWeight: 700 }}
          >
            {viewMode === "business" ? "BU" : "TE"}
          </div>
          {/* Switch Role text link */}
          <button
            onClick={handleSwitchRole}
            className="hidden sm:flex items-center gap-1 text-slate-400 hover:text-blue-600 transition-colors"
            style={{ fontSize: "11px", fontWeight: 600 }}
            title="Switch role"
          >
            Switch Role
          </button>
          <button
            onClick={handleSwitchRole}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title="Back to role selection"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  );
}