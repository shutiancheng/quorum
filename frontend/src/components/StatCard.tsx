import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  change: string;
  highlight?: boolean;
}

export default function StatCard({
  icon: Icon,
  label,
  value,
  change,
  highlight = false,
}: StatCardProps) {
  const isPositive = change.startsWith("+");

  return (
    <div className="bg-[var(--bg-primary)] rounded-xl p-5 animate-card-in flex flex-col gap-3"
         style={{ boxShadow: "var(--card-shadow)" }}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wide">
          {label}
        </span>
        <Icon className="w-3.5 h-3.5 text-[var(--text-tertiary)] shrink-0" strokeWidth={1.5} />
      </div>

      <div
        className="text-[28px] font-bold tracking-tight leading-none"
        style={{ color: highlight ? "var(--brand-accent)" : "var(--text-primary)" }}
      >
        {value}
      </div>

      <div className="flex items-center gap-1.5">
        <span
          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold"
          style={{
            backgroundColor: isPositive ? "#14532D" : "#991B1B",
            color: "#FFFFFF",
          }}
        >
          {change}
        </span>
        <span className="text-xs text-[var(--text-tertiary)]">vs yesterday</span>
      </div>
    </div>
  );
}
