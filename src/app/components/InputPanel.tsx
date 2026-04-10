import { useState } from "react";
import { Sliders, Zap, RotateCcw } from "lucide-react";

export interface FormInputs {
  productRelated: number;
  productRelatedDuration: number;
  bounceRates: number;
  exitRates: number;
  pageValues: number;
  visitorType: string;
  trafficType: string;
  weekend: boolean;
}

interface InputPanelProps {
  onPredict: (inputs: FormInputs) => void;
  isLoading: boolean;
}

const trafficOptions = [
  { value: "1", label: "1 – Direct" },
  { value: "2", label: "2 – Organic Search" },
  { value: "3", label: "3 – Paid Search" },
  { value: "4", label: "4 – Social Media" },
  { value: "5", label: "5 – Referral" },
  { value: "6", label: "6 – Email Campaign" },
  { value: "7", label: "7 – Display Ads" },
  { value: "8", label: "8 – Affiliate" },
];

const defaultValues: FormInputs = {
  productRelated: 12,
  productRelatedDuration: 340,
  bounceRates: 0.015,
  exitRates: 0.032,
  pageValues: 68,
  visitorType: "Returning_Visitor",
  trafficType: "2",
  weekend: false,
};

interface FieldProps {
  label: string;
  hint?: string;
  children: React.ReactNode;
}

function Field({ label, hint, children }: FieldProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-slate-600" style={{ fontSize: "12px", fontWeight: 600 }}>
          {label}
        </label>
        {hint && (
          <span className="text-slate-400" style={{ fontSize: "11px" }}>{hint}</span>
        )}
      </div>
      {children}
    </div>
  );
}

export function InputPanel({ onPredict, isLoading }: InputPanelProps) {
  const [form, setForm] = useState<FormInputs>(defaultValues);

  const set = <K extends keyof FormInputs>(key: K, value: FormInputs[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleReset = () => setForm(defaultValues);

  const inputCls =
    "w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all";

  return (
    <aside className="w-[300px] shrink-0 bg-white border-r border-slate-100 flex flex-col">
      {/* Panel header */}
      <div className="px-5 pt-5 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2 mb-0.5">
          <Sliders className="w-4 h-4 text-blue-500" />
          <span className="text-slate-800" style={{ fontSize: "13px", fontWeight: 700 }}>
            Input Parameters
          </span>
        </div>
        <p className="text-slate-400" style={{ fontSize: "11px" }}>
          Configure visitor session attributes
        </p>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {/* Section: Page Behavior */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px flex-1 bg-slate-100" />
            <span className="text-slate-400 uppercase tracking-wide" style={{ fontSize: "10px", fontWeight: 700 }}>
              Page Behavior
            </span>
            <div className="h-px flex-1 bg-slate-100" />
          </div>
          <div className="space-y-3">
            <Field label="ProductRelated" hint="pages viewed">
              <input
                type="number"
                min={0}
                value={form.productRelated}
                onChange={(e) => set("productRelated", Number(e.target.value))}
                className={inputCls}
                style={{ fontSize: "13px" }}
                placeholder="e.g. 12"
              />
            </Field>
            <Field label="ProductRelated_Duration" hint="seconds">
              <input
                type="number"
                min={0}
                value={form.productRelatedDuration}
                onChange={(e) => set("productRelatedDuration", Number(e.target.value))}
                className={inputCls}
                style={{ fontSize: "13px" }}
                placeholder="e.g. 340"
              />
            </Field>
            <Field label="PageValues" hint="0 – 300+">
              <input
                type="number"
                min={0}
                value={form.pageValues}
                onChange={(e) => set("pageValues", Number(e.target.value))}
                className={inputCls}
                style={{ fontSize: "13px" }}
                placeholder="e.g. 68"
              />
            </Field>
          </div>
        </div>

        {/* Section: Rate Metrics */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px flex-1 bg-slate-100" />
            <span className="text-slate-400 uppercase tracking-wide" style={{ fontSize: "10px", fontWeight: 700 }}>
              Rate Metrics
            </span>
            <div className="h-px flex-1 bg-slate-100" />
          </div>
          <div className="space-y-3">
            <Field label="BounceRates" hint="0.0 – 1.0">
              <input
                type="number"
                min={0}
                max={1}
                step={0.001}
                value={form.bounceRates}
                onChange={(e) => set("bounceRates", Number(e.target.value))}
                className={inputCls}
                style={{ fontSize: "13px" }}
                placeholder="e.g. 0.015"
              />
              <div className="mt-1.5 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(form.bounceRates * 100, 100)}%`,
                    background: form.bounceRates > 0.05 ? "#ef4444" : "#22c55e",
                  }}
                />
              </div>
            </Field>
            <Field label="ExitRates" hint="0.0 – 1.0">
              <input
                type="number"
                min={0}
                max={1}
                step={0.001}
                value={form.exitRates}
                onChange={(e) => set("exitRates", Number(e.target.value))}
                className={inputCls}
                style={{ fontSize: "13px" }}
                placeholder="e.g. 0.032"
              />
              <div className="mt-1.5 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(form.exitRates * 100, 100)}%`,
                    background: form.exitRates > 0.08 ? "#ef4444" : "#f59e0b",
                  }}
                />
              </div>
            </Field>
          </div>
        </div>

        {/* Section: Visitor Info */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px flex-1 bg-slate-100" />
            <span className="text-slate-400 uppercase tracking-wide" style={{ fontSize: "10px", fontWeight: 700 }}>
              Visitor Info
            </span>
            <div className="h-px flex-1 bg-slate-100" />
          </div>
          <div className="space-y-3">
            <Field label="Visitor Type">
              <select
                value={form.visitorType}
                onChange={(e) => set("visitorType", e.target.value)}
                className={inputCls + " cursor-pointer"}
                style={{ fontSize: "13px" }}
              >
                <option value="New_Visitor">New Visitor</option>
                <option value="Returning_Visitor">Returning Visitor</option>
              </select>
            </Field>
            <Field label="Traffic Type">
              <select
                value={form.trafficType}
                onChange={(e) => set("trafficType", e.target.value)}
                className={inputCls + " cursor-pointer"}
                style={{ fontSize: "13px" }}
              >
                {trafficOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </Field>

            {/* Weekend toggle */}
            <Field label="Weekend Session">
              <div className="flex items-center justify-between px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-600" style={{ fontSize: "12px" }}>
                  {form.weekend ? "Yes – Weekend" : "No – Weekday"}
                </span>
                <button
                  type="button"
                  onClick={() => set("weekend", !form.weekend)}
                  className="relative shrink-0 w-10 h-5.5 rounded-full transition-colors duration-200"
                  style={{
                    backgroundColor: form.weekend ? "#3b82f6" : "#cbd5e1",
                    height: "22px",
                    width: "40px",
                  }}
                >
                  <span
                    className="absolute top-0.5 left-0.5 w-[18px] h-[18px] bg-white rounded-full shadow transition-transform duration-200"
                    style={{ transform: form.weekend ? "translateX(18px)" : "translateX(0)" }}
                  />
                </button>
              </div>
            </Field>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-5 py-4 border-t border-slate-100 space-y-2">
        <button
          onClick={() => onPredict(form)}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white transition-all shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ fontSize: "13px", fontWeight: 700 }}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Analyzing…
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              Predict Purchase
            </>
          )}
        </button>
        <button
          onClick={handleReset}
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors"
          style={{ fontSize: "12px", fontWeight: 600 }}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset to defaults
        </button>
      </div>
    </aside>
  );
}
