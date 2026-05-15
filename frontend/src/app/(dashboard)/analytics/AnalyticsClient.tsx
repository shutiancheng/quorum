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
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
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

  const header = (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Analytics</h1>
        <p className="text-sm text-[var(--text-tertiary)] mt-1">
          {activeTab === "Overview"
            ? "Fraud detection performance and trend analysis \u2014 last 7 days"
            : activeTab === "Map"
            ? "Global fraud intelligence \u2014 geographic loss distribution"
            : "Real-time threat monitoring \u2014 highest-impact countries"}
        </p>
      </div>
      <button
        onClick={() => setIsFullscreen((v) => !v)}
        className="p-2 rounded-xl text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
        title={isFullscreen ? "Exit fullscreen (Esc)" : "Fullscreen"}
      >
        {isFullscreen ? (
          <Minimize2 className="w-4 h-4 shrink-0" strokeWidth={1.5} />
        ) : (
          <Maximize2 className="w-4 h-4 shrink-0" strokeWidth={1.5} />
        )}
      </button>
    </div>
  );

  const chartHeight = isFullscreen ? 360 : 200;

  const content = (
    <div className={`flex-1 ${isFullscreen && activeTab === "Map" ? "flex flex-col min-h-0" : ""}`}>
      {activeTab === "Overview" && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-primary)] shadow-[var(--card-shadow)] p-5">
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
          <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-primary)] shadow-[var(--card-shadow)] p-5">
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

      {activeTab === "Map" && <WorldMapView fullscreen={isFullscreen} countryFraud={countryFraud} />}

      {activeTab === "Threat Activity" && <ThreatActivityView fullscreen={isFullscreen} />}
    </div>
  );

  const tabBar = (
    <div className={`${isFullscreen ? "" : "-mx-6 -mb-6 mt-6"} border-t border-[var(--border-primary)] bg-[var(--bg-tertiary)] overflow-hidden ${isFullscreen ? "" : "rounded-b-2xl"}`}>
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
  );

  if (isFullscreen && activeTab === "Map") {
    return (
      <div className="fixed inset-0 z-50 flex flex-col">
        <div className="relative flex-1 min-h-0">
          <WorldMapView fullscreen countryFraud={countryFraud} />
          <div className="absolute top-3 right-3 z-10">
            <button onClick={() => setIsFullscreen(false)} className="p-2 rounded-xl bg-[var(--bg-elevated)]/80 backdrop-blur-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors" title="Exit fullscreen (Esc)">
              <Minimize2 className="w-4 h-4 shrink-0" strokeWidth={1.5} />
            </button>
          </div>
        </div>
        {tabBar}
      </div>
    );
  }

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-[var(--bg-primary)]">
        <div className="flex-1 p-4 overflow-y-auto flex flex-col">
          <div className="flex justify-end mb-2">
            <button onClick={() => setIsFullscreen(false)} className="p-2 rounded-xl text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors" title="Exit fullscreen (Esc)">
              <Minimize2 className="w-4 h-4 shrink-0" strokeWidth={1.5} />
            </button>
          </div>
          {content}
        </div>
        {tabBar}
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-16px-48px)]">
      {header}
      {content}
      {tabBar}
    </div>
  );
}
