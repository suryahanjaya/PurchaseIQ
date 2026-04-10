import { useState } from "react";
import {
  Brain, Briefcase, FlaskConical, ArrowRight, ShieldCheck,
  Lock, Eye, EyeOff, BarChart2, GitBranch, Target, CheckCircle2,
} from "lucide-react";
import { useSession } from "../context/SessionContext";

const TECH_PASSWORD = "Q26SCvgYUZX20";

type AuthMode = "none" | "technical";

export function WelcomeScreen() {
  const { enterDashboard } = useSession();
  const [authMode, setAuthMode] = useState<AuthMode>("none");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleBusinessClick = () => {
    enterDashboard("business");
  };

  const handleTechnicalClick = () => {
    setAuthMode("technical");
    setPassword("");
    setPasswordError(false);
  };

  const handleTechnicalSubmit = () => {
    if (password === TECH_PASSWORD) {
      enterDashboard("technical");
    } else {
      setPasswordError(true);
      setPassword("");
      setTimeout(() => setPasswordError(false), 2000);
    }
  };

  const handlePasswordKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleTechnicalSubmit();
    if (e.key === "Escape") { setAuthMode("none"); setPassword(""); }
  };

  const features = [
    { icon: BarChart2, label: "87.4% Model Accuracy", color: "#22C55E", bg: "#ECFDF5" },
    { icon: GitBranch, label: "Decision Tree (CART)", color: "#7C3AED", bg: "#F5F3FF" },
    { icon: Target,    label: "12,330 Training Sessions", color: "#3B82F6", bg: "#EFF6FF" },
  ];

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 md:px-8"
      style={{ background: "linear-gradient(145deg, #0F172A 0%, #1E293B 50%, #0F1F3D 100%)" }}
    >
      {/* Decorative blobs */}
      <div
        className="fixed top-0 left-0 w-[700px] h-[700px] rounded-full opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, #3B82F6, transparent)", transform: "translate(-40%, -40%)" }}
      />
      <div
        className="fixed bottom-0 right-0 w-[600px] h-[600px] rounded-full opacity-8 pointer-events-none"
        style={{ background: "radial-gradient(circle, #7C3AED, transparent)", transform: "translate(35%, 35%)" }}
      />

      <div className="relative z-10 w-full max-w-[1000px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">

          {/* ── LEFT: Branding & info ── */}
          <div className="flex flex-col items-start">
            {/* Logo mark */}
            <div className="flex items-center gap-3 mb-8">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ background: "linear-gradient(135deg, #2563EB, #3B82F6)" }}
              >
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white" style={{ fontSize: "22px", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: "1" }}>
                  PurchaseIQ
                </p>
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)", fontWeight: 500, marginTop: "2px" }}>
                  Purchase Behavior Intelligence
                </p>
              </div>
            </div>

            <h1
              className="mb-4"
              style={{ fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 800, lineHeight: "1.15", letterSpacing: "-0.025em", color: "white" }}
            >
              Predict Who<br />
              <span style={{ color: "#60A5FA" }}>Will Purchase</span>
            </h1>

            <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.55)", lineHeight: "1.7", marginBottom: "32px", maxWidth: "380px" }}>
              A Decision Tree model trained on 12,330 e-commerce sessions to predict purchase intent — supporting data-driven marketing decisions.
            </p>

            {/* Feature pills */}
            <div className="flex flex-col gap-3 w-full" style={{ maxWidth: "340px" }}>
              {features.map((f) => {
                const Icon = f.icon;
                return (
                  <div
                    key={f.label}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }}
                  >
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: f.bg }}>
                      <Icon className="w-3.5 h-3.5" style={{ color: f.color }} />
                    </div>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.75)" }}>{f.label}</span>
                    <CheckCircle2 className="w-4 h-4 ml-auto shrink-0" style={{ color: "#34D399" }} />
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-2 mt-8" style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px" }}>
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Online Shoppers Purchasing Intention Dataset · CART Algorithm</span>
            </div>
          </div>

          {/* ── RIGHT: Role selection / Auth ── */}
          <div>
            {authMode === "none" && (
              <div
                className="rounded-2xl p-6 md:p-8"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(12px)" }}
              >
                <p className="mb-6" style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  Select your view
                </p>

                {/* Business View card — direct access */}
                <button
                  onClick={handleBusinessClick}
                  className="w-full text-left rounded-2xl p-5 mb-3 transition-all duration-200"
                  style={{ background: "rgba(59,130,246,0.10)", border: "1px solid rgba(59,130,246,0.3)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(59,130,246,0.18)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(59,130,246,0.55)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(59,130,246,0.10)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(59,130,246,0.3)"; }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(59,130,246,0.20)" }}>
                      <Briefcase className="w-5 h-5" style={{ color: "#60A5FA" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p style={{ fontSize: "15px", fontWeight: 700, color: "white" }}>Business View</p>
                        <span className="px-2 py-0.5 rounded-full" style={{ fontSize: "10px", fontWeight: 700, background: "#DCFCE7", color: "#15803D" }}>Recommended</span>
                      </div>
                      <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", lineHeight: "1.6", marginBottom: "12px" }}>
                        For marketing and business owners. Focused KPIs, predictions, and insights.
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {["Overview", "Prediction", "Insights"].map((tab) => (
                          <span key={tab} className="px-2 py-0.5 rounded-md" style={{ fontSize: "10px", fontWeight: 600, background: "rgba(59,130,246,0.20)", color: "#93C5FD" }}>
                            {tab}
                          </span>
                        ))}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 shrink-0 mt-1" style={{ color: "rgba(255,255,255,0.3)" }} />
                  </div>
                </button>

                {/* Technical View card — password required */}
                <button
                  onClick={handleTechnicalClick}
                  className="w-full text-left rounded-2xl p-5 transition-all duration-200"
                  style={{ background: "rgba(124,58,237,0.10)", border: "1px solid rgba(124,58,237,0.3)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(124,58,237,0.18)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(124,58,237,0.55)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(124,58,237,0.10)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(124,58,237,0.3)"; }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(124,58,237,0.20)" }}>
                      <FlaskConical className="w-5 h-5" style={{ color: "#A78BFA" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p style={{ fontSize: "15px", fontWeight: 700, color: "white" }}>Technical View</p>
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: "rgba(124,58,237,0.25)" }}>
                          <Lock className="w-2.5 h-2.5" style={{ color: "#C4B5FD" }} />
                          <span style={{ fontSize: "10px", fontWeight: 700, color: "#C4B5FD" }}>Password Required</span>
                        </div>
                      </div>
                      <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", lineHeight: "1.6", marginBottom: "12px" }}>
                        Full access including Model Analysis, Confusion Matrix, ROC Curve, and Hyperparameter Tuning.
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {["Model Analysis", "Confusion Matrix", "Tuning Lab"].map((tab) => (
                          <span key={tab} className="px-2 py-0.5 rounded-md" style={{ fontSize: "10px", fontWeight: 600, background: "rgba(124,58,237,0.20)", color: "#C4B5FD" }}>
                            {tab}
                          </span>
                        ))}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 shrink-0 mt-1" style={{ color: "rgba(255,255,255,0.3)" }} />
                  </div>
                </button>
              </div>
            )}

            {/* Technical View password form */}
            {authMode === "technical" && (
              <div
                className="rounded-2xl p-6 md:p-8"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(124,58,237,0.3)", backdropFilter: "blur(12px)" }}
              >
                <button
                  onClick={() => { setAuthMode("none"); setPassword(""); setPasswordError(false); }}
                  className="flex items-center gap-1.5 mb-6 transition-colors"
                  style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.4)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.75)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)"; }}
                >
                  Back to role selection
                </button>

                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: passwordError ? "rgba(239,68,68,0.2)" : "rgba(124,58,237,0.20)" }}
                  >
                    <Lock className="w-5 h-5" style={{ color: passwordError ? "#F87171" : "#A78BFA" }} />
                  </div>
                  <div>
                    <p style={{ fontSize: "16px", fontWeight: 700, color: "white" }}>Technical View Access</p>
                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>Enter your access password to continue</p>
                  </div>
                </div>

                <div className="mb-5">
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setPasswordError(false); }}
                      onKeyDown={handlePasswordKey}
                      placeholder="Enter password"
                      autoFocus
                      className="w-full px-4 py-3 rounded-xl pr-12 focus:outline-none transition-all"
                      style={{
                        background: passwordError ? "rgba(239,68,68,0.10)" : "rgba(255,255,255,0.08)",
                        border: `1px solid ${passwordError ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.15)"}`,
                        color: "white",
                        fontSize: "14px",
                        fontWeight: 500,
                      }}
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md"
                      style={{ color: "rgba(255,255,255,0.4)" }}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwordError && (
                    <p className="mt-2" style={{ fontSize: "12px", fontWeight: 600, color: "#F87171" }}>
                      Incorrect password. Please try again.
                    </p>
                  )}
                </div>

                <button
                  onClick={handleTechnicalSubmit}
                  disabled={!password}
                  className="w-full py-3 rounded-xl transition-all"
                  style={{
                    background: password ? "linear-gradient(135deg, #7C3AED, #6D28D9)" : "rgba(255,255,255,0.08)",
                    color: password ? "white" : "rgba(255,255,255,0.3)",
                    fontSize: "14px",
                    fontWeight: 700,
                    cursor: password ? "pointer" : "not-allowed",
                  }}
                >
                  Unlock Technical View
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}