import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { BarChart2, Lightbulb, Target, TrendingDown, TrendingUp, Users, ShoppingCart, Percent } from "lucide-react";

const featureImportanceData = [
  { name: "PageValues", importance: 38.4, fill: "#3b82f6" },
  { name: "BounceRates", importance: 27.1, fill: "#6366f1" },
  { name: "ExitRates", importance: 19.8, fill: "#8b5cf6" },
  { name: "ProductRelated", importance: 14.7, fill: "#a78bfa" },
];

const sessionDistributionData = [
  { type: "Direct", purchase: 42, noPurchase: 58 },
  { type: "Organic", purchase: 31, noPurchase: 69 },
  { type: "Paid", purchase: 54, noPurchase: 46 },
  { type: "Social", purchase: 23, noPurchase: 77 },
  { type: "Referral", purchase: 47, noPurchase: 53 },
];

interface InsightCardProps {
  icon: React.ReactNode;
  text: string;
  type: "warning" | "success";
}

function InsightCard({ icon, text, type }: InsightCardProps) {
  const colors = {
    warning: { bg: "bg-amber-50", border: "border-amber-100", icon: "text-amber-500", text: "text-amber-700" },
    success: { bg: "bg-emerald-50", border: "border-emerald-100", icon: "text-emerald-500", text: "text-emerald-700" },
  };
  const c = colors[type];
  return (
    <div className={`flex items-start gap-3 p-3 rounded-xl border ${c.bg} ${c.border}`}>
      <div className={`${c.icon} mt-0.5 shrink-0`}>{icon}</div>
      <p className={`${c.text}`} style={{ fontSize: "12px", lineHeight: "1.5" }}>{text}</p>
    </div>
  );
}

interface RecommendationCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  priority: "High" | "Medium" | "Low";
}

function RecommendationCard({ icon, title, description, priority }: RecommendationCardProps) {
  const priorityColors = {
    High: { bg: "#fee2e2", text: "#991b1b" },
    Medium: { bg: "#fef9c3", text: "#854d0e" },
    Low: { bg: "#dcfce7", text: "#166534" },
  };
  const p = priorityColors[priority];
  return (
    <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-100 hover:border-blue-200 hover:shadow-sm transition-all">
      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 text-blue-500">
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-0.5">
          <p className="text-slate-800" style={{ fontSize: "12px", fontWeight: 700 }}>{title}</p>
          <span
            className="px-2 py-0.5 rounded-full"
            style={{ fontSize: "10px", fontWeight: 700, background: p.bg, color: p.text }}
          >
            {priority}
          </span>
        </div>
        <p className="text-slate-500" style={{ fontSize: "11px", lineHeight: "1.5" }}>{description}</p>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 px-3 py-2 rounded-lg shadow-lg">
        <p className="text-slate-300 mb-1" style={{ fontSize: "11px", fontWeight: 600 }}>{label}</p>
        <p className="text-white" style={{ fontSize: "13px", fontWeight: 700 }}>
          {payload[0].value.toFixed(1)}% importance
        </p>
      </div>
    );
  }
  return null;
};

const SessionTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 px-3 py-2 rounded-lg shadow-lg">
        <p className="text-slate-300 mb-1" style={{ fontSize: "11px", fontWeight: 600 }}>{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ fontSize: "12px", fontWeight: 600, color: p.fill }}>
            {p.name}: {p.value}%
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function InsightsDashboard() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <BarChart2 className="w-4 h-4 text-blue-500" />
        <span className="text-slate-800" style={{ fontSize: "13px", fontWeight: 700 }}>Insights Dashboard</span>
        <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 rounded-full border border-blue-100">
          <span className="text-blue-600" style={{ fontSize: "11px", fontWeight: 600 }}>Model v2.4.1</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Feature Importance Chart */}
        <div className="col-span-1 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="mb-4">
            <p className="text-slate-800" style={{ fontSize: "12px", fontWeight: 700 }}>Feature Importance</p>
            <p className="text-slate-400" style={{ fontSize: "11px" }}>Decision tree node splits</p>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={featureImportanceData} layout="vertical" margin={{ left: -10, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis
                type="number"
                domain={[0, 45]}
                tick={{ fontSize: 10, fill: "#94a3b8" }}
                tickLine={false}
                axisLine={false}
                unit="%"
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 11, fill: "#64748b", fontWeight: 600 }}
                tickLine={false}
                axisLine={false}
                width={90}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc" }} />
              <Bar dataKey="importance" radius={[0, 6, 6, 0]} maxBarSize={18}>
                {featureImportanceData.map((entry) => (
                  <Cell key={`cell-feature-${entry.name}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="mt-3 space-y-1.5">
            {featureImportanceData.map((f) => (
              <div key={f.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ background: f.fill }} />
                  <span className="text-slate-600" style={{ fontSize: "11px" }}>{f.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${(f.importance / 40) * 100}%`, background: f.fill }}
                    />
                  </div>
                  <span className="text-slate-700" style={{ fontSize: "11px", fontWeight: 700, minWidth: "36px", textAlign: "right" }}>
                    {f.importance}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Insights */}
        <div className="col-span-1 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <p className="text-slate-800" style={{ fontSize: "12px", fontWeight: 700 }}>Key Insights</p>
            </div>
            <p className="text-slate-400 mt-0.5" style={{ fontSize: "11px" }}>Patterns from training data</p>
          </div>
          <div className="space-y-2.5">
            <InsightCard
              icon={<TrendingDown className="w-4 h-4" />}
              text="High bounce rate (>5%) reduces purchase probability by up to 68%"
              type="warning"
            />
            <InsightCard
              icon={<TrendingUp className="w-4 h-4" />}
              text="Higher page value (>50) significantly increases conversion likelihood"
              type="success"
            />
            <InsightCard
              icon={<TrendingDown className="w-4 h-4" />}
              text="Exit rates above 8% are strongly correlated with non-purchase sessions"
              type="warning"
            />
            <InsightCard
              icon={<TrendingUp className="w-4 h-4" />}
              text="Returning visitors are 2.3× more likely to complete a purchase"
              type="success"
            />
          </div>

          {/* Model stats */}
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
            {[
              { label: "Accuracy", value: "87.4%" },
              { label: "Precision", value: "83.2%" },
              { label: "Recall", value: "79.6%" },
              { label: "F1 Score", value: "81.3%" },
            ].map((stat) => (
              <div key={stat.label} className="bg-slate-50 rounded-lg p-2 text-center">
                <p className="text-slate-400" style={{ fontSize: "10px", fontWeight: 600 }}>{stat.label}</p>
                <p className="text-slate-700" style={{ fontSize: "14px", fontWeight: 800 }}>{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Business Recommendations */}
        <div className="col-span-1 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <Target className="w-3.5 h-3.5 text-blue-500" />
              <p className="text-slate-800" style={{ fontSize: "12px", fontWeight: 700 }}>Business Recommendations</p>
            </div>
            <p className="text-slate-400 mt-0.5" style={{ fontSize: "11px" }}>Actionable strategies from insights</p>
          </div>
          <div className="space-y-2.5">
            <RecommendationCard
              icon={<Users className="w-4 h-4" />}
              title="Target High-Value Users"
              description="Focus ad spend on users with PageValues > 50 — they convert 3.1× better than average."
              priority="High"
            />
            <RecommendationCard
              icon={<TrendingDown className="w-4 h-4" />}
              title="Reduce Bounce Rate"
              description="Improve landing page relevance and load speed to keep BounceRates below 2%."
              priority="High"
            />
            <RecommendationCard
              icon={<ShoppingCart className="w-4 h-4" />}
              title="Re-engage Returning Visitors"
              description="Deploy targeted offers and retargeting campaigns for returning visitor segments."
              priority="Medium"
            />
            <RecommendationCard
              icon={<Percent className="w-4 h-4" />}
              title="Optimize Exit Pages"
              description="Audit top exit pages and introduce exit-intent overlays to recover lost conversions."
              priority="Medium"
            />
          </div>
        </div>
      </div>

      {/* Session distribution bar chart */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-slate-800" style={{ fontSize: "12px", fontWeight: 700 }}>Purchase Rate by Traffic Source</p>
            <p className="text-slate-400" style={{ fontSize: "11px" }}>Historical conversion data across channels</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-blue-500" />
              <span className="text-slate-500" style={{ fontSize: "11px" }}>Purchase</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-slate-200" />
              <span className="text-slate-500" style={{ fontSize: "11px" }}>No Purchase</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={130}>
          <BarChart data={sessionDistributionData} margin={{ left: -20, right: 0, top: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="type"
              tick={{ fontSize: 11, fill: "#64748b", fontWeight: 600 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              tickLine={false}
              axisLine={false}
              unit="%"
            />
            <Tooltip content={<SessionTooltip />} cursor={{ fill: "#f8fafc" }} />
            <Bar dataKey="purchase" name="Purchase" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
            <Bar dataKey="noPurchase" name="No Purchase" stackId="a" fill="#e2e8f0" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}