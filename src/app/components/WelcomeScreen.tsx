import { useState } from "react";
import { Brain, Briefcase, FlaskConical, ArrowRight, ShieldCheck, Lock, Eye, EyeOff, X } from "lucide-react";
import { useSession } from "../context/SessionContext";

const TECH_PIN = "1234";

export function WelcomeScreen() {
  const { enterDashboard } = useSession();
  const [pinMode, setPinMode] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<"business" | "technical" | null>(null);

  const handleBusinessView = () => {
    enterDashboard("business");
  };

  const handleTechnicalClick = () => {
    setPinMode(true);
    setPin("");
    setPinError(false);
  };

  const handlePinSubmit = () => {
    if (pin === TECH_PIN) {
      enterDashboard("technical");
    } else {
      setPinError(true);
      setPin("");
      setTimeout(() => setPinError(false), 2000);
    }
  };

  const handlePinKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handlePinSubmit();
    if (e.key === "Escape") { setPinMode(false); setPin(""); }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: "linear-gradient(160deg, #EFF6FF 0%, #F8FAFC 50%, #F0F7FF 100%)" }}
    >
      {/* Decorative blobs */}
      <div
        className="fixed top-0 left-0 w-[600px] h-[600px] rounded-full opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #BFDBFE, transparent)", transform: "translate(-30%, -30%)" }}
      />
      <div
        className="fixed bottom-0 right-0 w-[500px] h-[500px] rounded-full opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle, #DDD6FE, transparent)", transform: "translate(30%, 30%)" }}
      />

      <div className="relative z-10 w-full max-w-[560px]">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-lg"
            style={{ background: "linear-gradient(135deg, #1D4ED8, #3B82F6)" }}
          >
            <Brain className="w-8 h-8 text-white" />
          </div>
          <div className="text-center">
            <h1
              className="text-slate-800 mb-2"
              style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: "1.2" }}
            >
              E-commerce Purchase<br />Prediction System
            </h1>
            <p className="text-slate-500" style={{ fontSize: "15px", lineHeight: "1.6", maxWidth: "400px" }}>
              Predict user purchase behavior and support data-driven decisions
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap items-center justify-center gap-5 md:gap-6 mb-8 md:mb-10">
          {[
            { label: "Sessions Trained", value: "12,330" },
            { label: "Model Accuracy",   value: "87.4%" },
            { label: "Key Features",     value: "4 signals" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-slate-800" style={{ fontSize: "20px", fontWeight: 800, lineHeight: "1" }}>{s.value}</p>
              <p className="text-slate-400" style={{ fontSize: "11px", fontWeight: 500, marginTop: "3px" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Role cards */}
        {!pinMode ? (
          <div className="space-y-4">
            <p className="text-slate-400 text-center mb-5" style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Select your view to continue
            </p>

            {/* Business View */}
            <button
              onClick={handleBusinessView}
              onMouseEnter={() => setHoveredCard("business")}
              onMouseLeave={() => setHoveredCard(null)}
              className="w-full text-left rounded-2xl border-2 p-6 transition-all duration-200"
              style={{
                background: hoveredCard === "business" ? "#EFF6FF" : "white",
                borderColor: hoveredCard === "business" ? "#3B82F6" : "#E2E8F0",
                boxShadow: hoveredCard === "business" ? "0 4px 24px rgba(59,130,246,0.12)" : "0 1px 4px rgba(0,0,0,0.04)",
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all"
                  style={{ background: hoveredCard === "business" ? "#3B82F6" : "#EFF6FF" }}
                >
                  <Briefcase className="w-5 h-5" style={{ color: hoveredCard === "business" ? "white" : "#3B82F6" }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-slate-800" style={{ fontSize: "16px", fontWeight: 700 }}>Business View</p>
                    <span
                      className="px-2 py-0.5 rounded-full"
                      style={{ fontSize: "10px", fontWeight: 700, background: "#DCFCE7", color: "#15803D" }}
                    >
                      Recommended
                    </span>
                  </div>
                  <p className="text-slate-500 mb-4" style={{ fontSize: "13px", lineHeight: "1.6" }}>
                    Simplified view for marketing and UX teams. Shows predictions, insights, and campaign performance without technical complexity.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["Overview", "Prediction", "Insights"].map((tab) => (
                      <span key={tab} className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600" style={{ fontSize: "11px", fontWeight: 600 }}>
                        {tab}
                      </span>
                    ))}
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-300 shrink-0 mt-1 transition-all" style={{ color: hoveredCard === "business" ? "#3B82F6" : "#CBD5E1" }} />
              </div>
            </button>

            {/* Technical View */}
            <button
              onClick={handleTechnicalClick}
              onMouseEnter={() => setHoveredCard("technical")}
              onMouseLeave={() => setHoveredCard(null)}
              className="w-full text-left rounded-2xl border-2 p-6 transition-all duration-200"
              style={{
                background: hoveredCard === "technical" ? "#F5F3FF" : "white",
                borderColor: hoveredCard === "technical" ? "#7C3AED" : "#E2E8F0",
                boxShadow: hoveredCard === "technical" ? "0 4px 24px rgba(124,58,237,0.12)" : "0 1px 4px rgba(0,0,0,0.04)",
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all"
                  style={{ background: hoveredCard === "technical" ? "#7C3AED" : "#F5F3FF" }}
                >
                  <FlaskConical className="w-5 h-5" style={{ color: hoveredCard === "technical" ? "white" : "#7C3AED" }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-slate-800" style={{ fontSize: "16px", fontWeight: 700 }}>Technical View</p>
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: "#F5F3FF" }}>
                      <Lock className="w-2.5 h-2.5 text-violet-500" />
                      <span style={{ fontSize: "10px", fontWeight: 700, color: "#7C3AED" }}>PIN Required</span>
                    </div>
                  </div>
                  <p className="text-slate-500 mb-4" style={{ fontSize: "13px", lineHeight: "1.6" }}>
                    Full access including Model Analysis, Confusion Matrix, ROC Curve, and advanced feature importance metrics.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["Model Analysis", "Confusion Matrix", "ROC Curve", "Decision Rules"].map((tab) => (
                      <span key={tab} className="px-2.5 py-1 rounded-lg bg-violet-50 text-violet-600" style={{ fontSize: "11px", fontWeight: 600 }}>
                        {tab}
                      </span>
                    ))}
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 shrink-0 mt-1 transition-all" style={{ color: hoveredCard === "technical" ? "#7C3AED" : "#CBD5E1" }} />
              </div>
            </button>
          </div>
        ) : (
          /* PIN Input */
          <div
            className="bg-white rounded-2xl border-2 p-8 text-center"
            style={{ borderColor: pinError ? "#FCA5A5" : "#7C3AED22", boxShadow: "0 4px 24px rgba(124,58,237,0.10)" }}
          >
            <button
              onClick={() => { setPinMode(false); setPin(""); }}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ background: pinError ? "#FEF2F2" : "#F5F3FF" }}
            >
              <Lock className="w-6 h-6" style={{ color: pinError ? "#EF4444" : "#7C3AED" }} />
            </div>

            <h3 className="text-slate-800 mb-1.5" style={{ fontSize: "18px", fontWeight: 700 }}>
              Technical Access PIN
            </h3>
            <p className="text-slate-400 mb-6" style={{ fontSize: "13px" }}>
              Enter your PIN to access the Technical View
            </p>

            {/* PIN dots + input */}
            <div className="relative flex items-center justify-center mb-2">
              <div className="flex items-center gap-3 mb-1">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all"
                    style={{
                      borderColor: pinError ? "#FCA5A5" : pin.length > i ? "#7C3AED" : "#E2E8F0",
                      background: pinError ? "#FEF2F2" : pin.length > i ? "#F5F3FF" : "#F8FAFC",
                    }}
                  >
                    <span style={{ fontSize: "20px", fontWeight: 800, color: pinError ? "#EF4444" : "#7C3AED" }}>
                      {pin.length > i ? (showPin ? pin[i] : "•") : ""}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hidden input for typing */}
            <input
              type={showPin ? "text" : "password"}
              value={pin}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, "").slice(0, 4);
                setPin(v);
                setPinError(false);
              }}
              onKeyDown={handlePinKey}
              maxLength={4}
              autoFocus
              className="opacity-0 absolute w-1 h-1 pointer-events-none"
            />

            {pinError && (
              <p className="text-red-500 mb-4" style={{ fontSize: "12px", fontWeight: 600 }}>
                Incorrect PIN. Please try again.
              </p>
            )}

            <div className="flex items-center justify-center gap-2 mb-6">
              <button
                onClick={() => setShowPin(!showPin)}
                className="flex items-center gap-1.5 text-slate-400 hover:text-slate-600 transition-colors"
                style={{ fontSize: "12px" }}
              >
                {showPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                {showPin ? "Hide" : "Show"} PIN
              </button>
            </div>

            {/* Numpad */}
            <div className="grid grid-cols-3 gap-2 mb-5">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, "⌫"].map((k, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (k === null) return;
                    if (k === "⌫") { setPin((p) => p.slice(0, -1)); return; }
                    if (pin.length < 4) setPin((p) => p + k);
                  }}
                  disabled={k === null}
                  className="h-11 rounded-xl border border-slate-100 text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-colors disabled:invisible"
                  style={{ fontSize: "16px", fontWeight: k === "⌫" ? 500 : 700, background: "white" }}
                >
                  {k}
                </button>
              ))}
            </div>

            <button
              onClick={handlePinSubmit}
              disabled={pin.length < 4}
              className="w-full py-3 rounded-xl text-white transition-all"
              style={{
                background: pin.length === 4 ? "linear-gradient(135deg, #7C3AED, #6D28D9)" : "#E2E8F0",
                color: pin.length === 4 ? "white" : "#94A3B8",
                fontSize: "14px",
                fontWeight: 700,
                cursor: pin.length < 4 ? "not-allowed" : "pointer",
              }}
            >
              Unlock Technical View
            </button>

            <p className="text-slate-300 mt-4" style={{ fontSize: "11px" }}>
              Hint: Use the default PIN to continue
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-center gap-2 mt-8 text-slate-400" style={{ fontSize: "12px" }}>
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Decision Tree (CART) · 87.4% Accuracy · Online Shoppers Dataset</span>
        </div>
      </div>
    </div>
  );
}