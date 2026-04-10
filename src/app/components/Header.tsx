import { Brain, Activity, Bell, Settings, HelpCircle } from "lucide-react";

export function Header() {
  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 shrink-0 z-10">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-slate-800 tracking-tight" style={{ fontSize: "15px", fontWeight: 700, lineHeight: "1.2" }}>
            PurchaseIQ
          </h1>
          <p className="text-slate-400" style={{ fontSize: "11px", lineHeight: "1.2" }}>
            Decision Tree Prediction Engine
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-100">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-700" style={{ fontSize: "12px", fontWeight: 600 }}>Model Active</span>
        </div>
        <div className="ml-3 flex items-center gap-0.5">
          <button className="w-9 h-9 rounded-lg hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
            <Bell className="w-4.5 h-4.5" />
          </button>
          <button className="w-9 h-9 rounded-lg hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
            <HelpCircle className="w-4.5 h-4.5" />
          </button>
          <button className="w-9 h-9 rounded-lg hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
            <Settings className="w-4.5 h-4.5" />
          </button>
          <div className="ml-2 w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white" style={{ fontSize: "12px", fontWeight: 700 }}>
            AS
          </div>
        </div>
      </div>
    </header>
  );
}
