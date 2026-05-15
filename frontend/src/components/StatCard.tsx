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
    <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-primary)] p-6 animate-card-in flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">
          {label}
        </span>
        <Icon className="w-3.5 h-3.5 text-[var(--text-tertiary)] shrink-0" strokeWidth={1.5} />
      </div>

      <div
        className="text-3xl font-bold tracking-tight"
        style={{ color: highlight ? "var(--brand-primary)" : "var(--text-primary)" }}
      >
        {value}
      </div>

      <div className="flex items-center gap-1.5">
        <span
          className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium"
          style={{
            backgroundColor: isPositive ? "var(--fraud-cleared-bg)" : "var(--fraud-critical-bg)",
            color: isPositive ? "var(--fraud-cleared)" : "var(--fraud-critical)",
          }}
        >
          {change}
        </span>
        <span className="text-xs text-[var(--text-tertiary)]">vs yesterday</span>
      </div>
    </div>
  );
}
