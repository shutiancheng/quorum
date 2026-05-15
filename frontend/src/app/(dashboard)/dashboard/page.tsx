"use client";

import { useState } from "react";
import {
  ShieldAlert,
  CreditCard,
  Users,
  CheckCircle,
} from "lucide-react";
import StatCard from "@/components/StatCard";
import TabNav from "@/components/TabNav";
import DataTable from "@/components/DataTable";
import { mockCases } from "@/lib/mock-data";

const tabs = [
  "All Cases",
  "APP Fraud",
  "Unauthorised",
  "First-Party",
  "Collusion",
];

const tabTypeMap: Record<string, string | null> = {
  "All Cases": null,
  "APP Fraud": "APP Fraud",
  Unauthorised: "Unauthorised",
  "First-Party": "First-Party",
  Collusion: "Collusion",
};

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("All Cases");
  const [search, setSearch] = useState("");

  const filteredCases = mockCases.filter((c) => {
    const matchesTab =
      !tabTypeMap[activeTab] || c.type === tabTypeMap[activeTab];
    const matchesSearch =
      !search ||
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.type.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
            Fraud Overview
          </h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">
            PayPal transaction monitoring — last 24 hours
          </p>
        </div>
        <button className="px-4 py-2.5 text-sm font-medium rounded-xl bg-[var(--brand-primary)] text-[var(--brand-primary-fg)] hover:bg-[var(--brand-primary-hover)] transition-colors">
          Generate Report
        </button>
      </div>

      {/* Stat Cards Row */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          icon={ShieldAlert}
          label="Total Alerts"
          value="3,847"
          change="+8.2%"
        />
        <StatCard
          icon={CreditCard}
          label="Blocked Value"
          value="$1.2M"
          change="+23.1%"
        />
        <StatCard
          icon={Users}
          label="Accounts Flagged"
          value="421"
          change="-3.4%"
        />
        <StatCard
          icon={CheckCircle}
          label="Cases Resolved"
          value="1,893"
          change="+15.7%"
        />
      </div>

      {/* Fraud type tabs + table */}
      <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-primary)] shadow-[var(--card-shadow)]">
        <div className="px-5 py-4 border-b border-[var(--border-primary)] flex items-center justify-between">
          <TabNav
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
          <input
            placeholder="Search cases..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-1.5 text-sm rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] w-56 transition-colors"
          />
        </div>
        <div className="p-0">
          <DataTable cases={filteredCases} />
        </div>
      </div>
    </div>
  );
}
