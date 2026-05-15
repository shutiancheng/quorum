import type { FraudCase } from "@/lib/types";
import StatusBadge from "./StatusBadge";
import { getRiskColor, formatCurrency } from "@/lib/utils";

interface DataTableProps {
  cases: FraudCase[];
}

export default function DataTable({ cases }: DataTableProps) {
  if (cases.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-12 h-12 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center mb-4">
          <svg
            className="w-6 h-6 text-[var(--text-tertiary)] shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </div>
        <h3 className="font-semibold text-[var(--text-primary)] mb-1">
          No cases found
        </h3>
        <p className="text-sm text-[var(--text-tertiary)] max-w-xs">
          No fraud cases match your current filters. Try adjusting your search
          criteria.
        </p>
      </div>
    );
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-[var(--border-primary)]">
          <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">
            Transaction ID
          </th>
          <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">
            Type
          </th>
          <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">
            Region
          </th>
          <th className="text-right py-3 px-4 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">
            Amount
          </th>
          <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">
            Risk Score
          </th>
          <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">
            Status
          </th>
        </tr>
      </thead>
      <tbody>
        {cases.map((c) => (
          <tr
            key={c.id}
            className="border-b border-[var(--border-primary)] hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer"
          >
            <td className="py-3 px-4 font-mono text-xs text-[var(--text-primary)]">
              {c.id}
            </td>
            <td className="py-3 px-4 text-[var(--text-secondary)]">
              {c.type}
            </td>
            <td className="py-3 px-4 text-[var(--text-secondary)]">
              {c.region}
            </td>
            <td className="py-3 px-4 text-right font-mono text-[var(--text-primary)]">
              {formatCurrency(c.amount)}
            </td>
            <td className="py-3 px-4">
              <div className="flex items-center gap-2">
                <div className="w-16 h-1.5 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${c.riskScore}%`,
                      backgroundColor: getRiskColor(c.riskScore),
                    }}
                  />
                </div>
                <span
                  className="text-xs font-medium"
                  style={{ color: getRiskColor(c.riskScore) }}
                >
                  {c.riskScore}
                </span>
              </div>
            </td>
            <td className="py-3 px-4">
              <StatusBadge status={c.status} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
