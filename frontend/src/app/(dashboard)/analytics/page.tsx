"use client";

import { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell,
} from "recharts";
import { TrendingUp, TrendingDown, ShieldCheck, Zap } from "lucide-react";
import WorldMapView from "@/components/WorldMapView";
import ThreatActivityView from "@/components/ThreatActivityView";

// ── Palette ───────────────────────────────────────────────────────────────────
const C_NOW  = "#F97316";   // orange — current period
const C_PREV = "#0369A1";   // blue   — prior period
const C_NOW_FILL  = "rgba(249,115,22,0.15)";
const C_PREV_FILL = "rgba(3,105,161,0.10)";

const TOOLTIP_STYLE = {
  backgroundColor: "#fff",
  border: "1px solid rgba(0,0,0,0.10)",
  borderRadius: 10,
  fontSize: 12,
  boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
};
const TICK = { fontSize: 11, fill: "#777" };

// ── Mock Data ─────────────────────────────────────────────────────────────────

// 12-month fraud losses $M — 2025-26 vs 2024-25
const monthlyLoss = [
  { m: "Jan", now: 112, prev: 98  },
  { m: "Feb", now: 105, prev: 94  },
  { m: "Mar", now: 131, prev: 108 },
  { m: "Apr", now: 122, prev: 102 },
  { m: "May", now: 148, prev: 115 },
  { m: "Jun", now: 142, prev: 119 },
  { m: "Jul", now: 158, prev: 128 },
  { m: "Aug", now: 167, prev: 134 },
  { m: "Sep", now: 174, prev: 141 },
  { m: "Oct", now: 183, prev: 149 },
  { m: "Nov", now: 196, prev: 158 },
  { m: "Dec", now: 158, prev: 131 },
];

// Fraud type volume — grouped bar
const fraudTypeComparison = [
  { type: "APP",       now: 1247, prev: 986  },
  { type: "Unauth",    now: 892,  prev: 812  },
  { type: "1st Party", now: 634,  prev: 598  },
  { type: "Collusion", now: 421,  prev: 334  },
  { type: "ATO",       now: 389,  prev: 312  },
  { type: "BNPL",      now: 264,  prev: 198  },
];

// Block rate trend %
const blockRateTrend = [
  { m: "Jan", rate: 78.1 }, { m: "Feb", rate: 79.4 }, { m: "Mar", rate: 80.2 },
  { m: "Apr", rate: 79.8 }, { m: "May", rate: 81.3 }, { m: "Jun", rate: 81.9 },
  { m: "Jul", rate: 82.1 }, { m: "Aug", rate: 82.8 }, { m: "Sep", rate: 83.1 },
  { m: "Oct", rate: 83.7 }, { m: "Nov", rate: 83.4 }, { m: "Dec", rate: 82.3 },
];

// Spider/radar — detection quality score 0-100
const radarData = [
  { axis: "APP",        now: 87, prev: 72 },
  { axis: "Unauth",     now: 94, prev: 89 },
  { axis: "1st Party",  now: 79, prev: 65 },
  { axis: "Collusion",  now: 71, prev: 58 },
  { axis: "ATO",        now: 88, prev: 76 },
  { axis: "BNPL",       now: 82, prev: 68 },
];

// Weekly alerts — full-width bottom chart
const weeklyAlerts = [
  { w: "W1",  alerts: 420, blocked: 340 }, { w: "W2",  alerts: 510, blocked: 420 },
  { w: "W3",  alerts: 380, blocked: 310 }, { w: "W4",  alerts: 590, blocked: 488 },
  { w: "W5",  alerts: 470, blocked: 392 }, { w: "W6",  alerts: 530, blocked: 440 },
  { w: "W7",  alerts: 610, blocked: 505 }, { w: "W8",  alerts: 480, blocked: 400 },
  { w: "W9",  alerts: 555, blocked: 462 }, { w: "W10", alerts: 640, blocked: 534 },
  { w: "W11", alerts: 490, blocked: 412 }, { w: "W12", alerts: 578, blocked: 485 },
];

// ── KPI Card ──────────────────────────────────────────────────────────────────
function KpiCard({
  label, value, change, positive, sub, icon: Icon,
}: {
  label: string; value: string; change: string; positive: boolean; sub: string;
  icon: React.ElementType;
}) {
  return (
    <div className="bg-[var(--bg-primary)] rounded-xl p-4 flex flex-col gap-3" style={{ boxShadow: "var(--card-shadow)" }}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-tertiary)]">{label}</span>
        <Icon className="w-3.5 h-3.5 text-[var(--text-tertiary)]" strokeWidth={1.5} />
      </div>
      <div className="text-2xl font-black tracking-tight text-[var(--text-primary)]">{value}</div>
      <div className="flex items-center gap-2">
        <span
          className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-xs font-bold text-white"
          style={{ backgroundColor: positive ? "#14532D" : "#991B1B" }}
        >
          {positive ? <TrendingUp className="w-3 h-3" strokeWidth={2} /> : <TrendingDown className="w-3 h-3" strokeWidth={2} />}
          {change}
        </span>
        <span className="text-xs text-[var(--text-tertiary)]">{sub}</span>
      </div>
    </div>
  );
}

