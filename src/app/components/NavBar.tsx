import { NavLink } from "react-router";
import { Brain, CheckCircle2, Check, FlaskConical, Briefcase, LogOut } from "lucide-react";
import { useSession } from "../context/SessionContext";

export function NavBar() {
  const { sessionPhase, predictionPhase, viewMode, exitDashboard } = useSession();


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
    // Root.tsx re-renders WelcomeScreen automatically when hasEntered becomes false
  };

  return (
    <nav
      className="bg-white border-b border-slate-100 flex items-center px-4 md:px-6 shrink-0 overflow-hidden"
      style={{ height: "64px" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 mr-3 md:mr-4 shrink-0">
        <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm shrink-0">
          <Brain className="w-3.5 h-3.5 text-white" />
        </div>
        <div className="hidden sm:block">
          <span className="text-slate-800 block" style={{ fontSize: "13px", fontWeight: 800, lineHeight: "1" }}>
            PurchaseIQ
          </span>
          <span className="text-slate-400 block" style={{ fontSize: "9px", lineHeight: "1.4", fontWeight: 500 }}>
            Purchase Behavior Intelligence
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="hidden md:block w-px h-5 bg-slate-100 mr-3 shrink-0" />

      {/* Tabs */}
      <div className="hidden md:flex items-stretch gap-0 h-full overflow-hidden flex-1 min-w-0">
        {displayItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              `relative flex items-center gap-1.5 px-2.5 whitespace-nowrap transition-colors shrink-0 ${
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
                    className="w-4 h-4 rounded flex items-center justify-center shrink-0"
                    style={{ background: "#EFF6FF" }}
                  >
                    <FlaskConical style={{ width: 9, height: 9, color: "#2563EB" }} />
                  </span>
                ) : item.done && !isActive ? (
                  <span className="w-4 h-4 rounded flex items-center justify-center shrink-0" style={{ background: "#ECFDF5" }}>
                    <Check className="w-2.5 h-2.5" style={{ color: "#16A34A", strokeWidth: 3 }} />
                  </span>
                ) : (
                  <span
                    className="w-4 h-4 rounded flex items-center justify-center shrink-0"
                    style={{
                      background: isActive ? "#EFF6FF" : "#F8FAFC",
                      fontSize: "9px",
                      fontWeight: 800,
                      color: isActive ? "#2563EB" : "#94A3B8",
                    }}
                  >
                    {item.displayStep}
                  </span>
                )}
                <span style={{ fontSize: "12px", fontWeight: 600 }}>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-1.5 md:gap-2 shrink-0">

        {/* View mode badge */}
        <div
          className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg border"
          style={{
            background: viewMode === "business" ? "#F0F7FF" : "#F5F3FF",
            borderColor: viewMode === "business" ? "#BFDBFE" : "#DDD6FE",
          }}
        >
          {viewMode === "business"
            ? <Briefcase style={{ width: 9, height: 9, color: "#2563EB" }} />
            : <FlaskConical style={{ width: 9, height: 9, color: "#7C3AED" }} />
          }
          <span
            style={{
              fontSize: "10px",
              fontWeight: 700,
              color: viewMode === "business" ? "#1D4ED8" : "#6D28D9",
            }}
          >
            {viewMode === "business" ? "Business View" : "Technical View"}
          </span>
        </div>

        {/* Model Active badge — hidden in Technical view to save space */}
        {viewMode === "business" && (
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 rounded-full border border-emerald-100">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-emerald-700" style={{ fontSize: "10px", fontWeight: 600 }}>Model Active</span>
          </div>
        )}

        {/* v2.4.1 badge — business only */}
        {viewMode === "business" && (
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 rounded-full border border-slate-100">
            <CheckCircle2 className="w-3 h-3 text-blue-400" />
            <span className="text-slate-600" style={{ fontSize: "10px", fontWeight: 600 }}>v2.4.1</span>
          </div>
        )}

        {/* Avatar + Switch Role + exit */}
        <div className="flex items-center gap-1.5">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-white shrink-0"
            style={{ background: "linear-gradient(135deg, #60A5FA, #2563EB)", fontSize: "10px", fontWeight: 700 }}
          >
            {viewMode === "business" ? "BU" : "TE"}
          </div>
          <button
            onClick={handleSwitchRole}
            className="hidden sm:flex items-center gap-1 text-slate-400 hover:text-blue-600 transition-colors"
            style={{ fontSize: "10px", fontWeight: 600 }}
            title="Switch role"
          >
            Switch Role
          </button>
          <button
            onClick={handleSwitchRole}
            className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title="Back to role selection"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </nav>
  );
}