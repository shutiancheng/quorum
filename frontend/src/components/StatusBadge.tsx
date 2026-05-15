import type { FraudStatus } from "@/lib/types";

const statusConfig: Record<
  FraudStatus,
  { label: string; bg: string; text: string }
> = {
  critical: {
    label: "Critical",
    bg: "var(--fraud-critical-bg)",
    text: "var(--fraud-critical)",
  },
  warning: {
    label: "Under Review",
    bg: "var(--fraud-warning-bg)",
    text: "var(--fraud-warning)",
  },
  cleared: {
    label: "Cleared",
    bg: "var(--fraud-cleared-bg)",
    text: "var(--fraud-cleared)",
  },
  review: {
    label: "Investigating",
    bg: "var(--fraud-review-bg)",
    text: "var(--fraud-review)",
  },
};

export default function StatusBadge({ status }: { status: FraudStatus }) {
  const config = statusConfig[status];
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full"
      style={{ backgroundColor: config.bg, color: config.text }}
    >
      {config.label}
    </span>
  );
}
