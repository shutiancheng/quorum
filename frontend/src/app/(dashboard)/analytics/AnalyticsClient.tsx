"use client";

import { useState, useEffect, useCallback } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar,
} from "recharts";
import { Maximize2, Minimize2 } from "lucide-react";
import WorldMapView, { type CountryFraud } from "@/components/WorldMapView";
import ThreatActivityView from "@/components/ThreatActivityView";

interface Props {
  countryFraud: Record<string, CountryFraud>;
  alertTrends: { date: string; alerts: number; blocked: number }[];
  fraudByType: { type: string; count: number }[];
}

const tabs = ["Overview", "Map", "Threat Activity"] as const;
type Tab = (typeof tabs)[number];

export default function AnalyticsClient({ countryFraud, alertTrends, fraudByType }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("Map");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const exitFullscreen = useCallback(() => setIsFullscreen(false), []);

  useEffect(() => {
    if (!isFullscreen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") exitFullscreen();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isFullscreen, exitFullscreen]);

  const tabBar = (
    <div className="border-t border-[var(--border-primary)] bg-[var(--bg-tertiary)] overflow-hidden shrink-0">
      <div className="flex items-stretch h-10">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 text-xs font-semibold transition-colors border-r border-[var(--border-primary)] ${
              activeTab === tab
                ? "bg-[var(--bg-primary)] text-[var(--text-primary)]"
                : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--sidebar-item-hover)]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );

  /* ── Map tab: truly full-screen, no chrome ── */
  if (activeTab === "Map") {
    return (
      <div className="fixed inset-0 z-40">
        <WorldMapView fullscreen />
        {/* Floating tab switcher — bottom-left, minimal */}
        <div className="absolute bottom-4 left-4 flex gap-1 z-50">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-[11px] font-semibold rounded-lg transition-colors backdrop-blur-sm ${
                activeTab === tab
                  ? "bg-[#F97316] text-white"
                  : "bg-white/80 text-[var(--text-secondary)] hover:bg-white"
              }`}
              style={{ boxShadow: "var(--card-shadow)" }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    );
  }

  /* ── Overview / Threat Activity — fullscreen overlay ── */
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-40 flex flex-col bg-[var(--bg-primary)]">
        <div className="flex items-center justify-between px-6 py-3 border-b border-[var(--border-primary)] shrink-0">
          <h1 className="text-base font-semibold text-[var(--text-primary)]">{activeTab}</h1>
          <button
            onClick={exitFullscreen}
            className="p-2 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
            title="Exit fullscreen (Esc)"
          >
            <Minimize2 className="w-4 h-4 shrink-0" strokeWidth={1.5} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "Threat Activity" && (
            <ThreatActivityView fullscreen />
          )}
        </div>
        {tabBar}
      </div>
    );
  }

  /* ── Normal card layout ── */
  const chartHeight = 200;

  return (
    <div className="flex flex-col min-h-[calc(100vh-16px-48px)]">
      {/* Header */}
      <div className="flex items-center justify-end mb-4">
        <button
          onClick={() => setIsFullscreen(true)}
          className="p-2 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
          title="Fullscreen"
        >
          <Maximize2 className="w-4 h-4 shrink-0" strokeWidth={1.5} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1">
        {activeTab === "Overview" && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[var(--bg-primary)] rounded-lg shadow-[var(--card-shadow)] p-5">
              <h3 className="font-semibold text-[var(--text-primary)] mb-4">Alert Trend</h3>
              <ResponsiveContainer width="100%" height={chartHeight}>
                <AreaChart data={alertTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
                  <XAxis dataKey="date" tick={{ fontSize: 12, fill: "var(--text-tertiary)" }} />
                  <YAxis tick={{ fontSize: 12, fill: "var(--text-tertiary)" }} />
                  <Tooltip contentStyle={{ backgroundColor: "var(--bg-elevated)", border: "1px solid var(--border-primary)", borderRadius: 12, fontSize: 13 }} />
                  <Area type="monotone" dataKey="alerts" stroke="var(--fraud-critical)" fill="var(--fraud-critical-bg)" />
                  <Area type="monotone" dataKey="blocked" stroke="var(--fraud-cleared)" fill="var(--fraud-cleared-bg)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-[var(--bg-primary)] rounded-lg shadow-[var(--card-shadow)] p-5">
              <h3 className="font-semibold text-[var(--text-primary)] mb-4">Fraud by Type</h3>
              <ResponsiveContainer width="100%" height={chartHeight}>
                <BarChart data={fraudByType}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
                  <XAxis dataKey="type" tick={{ fontSize: 12, fill: "var(--text-tertiary)" }} />
                  <YAxis tick={{ fontSize: 12, fill: "var(--text-tertiary)" }} />
                  <Tooltip contentStyle={{ backgroundColor: "var(--bg-elevated)", border: "1px solid var(--border-primary)", borderRadius: 12, fontSize: 13 }} />
                  <Bar dataKey="count" fill="var(--accent-color)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === "Threat Activity" && (
          <ThreatActivityView fullscreen={false} />
        )}
      </div>

      {/* Tab bar */}
      <div className="-mx-6 -mb-6 mt-6 border-t border-[var(--border-primary)] bg-[var(--bg-tertiary)] overflow-hidden rounded-b-2xl">
        <div className="flex items-stretch h-9">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 text-xs font-medium transition-colors border-r border-[var(--border-primary)] ${
                activeTab === tab
                  ? "bg-[var(--bg-primary)] text-[var(--text-primary)]"
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
