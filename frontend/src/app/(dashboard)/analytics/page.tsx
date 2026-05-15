"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import WorldMapView from "@/components/WorldMapView";

const alertData = [
  { date: "Mon", alerts: 320, blocked: 280 },
  { date: "Tue", alerts: 410, blocked: 350 },
  { date: "Wed", alerts: 380, blocked: 340 },
  { date: "Thu", alerts: 520, blocked: 460 },
  { date: "Fri", alerts: 490, blocked: 430 },
  { date: "Sat", alerts: 280, blocked: 250 },
  { date: "Sun", alerts: 240, blocked: 210 },
];

const fraudByType = [
  { type: "APP", count: 1247 },
  { type: "Unauth", count: 892 },
  { type: "1st Party", count: 634 },
  { type: "Collusion", count: 421 },
];

const tabs = ["Overview", "Map"] as const;
type Tab = (typeof tabs)[number];

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Overview");

  return (
    <div className="flex flex-col min-h-[calc(100vh-16px-48px)]">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
          Analytics
        </h1>
        <p className="text-sm text-[var(--text-tertiary)] mt-1">
          {activeTab === "Overview"
            ? "Fraud detection performance and trend analysis — last 7 days"
            : "Global fraud intelligence — geographic distribution"}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1">
        {activeTab === "Overview" && (
          <div className="grid grid-cols-2 gap-4">
            {/* Alert Trend */}
            <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-primary)] shadow-[var(--card-shadow)] p-5">
              <h3 className="font-semibold text-[var(--text-primary)] mb-4">
                Alert Trend
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={alertData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border-primary)"
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12, fill: "var(--text-tertiary)" }}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "var(--text-tertiary)" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--bg-elevated)",
                      border: "1px solid var(--border-primary)",
                      borderRadius: 12,
                      fontSize: 13,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="alerts"
                    stroke="var(--fraud-critical)"
                    fill="var(--fraud-critical-bg)"
                  />
                  <Area
                    type="monotone"
                    dataKey="blocked"
                    stroke="var(--fraud-cleared)"
                    fill="var(--fraud-cleared-bg)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Fraud by Type */}
            <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-primary)] shadow-[var(--card-shadow)] p-5">
              <h3 className="font-semibold text-[var(--text-primary)] mb-4">
                Fraud by Type
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={fraudByType}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border-primary)"
                  />
                  <XAxis
                    dataKey="type"
                    tick={{ fontSize: 12, fill: "var(--text-tertiary)" }}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "var(--text-tertiary)" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--bg-elevated)",
                      border: "1px solid var(--border-primary)",
                      borderRadius: 12,
                      fontSize: 13,
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill="var(--accent-color)"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === "Map" && <WorldMapView />}
      </div>

      {/* ── Excel-style bottom tab bar ── */}
      <div className="-mx-6 -mb-6 mt-6 border-t border-[var(--border-primary)] bg-[var(--bg-tertiary)] rounded-b-2xl">
        <div className="flex items-end h-9 px-1 gap-px">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-4 h-[calc(100%-1px)] text-xs font-medium transition-colors rounded-b-md ${
                activeTab === tab
                  ? "bg-[var(--bg-primary)] text-[var(--text-primary)] border-x border-b border-[var(--border-primary)] -top-px"
                  : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--sidebar-item-hover)]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