// ── Section header ────────────────────────────────────────────────────────────
function SectionHeader({ title, sub, legend }: { title: string; sub?: string; legend?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">{title}</h3>
        {sub && <p className="text-[11px] text-[var(--text-tertiary)] mt-0.5">{sub}</p>}
      </div>
      {legend}
    </div>
  );
}

function PeriodLegend() {
  return (
    <div className="flex items-center gap-3 shrink-0">
      <span className="flex items-center gap-1.5 text-[11px] text-[var(--text-secondary)]">
        <span className="w-4 h-0.5 rounded" style={{ backgroundColor: C_NOW }} />2025-26
      </span>
      <span className="flex items-center gap-1.5 text-[11px] text-[var(--text-secondary)]">
        <span className="w-4 h-0.5 rounded" style={{ backgroundColor: C_PREV }} />2024-25
      </span>
    </div>
  );
}

// ── Card wrapper ──────────────────────────────────────────────────────────────
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-[var(--bg-primary)] rounded-xl p-5 ${className}`} style={{ boxShadow: "var(--card-shadow)" }}>
      {children}
    </div>
  );
}

// ── Overview tab ──────────────────────────────────────────────────────────────
function OverviewTab() {
  const nowTotal  = monthlyLoss.reduce((s, d) => s + d.now, 0);
  const prevTotal = monthlyLoss.reduce((s, d) => s + d.prev, 0);
  const yoy = (((nowTotal - prevTotal) / prevTotal) * 100).toFixed(1);

  return (
    <div className="space-y-5">
      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        <KpiCard label="Total Losses (2025-26)" value={`$${(nowTotal / 1000).toFixed(2)}B`}
                 change={`+${yoy}%`} positive={false} sub="vs prior year" icon={TrendingUp} />
        <KpiCard label="Fraud Blocked Today" value="$1.2M"
                 change="+23.1%" positive={true} sub="vs yesterday" icon={ShieldCheck} />
        <KpiCard label="Avg Block Rate" value="82.3%"
                 change="+4.2pp" positive={true} sub="vs 78.1% Jan" icon={ShieldCheck} />
        <KpiCard label="Avg Detection Time" value="1.2s"
                 change="-0.4s" positive={true} sub="vs 1.6s prior yr" icon={Zap} />
      </div>

      {/* Row 1: Monthly loss area + Radar spider */}
      <div className="grid grid-cols-[3fr_2fr] gap-5">
        <Card>
          <SectionHeader title="Monthly Fraud Losses" sub="$M — 12-month rolling comparison"
                         legend={<PeriodLegend />} />
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyLoss} margin={{ top: 4, right: 4, left: -8, bottom: 0 }}>
              <defs>
                <linearGradient id="gNow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={C_NOW}  stopOpacity={0.25} />
                  <stop offset="95%" stopColor={C_NOW}  stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="gPrev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={C_PREV} stopOpacity={0.18} />
                  <stop offset="95%" stopColor={C_PREV} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
              <XAxis dataKey="m" tick={TICK} tickLine={false} axisLine={false} />
              <YAxis tick={TICK} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}M`} />
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: any, n: any) => [`$${v}M`, n === "now" ? "2025-26" : "2024-25"]} />
              <Area type="monotone" dataKey="prev" stroke={C_PREV} strokeWidth={1.5} fill="url(#gPrev)" dot={false} />
              <Area type="monotone" dataKey="now"  stroke={C_NOW}  strokeWidth={2}   fill="url(#gNow)"  dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <SectionHeader title="Fraud Detection Quality"
                         sub="Score 0–100 per fraud type"
                         legend={<PeriodLegend />} />
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData} margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
              <PolarGrid stroke="rgba(0,0,0,0.10)" />
              <PolarAngleAxis dataKey="axis" tick={{ fontSize: 10, fill: "#555" }} />
              <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 9, fill: "#999" }} tickCount={4} />
              <Radar name="2024-25" dataKey="prev" stroke={C_PREV} fill={C_PREV} fillOpacity={0.15} strokeWidth={1.5} />
              <Radar name="2025-26" dataKey="now"  stroke={C_NOW}  fill={C_NOW}  fillOpacity={0.25} strokeWidth={2} />
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: any) => [`${v}/100`]} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Row 2: Fraud type bar + Block rate line */}
      <div className="grid grid-cols-2 gap-5">
        <Card>
          <SectionHeader title="Fraud Volume by Type"
                         sub="Cases detected — current vs prior year"
                         legend={<PeriodLegend />} />
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={fraudTypeComparison} barGap={4} margin={{ top: 4, right: 4, left: -8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
              <XAxis dataKey="type" tick={TICK} tickLine={false} axisLine={false} />
              <YAxis tick={TICK} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: any, n: any) => [v, n === "now" ? "2025-26" : "2024-25"]} />
              <Bar dataKey="prev" fill={C_PREV} fillOpacity={0.7} radius={[4,4,0,0]} barSize={12} />
              <Bar dataKey="now"  fill={C_NOW}  radius={[4,4,0,0]} barSize={12} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <SectionHeader title="Block Rate Trend"
                         sub="% of fraud attempts blocked — 12 months" />
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={blockRateTrend} margin={{ top: 4, right: 4, left: -8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
              <XAxis dataKey="m" tick={TICK} tickLine={false} axisLine={false} />
              <YAxis tick={TICK} tickLine={false} axisLine={false}
                     domain={[74, 87]} tickFormatter={(v) => `${v}%`} />
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: any) => [`${v}%`, "Block rate"]} />
              <Line type="monotone" dataKey="rate" stroke={C_NOW} strokeWidth={2.5}
                    dot={{ fill: C_NOW, r: 3, strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: C_NOW }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Row 3: Full-width weekly alert volume */}
      <Card>
        <SectionHeader title="Weekly Alert Volume"
                       sub="12 weeks — total alerts vs blocked"
                       legend={
                         <div className="flex items-center gap-3 shrink-0">
                           <span className="flex items-center gap-1.5 text-[11px] text-[var(--text-secondary)]">
                             <span className="w-4 h-0.5 rounded" style={{ backgroundColor: "#991B1B" }} />Alerts
                           </span>
                           <span className="flex items-center gap-1.5 text-[11px] text-[var(--text-secondary)]">
                             <span className="w-4 h-0.5 rounded" style={{ backgroundColor: "#14532D" }} />Blocked
                           </span>
                         </div>
                       } />
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={weeklyAlerts} margin={{ top: 4, right: 4, left: -8, bottom: 0 }}>
            <defs>
              <linearGradient id="gAlerts" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#991B1B" stopOpacity={0.20} />
                <stop offset="95%" stopColor="#991B1B" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="gBlocked" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#14532D" stopOpacity={0.18} />
                <stop offset="95%" stopColor="#14532D" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
            <XAxis dataKey="w" tick={TICK} tickLine={false} axisLine={false} />
            <YAxis tick={TICK} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Area type="monotone" dataKey="alerts"  stroke="#991B1B" strokeWidth={1.5} fill="url(#gAlerts)"  dot={false} name="Alerts" />
            <Area type="monotone" dataKey="blocked" stroke="#14532D" strokeWidth={2}   fill="url(#gBlocked)" dot={false} name="Blocked" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
