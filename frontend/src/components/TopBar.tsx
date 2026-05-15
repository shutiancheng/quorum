"use client";

import { usePathname } from "next/navigation";
import { Bell, Calendar } from "lucide-react";

const PAGE_LABELS: Record<string, string> = {
  "/dashboard": "Overview",
  "/app-fraud": "APP Fraud",
  "/unauthorised": "Unauthorised Fraud",
  "/first-party": "First-Party Fraud",
  "/collusion": "Collusion Detection",
  "/live-demo": "Live Demo",
  "/signal-exchange": "Signal Exchange",
  "/query-privacy": "Query & Privacy",
  "/governance": "Governance",
  "/attack-simulation": "Attack Simulation",
  "/investigations": "Case Investigation",
  "/analytics": "Analytics",
  "/settings": "Settings",
};

function getDate() {
  return new Date().toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export default function TopBar() {
  const pathname = usePathname();
  const pageLabel = PAGE_LABELS[pathname] ?? "Dashboard";

  return (
    <header className="h-14 shrink-0 flex items-center justify-between px-6 border-b border-[var(--sidebar-border)] bg-[var(--sidebar-bg)]">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-[var(--text-tertiary)]">Dashboard</span>
        <span className="text-xs text-[var(--text-tertiary)]">/</span>
        <span className="text-xs font-medium text-[var(--text-primary)]">{pageLabel}</span>
      </div>

      {/* Right: date + bell + user */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)]">
          <Calendar className="w-3.5 h-3.5 text-[var(--text-tertiary)] shrink-0" strokeWidth={1.5} />
          <span className="text-xs text-[var(--text-secondary)]">{getDate()}</span>
        </div>

        <button className="relative p-2 rounded-lg text-[var(--text-tertiary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-colors">
          <Bell className="w-4 h-4 shrink-0" strokeWidth={1.5} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[var(--brand-primary)]" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[var(--brand-primary)] flex items-center justify-center">
            <span className="text-[10px] font-bold text-black">Q</span>
          </div>
          <span className="text-xs font-medium text-[var(--text-primary)] hidden sm:block">Quorum</span>
        </div>
      </div>
    </header>
  );
}
