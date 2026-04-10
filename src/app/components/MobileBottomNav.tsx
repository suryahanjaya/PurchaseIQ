import { NavLink } from "react-router";
import { LayoutDashboard, Database, Target, Lightbulb, FlaskConical } from "lucide-react";
import { useSession } from "../context/SessionContext";

const allMobileNavItems = [
  { label: "Overview",   path: "/",              end: true,  icon: LayoutDashboard, showInBusiness: true  },
  { label: "Session",    path: "/session-data",              icon: Database,        showInBusiness: false },
  { label: "Prediction", path: "/prediction",                icon: Target,          showInBusiness: true  },
  { label: "Insights",   path: "/insights",                  icon: Lightbulb,       showInBusiness: true  },
  { label: "Model",      path: "/model-analysis",            icon: FlaskConical,    showInBusiness: false },
];

export function MobileBottomNav() {
  const { sessionPhase, predictionPhase, viewMode } = useSession();
  const sessionLoaded  = sessionPhase === "loaded";
  const predictionDone = predictionPhase === "done" || predictionPhase === "analyzing";

  const mobileNavItems = allMobileNavItems.filter(
    (item) => viewMode === "technical" || item.showInBusiness
  );

  const isDone = (path: string) => {
    if (path === "/")             return true;
    if (path === "/session-data") return sessionLoaded;
    if (path === "/prediction")   return predictionDone;
    if (path === "/insights")     return predictionDone;
    return false;
  };

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 z-50"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex items-stretch" style={{ height: "60px" }}>
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const done = isDone(item.path);
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors ${
                  isActive ? "text-blue-600" : done ? "text-slate-500" : "text-slate-300"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                    style={{
                      background: isActive ? "#EFF6FF" : "transparent",
                      transform: isActive ? "scale(1.05)" : "scale(1)",
                    }}
                  >
                    <Icon className="w-[18px] h-[18px]" />
                  </div>
                  <span style={{ fontSize: "10px", fontWeight: isActive ? 700 : 500 }}>
                    {item.label}
                  </span>
                  {/* Active underline dot */}
                  {isActive && (
                    <div
                      className="absolute bottom-0 w-1 h-1 rounded-full bg-blue-600"
                      style={{ marginTop: "auto" }}
                    />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}