const TABS = ["Overview", "Map", "Threat Activity"] as const;
type Tab = (typeof TABS)[number];

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Overview");

  const tabPill = (
    <div className="flex gap-1 mb-5">
      {TABS.map((t) => (
        <button
          key={t}
          onClick={() => setActiveTab(t)}
          className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === t
              ? "text-white"
              : "bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          }`}
          style={{
            backgroundColor: activeTab === t ? C_NOW : undefined,
            boxShadow: "var(--card-shadow)",
          }}
        >
          {t}
        </button>
      ))}
    </div>
  );

  /* Map — truly fullscreen, floating pill to switch tabs */
  if (activeTab === "Map") {
    return (
      <div className="fixed inset-0 z-40">
        <WorldMapView fullscreen />
        <div className="absolute bottom-4 left-4 flex gap-1 z-50">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-3 py-1.5 text-[11px] font-semibold rounded-lg transition-colors backdrop-blur-sm ${
                activeTab === t ? "text-white" : "bg-white/80 text-[var(--text-secondary)] hover:bg-white"
              }`}
              style={{ backgroundColor: activeTab === t ? C_NOW : undefined, boxShadow: "var(--card-shadow)" }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {tabPill}
      {activeTab === "Overview"       && <OverviewTab />}
      {activeTab === "Threat Activity" && <ThreatActivityView fullscreen={false} />}
    </div>
  );
}
