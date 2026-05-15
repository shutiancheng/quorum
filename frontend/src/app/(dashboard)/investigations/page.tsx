import { FileSearch } from "lucide-react";

export default function InvestigationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
          Case Investigation
        </h1>
        <p className="text-sm text-[var(--text-tertiary)] mt-1">
          Deep-dive into individual fraud cases with full transaction history
        </p>
      </div>

      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-12 h-12 rounded-2xl bg-[var(--bg-tertiary)] flex items-center justify-center mb-4">
          <FileSearch
            className="w-6 h-6 text-[var(--text-tertiary)] shrink-0"
            strokeWidth={1.5}
          />
        </div>
        <h3 className="font-semibold text-[var(--text-primary)] mb-1">
          No active investigations
        </h3>
        <p className="text-sm text-[var(--text-tertiary)] max-w-xs">
          Select a case from the fraud overview or category pages to begin an
          investigation.
        </p>
      </div>
    </div>
  );
}
