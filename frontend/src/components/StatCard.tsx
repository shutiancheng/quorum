import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  change: string;
}

export default function StatCard({
  icon: Icon,
  label,
  value,
  change,
}: StatCardProps) {
  const isPositive = change.startsWith("+");

  return (
    <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-primary)] shadow-[var(--card-shadow)] p-5 animate-card-in">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center">
          <Icon
            className="w-5 h-5 text-[var(--text-secondary)] shrink-0"
            strokeWidth={1.5}
          />
        </div>
        <span className="text-xs text-[var(--text-tertiary)]">{label}</span>
      </div>
      <div className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">
        {value}
      </div>
      <div
        className={`text-xs mt-1 ${
          isPositive
            ? "text-[var(--fraud-cleared)]"
            : "text-[var(--fraud-critical)]"
        }`}
      >
        {change} vs yesterday
      </div>
    </div>
  );
}
