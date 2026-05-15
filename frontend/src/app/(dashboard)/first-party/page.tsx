"use client";

import { useState } from "react";
import DataTable from "@/components/DataTable";
import { mockCases } from "@/lib/mock-data";

const filters = ["All", "Critical", "High", "Medium"];

export default function FirstPartyPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  const cases = mockCases
    .filter((c) => c.type === "First-Party")
    .filter((c) => {
      if (activeFilter === "All") return true;
      if (activeFilter === "Critical") return c.riskScore >= 80;
      if (activeFilter === "High") return c.riskScore >= 60 && c.riskScore < 80;
      return c.riskScore >= 40 && c.riskScore < 60;
    });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
          First-Party Fraud
        </h1>
        <p className="text-sm text-[var(--text-tertiary)] mt-1">
          Account holders making legitimate purchases then falsely claiming fraud
          for refunds
        </p>
      </div>

      <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-primary)] shadow-[var(--card-shadow)]">
        <div className="px-5 py-4 border-b border-[var(--border-primary)] flex items-center justify-between">
          <h3 className="font-semibold text-[var(--text-primary)]">
            Active Cases
          </h3>
          <div className="flex items-center gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
                  activeFilter === f
                    ? "bg-[var(--pill-active-bg)] text-[var(--pill-active-text)]"
                    : "text-[var(--text-tertiary)] hover:bg-[var(--bg-tertiary)]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <DataTable cases={cases} />
      </div>
    </div>
  );
}
