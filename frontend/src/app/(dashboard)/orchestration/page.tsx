"use client";

import { useState } from "react";
import {
  CheckCircle2, Loader2, AlertTriangle, Circle, ChevronRight,
  Database, ShieldCheck, Network, Cpu, Brain, FlaskConical,
  TrendingUp, Scale, Eye, ArrowRight, Info, Clock,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, LineChart, Line,
} from "recharts";
import {
  agents, sourceRankings, timelineEvents, caseExample,
  dataValuationData, type Agent, type AgentStatus,
} from "@/lib/agent-orchestration-config";

// ── Mock 24h data ─────────────────────────────────────────────────────────────

const tx24h = [
  { h: "00", volume: 12.4, fraud: 8,  tp: 98.2 },
  { h: "01", volume: 8.1,  fraud: 5,  tp: 98.5 },
  { h: "02", volume: 5.7,  fraud: 3,  tp: 98.8 },
  { h: "03", volume: 4.2,  fraud: 2,  tp: 99.0 },
  { h: "04", volume: 3.8,  fraud: 1,  tp: 99.1 },
  { h: "05", volume: 5.1,  fraud: 2,  tp: 98.9 },
  { h: "06", volume: 9.3,  fraud: 6,  tp: 98.6 },
  { h: "07", volume: 18.7, fraud: 12, tp: 98.3 },
  { h: "08", volume: 34.2, fraud: 22, tp: 98.1 },
  { h: "09", volume: 52.8, fraud: 31, tp: 97.9 },
  { h: "10", volume: 67.4, fraud: 38, tp: 97.8 },
  { h: "11", volume: 78.9, fraud: 41, tp: 97.9 },
  { h: "12", volume: 91.3, fraud: 48, tp: 98.0 },
  { h: "13", volume: 88.1, fraud: 52, tp: 97.8 },
  { h: "14", volume: 84.6, fraud: 44, tp: 98.1 },
  { h: "15", volume: 79.2, fraud: 39, tp: 98.2 },
  { h: "16", volume: 72.3, fraud: 35, tp: 98.3 },
  { h: "17", volume: 61.8, fraud: 29, tp: 98.4 },
  { h: "18", volume: 48.4, fraud: 23, tp: 98.5 },
  { h: "19", volume: 38.7, fraud: 18, tp: 98.6 },
  { h: "20", volume: 31.2, fraud: 14, tp: 98.7 },
  { h: "21", volume: 24.6, fraud: 11, tp: 98.8 },
  { h: "22", volume: 19.3, fraud: 9,  tp: 98.9 },
  { h: "23", volume: 14.8, fraud: 7,  tp: 99.0 },
];

const fraudRateLast6h = tx24h.slice(18).map((d) => ({
  h: d.h + ":00",
  rate: +((d.fraud / d.volume) * 100).toFixed(2),
  volume: d.volume,
}));

const qualityTrend = [
  { day: "Mon", q: 91 }, { day: "Tue", q: 93 }, { day: "Wed", q: 90 },
  { day: "Thu", q: 94 }, { day: "Fri", q: 92 }, { day: "Sat", q: 95 },
  { day: "Sun", q: 94 },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

const agentIcons = [
  Database, ShieldCheck, Network, Cpu, Brain, FlaskConical, TrendingUp, Scale, Eye,
];

const statusConfig: Record<AgentStatus, { label: string; color: string; bg: string; dot: string }> = {
  completed:   { label: "Completed",   color: "#FFFFFF", bg: "#14532D",              dot: "#FFFFFF" },
  running:     { label: "Running",     color: "#FFFFFF", bg: "#0369A1",              dot: "#FFFFFF" },
  warning:     { label: "Warning",     color: "#FFFFFF", bg: "#92400E",              dot: "#FFFFFF" },
  not_started: { label: "Not Started", color: "#FFFFFF", bg: "#6B7280",              dot: "#FFFFFF" },
};

function StatusPill({ status }: { status: AgentStatus }) {
  const cfg = statusConfig[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wide"
      style={{ backgroundColor: cfg.bg, color: cfg.color }}
    >
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: cfg.dot }} />
      {cfg.label}
    </span>
  );
}

function StatusIcon({ status }: { status: AgentStatus }) {
  if (status === "completed")
    return <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: "var(--brand-accent)" }} strokeWidth={2} />;
  if (status === "running")
    return <Loader2 className="w-4 h-4 shrink-0 animate-spin" style={{ color: "var(--accent-color)" }} strokeWidth={2} />;
  if (status === "warning")
    return <AlertTriangle className="w-4 h-4 shrink-0" style={{ color: "var(--fraud-warning)" }} strokeWidth={2} />;
  return <Circle className="w-4 h-4 shrink-0" style={{ color: "var(--text-tertiary)" }} strokeWidth={1.5} />;
}

function DemoBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold rounded"
          style={{ backgroundColor: "#F97316", color: "#FFFFFF" }}>
      <Info className="w-2.5 h-2.5 shrink-0" strokeWidth={2} />
      demo
    </span>
  );
}

const sourceTypeColors: Record<string, string> = {
  government: "#3D5C00",
  company:    "#005B99",
  internal:   "#14532D",
  external:   "#92400E",
};

const signalTypeColors: Record<string, string> = {
  government:  "#3D5C00",
  company:     "#005B99",
  graph:       "#5B21B6",
  behavioural: "#92400E",
};

const signalTypeLabels: Record<string, string> = {
  government:  "Government data",
  company:     "Company data",
  graph:       "Graph features",
  behavioural: "Behavioural data",
};

const customTooltipStyle = {
  backgroundColor: "var(--bg-elevated)",
  border: "1px solid var(--border-secondary)",
  borderRadius: 8,
  fontSize: 12,
  color: "var(--text-primary)",
};

// ── Stat Card ─────────────────────────────────────────────────────────────────

function AgentStatCard({
  icon: Icon, label, value, sub, accent,
}: { icon: React.ElementType; label: string; value: string; sub: string; accent?: boolean }) {
  return (
    <div className="bg-[var(--bg-primary)] rounded-lg p-4 animate-card-in flex flex-col gap-2"
         style={{ boxShadow: "var(--card-shadow)" }}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wide">{label}</span>
        <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--text-tertiary)" }} strokeWidth={1.5} />
      </div>
      <div className="text-2xl font-bold tracking-tight leading-none"
           style={{ color: accent ? "var(--brand-accent)" : "var(--text-primary)" }}>
        {value}
      </div>
      <div className="text-[11px] text-[var(--text-tertiary)]">{sub}</div>
    </div>
  );
}

// ── 24h Transaction Chart ─────────────────────────────────────────────────────

function TxMonitorChart() {
  return (
    <div className="bg-[var(--bg-primary)] rounded-lg p-5 animate-card-in" style={{ boxShadow: "var(--card-shadow)" }}>
      <div className="flex items-center justify-between mb-1">
        <div>
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Transaction Volume</h2>
          <p className="text-[11px] text-[var(--text-tertiary)] mt-0.5">PayPal — last 24 hours · hourly buckets</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[11px] text-[var(--text-secondary)]">
            <span className="w-3 h-0.5 rounded bg-[#8BBF00] inline-block" />Volume (K txns)
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-[var(--text-secondary)]">
            <span className="w-3 h-0.5 rounded bg-[#DC2626] inline-block" />Fraud alerts
          </span>
          <DemoBadge />
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={tx24h} margin={{ top: 10, right: 4, left: -12, bottom: 0 }}>
          <defs>
            <linearGradient id="limeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#8BBF00" stopOpacity={0.20} />
              <stop offset="95%" stopColor="#8BBF00" stopOpacity={0.01} />
            </linearGradient>
            <linearGradient id="redGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#DC2626" stopOpacity={0.18} />
              <stop offset="95%" stopColor="#DC2626" stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
          <XAxis
            dataKey="h"
            tick={{ fontSize: 10, fill: "var(--text-tertiary)" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => v % 4 === 0 ? `${v}:00` : ""}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "var(--text-tertiary)" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${v}K`}
          />
          <Tooltip
            contentStyle={customTooltipStyle}
            formatter={(v: any, name: any) =>
              name === "volume" ? [`${v}K txns`, "Volume"] : [v, "Fraud alerts"]
            }
            labelFormatter={(l) => `Hour ${l}:00`}
          />
          <Area type="monotone" dataKey="volume" stroke="#8BBF00" strokeWidth={2}
                fill="url(#limeGrad)" dot={false} />
          <Area type="monotone" dataKey="fraud" stroke="#DC2626" strokeWidth={2}
                fill="url(#redGrad)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Agent Pipeline Panel ──────────────────────────────────────────────────────

function AgentPipelinePanel({ onSelectAgent, selectedId }: {
  onSelectAgent: (id: string) => void;
  selectedId: string;
}) {
  return (
    <div className="bg-[var(--bg-primary)] rounded-lg p-4 animate-card-in flex flex-col"
         style={{ boxShadow: "var(--card-shadow)" }}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-[var(--text-primary)]">Agent Pipeline</h2>
        <span className="text-[10px] text-[var(--text-tertiary)]">9 agents · live</span>
      </div>
      <div className="flex-1 space-y-1 overflow-y-auto">
        {agents.map((agent, i) => {
          const Icon = agentIcons[i];
          const cfg = statusConfig[agent.status];
          const isSelected = agent.id === selectedId;
          return (
            <button
              key={agent.id}
              onClick={() => onSelectAgent(agent.id)}
              className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all ${
                isSelected
                  ? "bg-[rgba(61,92,0,0.07)] border border-[rgba(61,92,0,0.18)]"
                  : "hover:bg-[var(--bg-tertiary)] border border-transparent"
              }`}
            >
              <StatusIcon status={agent.status} />
              <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--text-tertiary)" }} strokeWidth={1.5} />
              <span className="flex-1 text-xs text-[var(--text-secondary)] truncate">{agent.shortName}</span>
              <span className="text-[9px] font-semibold uppercase tracking-wide shrink-0"
                    style={{ color: cfg.color }}>
                {cfg.label.slice(0, 4)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Mini Charts Row ───────────────────────────────────────────────────────────

function FraudRateChart() {
  return (
    <div className="bg-[var(--bg-primary)] rounded-lg p-4" style={{ boxShadow: "var(--card-shadow)" }}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-xs font-semibold text-[var(--text-primary)]">Fraud Detection Rate</div>
          <div className="text-[10px] text-[var(--text-tertiary)] mt-0.5">Last 6 hours · % of volume</div>
        </div>
        <DemoBadge />
      </div>
      <ResponsiveContainer width="100%" height={100}>
        <LineChart data={fraudRateLast6h} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis dataKey="h" tick={{ fontSize: 10, fill: "var(--text-tertiary)" }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 10, fill: "var(--text-tertiary)" }} tickLine={false} axisLine={false}
                 tickFormatter={(v) => `${v}%`} />
          <Tooltip contentStyle={customTooltipStyle} formatter={(v: any) => [`${v}%`, "Fraud rate"]} />
          <Line type="monotone" dataKey="rate" stroke="#DC2626" strokeWidth={2} dot={{ fill: "#DC2626", r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function SourceValueChart() {
  const data = dataValuationData.map((d, i) => ({
    name: d.source.replace(" / Orbis", "").replace("Internal ", "").replace(" Registry", " Reg.").replace(" History", ""),
    score: d.dataValueScore,
    lift: +(d.marginalLift * 100).toFixed(1),
  }));
  const barColors = ["#3D5C00", "#3D5C00", "#005B99", "#005B99", "#92400E", "#5B21B6"];

  return (
    <div className="bg-[var(--bg-primary)] rounded-lg p-4" style={{ boxShadow: "var(--card-shadow)" }}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-xs font-semibold text-[var(--text-primary)]">Source Value Scores</div>
          <div className="text-[10px] text-[var(--text-tertiary)] mt-0.5">Data value index · 0–100</div>
        </div>
        <DemoBadge />
      </div>
      <ResponsiveContainer width="100%" height={100}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 4, left: 2, bottom: 0 }}>
          <XAxis type="number" tick={{ fontSize: 9, fill: "var(--text-tertiary)" }} tickLine={false} axisLine={false}
                 domain={[0, 100]} />
          <YAxis dataKey="name" type="category" width={82} tick={{ fontSize: 9, fill: "var(--text-secondary)" }}
                 tickLine={false} axisLine={false} />
          <Tooltip contentStyle={customTooltipStyle} formatter={(v: any) => [v, "Value score"]} />
          <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={9}>
            {data.map((_d, idx) => <Cell key={idx} fill={barColors[idx]} fillOpacity={0.85} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function QualityTrendChart() {
  return (
    <div className="bg-[var(--bg-primary)] rounded-lg p-4" style={{ boxShadow: "var(--card-shadow)" }}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-xs font-semibold text-[var(--text-primary)]">Data Quality Trend</div>
          <div className="text-[10px] text-[var(--text-tertiary)] mt-0.5">Avg quality score · 7 days</div>
        </div>
        <DemoBadge />
      </div>
      <ResponsiveContainer width="100%" height={100}>
        <AreaChart data={qualityTrend} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
          <defs>
            <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#0369A1" stopOpacity={0.18} />
              <stop offset="95%" stopColor="#0369A1" stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
          <XAxis dataKey="day" tick={{ fontSize: 10, fill: "var(--text-tertiary)" }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 10, fill: "var(--text-tertiary)" }} tickLine={false} axisLine={false}
                 domain={[85, 100]} />
          <Tooltip contentStyle={customTooltipStyle} formatter={(v: any) => [v, "Quality"]} />
          <Area type="monotone" dataKey="q" stroke="#0369A1" strokeWidth={2} fill="url(#blueGrad)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Pipeline Full Tab ─────────────────────────────────────────────────────────

function AgentDetailPanel({ agent, icon: Icon }: { agent: Agent; icon: React.ElementType }) {
  const updated = new Date(agent.lastUpdated).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  return (
    <div className="space-y-4 animate-card-in">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5" style={{ color: "var(--text-secondary)" }} strokeWidth={1.5} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[var(--text-primary)] text-base leading-tight">{agent.name}</h3>
          <p className="text-xs text-[var(--text-tertiary)] mt-0.5 flex items-center gap-1">
            <Clock className="w-3 h-3 shrink-0" strokeWidth={1.5} />
            Last updated {updated}
          </p>
        </div>
        <StatusPill status={agent.status} />
      </div>

      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{agent.description}</p>

      <div className="grid grid-cols-2 gap-2">
        {agent.metrics.map((m) => (
          <div key={m.label} className="rounded-lg p-3 border border-[var(--border-primary)] bg-[var(--bg-secondary)]">
            <div className="flex items-start justify-between gap-1 mb-1">
              <span className="text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wide leading-tight">{m.label}</span>
              {m.demo && <DemoBadge />}
            </div>
            <div className="text-lg font-bold text-[var(--text-primary)] leading-tight">{m.value}</div>
          </div>
        ))}
      </div>

      {agent.warnings.length > 0 && (
        <div className="rounded-lg border border-[var(--fraud-warning)] bg-[var(--fraud-warning-bg)] p-3 space-y-1">
          <div className="flex items-center gap-1.5 mb-1">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--fraud-warning)" }} strokeWidth={2} />
            <span className="text-xs font-semibold" style={{ color: "var(--fraud-warning)" }}>Warnings</span>
          </div>
          {agent.warnings.map((w, i) => (
            <p key={i} className="text-xs" style={{ color: "var(--fraud-warning)" }}>{w}</p>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wide text-[var(--text-tertiary)] mb-1.5">Inputs</div>
          <ul className="space-y-1">
            {agent.inputs.map((inp, i) => (
              <li key={i} className="flex items-start gap-1.5 text-xs text-[var(--text-secondary)]">
                <span className="w-1 h-1 rounded-full bg-[var(--text-tertiary)] mt-1.5 shrink-0" />
                {inp}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wide text-[var(--text-tertiary)] mb-1.5">Outputs</div>
          <ul className="space-y-1">
            {agent.outputs.map((out, i) => (
              <li key={i} className="flex items-start gap-1.5 text-xs text-[var(--text-secondary)]">
                <span className="w-1 h-1 rounded-full bg-[var(--text-tertiary)] mt-1.5 shrink-0" />
                {out}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <div className="text-[10px] font-semibold uppercase tracking-wide text-[var(--text-tertiary)] mb-1.5">Key Checks</div>
        <ul className="space-y-1">
          {agent.checks.map((c, i) => (
            <li key={i} className="flex items-start gap-1.5 text-xs text-[var(--text-secondary)]">
              <CheckCircle2 className="w-3 h-3 shrink-0 mt-0.5" style={{ color: "var(--brand-accent)" }} strokeWidth={2} />
              {c}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-lg bg-[var(--bg-tertiary)] p-3">
        <div className="text-[10px] font-semibold uppercase tracking-wide text-[var(--text-tertiary)] mb-1">Next Recommended Action</div>
        <p className="text-xs text-[var(--text-primary)]">{agent.nextAction}</p>
      </div>
    </div>
  );
}

function PipelineTab({ selectedId, onSelect }: { selectedId: string; onSelect: (id: string) => void }) {
  const selected = agents.find((a) => a.id === selectedId)!;
  const selectedIdx = agents.findIndex((a) => a.id === selectedId);
  const SelectedIcon = agentIcons[selectedIdx];

  return (
    <div className="grid grid-cols-[260px_1fr] gap-5">
      <div className="space-y-1">
        {agents.map((agent, i) => {
          const Icon = agentIcons[i];
          const isSelected = agent.id === selectedId;
          return (
            <button
              key={agent.id}
              onClick={() => onSelect(agent.id)}
              className={`w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-lg border transition-all ${
                isSelected
                  ? "border-[rgba(90,124,10,0.25)] bg-[rgba(90,124,10,0.06)]"
                  : "border-transparent hover:bg-[var(--bg-secondary)] hover:border-[var(--border-primary)]"
              }`}
            >
              <StatusIcon status={agent.status} />
              <Icon className="w-3.5 h-3.5 shrink-0 text-[var(--text-tertiary)]" strokeWidth={1.5} />
              <span className="flex-1 text-xs font-medium text-[var(--text-secondary)] truncate">{agent.name}</span>
              <ChevronRight className="w-3 h-3 shrink-0 text-[var(--text-tertiary)]" strokeWidth={1.5} />
            </button>
          );
        })}
      </div>
      <div className="bg-[var(--bg-primary)] rounded-lg p-5" style={{ boxShadow: "var(--card-shadow)" }}>
        <AgentDetailPanel agent={selected} icon={SelectedIcon} />
      </div>
    </div>
  );
}

// ── Data Flow Diagram ─────────────────────────────────────────────────────────

const flowSteps = [
  { label: "Provider Data",    sub: "Raw ingestion",           color: "#3D5C00" },
  { label: "Quality Checks",   sub: "Completeness & freshness", color: "#005B99" },
  { label: "Entity Matching",  sub: "Cross-source resolution",  color: "#5B21B6" },
  { label: "Feature Gen.",     sub: "312 fraud signals",        color: "#92400E" },
  { label: "Fraud Model",      sub: "Ensemble scoring",         color: "#B91C1C" },
  { label: "With vs Without",  sub: "Ablation evaluation",      color: "#9D174D" },
  { label: "Value Score",      sub: "0 – 100 per source",       color: "#3D5C00" },
];

function DataFlowDiagram() {
  return (
    <div className="overflow-x-auto">
      <div className="flex items-center gap-0 min-w-max py-1">
        {flowSteps.map((step, i) => (
          <div key={i} className="flex items-center">
            <div
              className="w-28 rounded-lg px-3 py-2.5 text-center"
              style={{ backgroundColor: step.color + "12", border: `1px solid ${step.color}30` }}
            >
              <div className="text-xs font-semibold leading-tight" style={{ color: step.color }}>
                {step.label}
              </div>
              <div className="text-[10px] mt-0.5" style={{ color: step.color + "99" }}>
                {step.sub}
              </div>
            </div>
            {i < flowSteps.length - 1 && (
              <ArrowRight className="w-4 h-4 mx-1 shrink-0 text-[var(--text-tertiary)]" strokeWidth={1.5} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Data Valuation Tab ────────────────────────────────────────────────────────

function DataValuationTab() {
  const chartData = dataValuationData.map((d) => ({
    name: d.source.replace(" / Orbis", "").replace("Internal ", ""),
    lift: +(d.marginalLift * 100).toFixed(1),
    score: d.dataValueScore,
  }));
  const barColors = ["#3D5C00", "#3D5C00", "#005B99", "#005B99", "#92400E", "#5B21B6"];

  return (
    <div className="space-y-5">
      <div className="rounded-lg bg-[var(--bg-primary)] p-4" style={{ boxShadow: "var(--card-shadow)" }}>
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-[rgba(90,124,10,0.10)] flex items-center justify-center shrink-0">
            <TrendingUp className="w-4 h-4 shrink-0" style={{ color: "var(--brand-accent)" }} strokeWidth={1.5} />
          </div>
          <div>
            <div className="text-sm font-semibold text-[var(--text-primary)] mb-1">Data Valuation Formula</div>
            <code className="text-xs font-mono bg-[var(--bg-tertiary)] px-2 py-1 rounded-lg text-[var(--text-primary)]">
              Value(source) = Utility(model <strong>with</strong> source) − Utility(model <strong>without</strong> source)
            </code>
            <p className="text-xs text-[var(--text-tertiary)] mt-1.5">
              Utility measured as PR-AUC on hold-out fraud labels. Also tracked: recall at fixed FPR, fraud loss prevented, FP cost reduction.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Baseline PR-AUC",       value: "0.721", sub: "No external sources" },
          { label: "Full Ensemble PR-AUC",  value: "0.847", sub: "+12.6 pp vs baseline", accent: true },
          { label: "Top Source Lift",       value: "+9.4 pp", sub: "Government Registry", accent: true },
          { label: "Est. Annual Value",     value: "£2.68M", sub: "Combined source uplift" },
        ].map((s) => (
          <div key={s.label} className="rounded-lg bg-[var(--bg-primary)] p-3" style={{ boxShadow: "var(--card-shadow)" }}>
            <div className="flex items-start justify-between mb-1">
              <span className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wide">{s.label}</span>
              <DemoBadge />
            </div>
            <div className="text-xl font-bold" style={{ color: s.accent ? "var(--brand-accent)" : "var(--text-primary)" }}>{s.value}</div>
            <div className="text-[10px] text-[var(--text-tertiary)] mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="rounded-lg bg-[var(--bg-primary)] p-4" style={{ boxShadow: "var(--card-shadow)" }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Marginal PR-AUC Lift by Source</h3>
            <DemoBadge />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: "var(--text-tertiary)" }} tickLine={false} axisLine={false}
                     tickFormatter={(v) => `+${v} pp`} />
              <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11, fill: "var(--text-secondary)" }}
                     tickLine={false} axisLine={false} />
              <Tooltip contentStyle={customTooltipStyle} formatter={(v: any) => [`+${v} pp`, "PR-AUC lift"]} />
              <Bar dataKey="lift" radius={[0, 4, 4, 0]}>
                {chartData.map((_, idx) => <Cell key={idx} fill={barColors[idx % barColors.length]} fillOpacity={0.85} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg bg-[var(--bg-primary)] p-4" style={{ boxShadow: "var(--card-shadow)" }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Leave-One-Out Ablation</h3>
            <DemoBadge />
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[var(--border-primary)]">
                {["Source", "With", "Without", "Lift", "Shapley", "Score"].map((h) => (
                  <th key={h} className="pb-2 text-left font-semibold text-[var(--text-tertiary)] pr-2 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataValuationData.map((d, i) => (
                <tr key={i} className="border-b border-[var(--border-primary)] last:border-0">
                  <td className="py-2 pr-2 text-[var(--text-secondary)] font-medium whitespace-nowrap">
                    {d.source.replace(" / Orbis", "").replace("Internal ", "Int. ")}
                  </td>
                  <td className="py-2 pr-2 font-mono text-[var(--text-primary)]">{d.utilityWith.toFixed(3)}</td>
                  <td className="py-2 pr-2 font-mono text-[var(--text-tertiary)]">{d.utilityWithout.toFixed(3)}</td>
                  <td className="py-2 pr-2 font-medium" style={{ color: "var(--brand-accent)" }}>
                    +{(d.marginalLift * 100).toFixed(1)} pp
                  </td>
                  <td className="py-2 pr-2 font-mono text-[var(--text-secondary)]">{d.shapleyScore.toFixed(3)}</td>
                  <td className="py-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-12 h-1.5 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${d.dataValueScore}%`, backgroundColor: barColors[i % barColors.length] }} />
                      </div>
                      <span className="font-semibold text-[var(--text-primary)]">{d.dataValueScore}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-lg bg-[var(--bg-primary)] p-4" style={{ boxShadow: "var(--card-shadow)" }}>
        <div className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wide mb-2">Utility Dimensions (configurable)</div>
        <div className="flex flex-wrap gap-2">
          {["PR-AUC lift", "Recall at fixed false-positive rate", "Fraud loss prevented (£)", "False-positive cost reduction (£)", "Investigation cost reduction (£)"].map((dim) => (
            <span key={dim} className="px-2.5 py-1 text-xs rounded-lg bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-primary)]">
              {dim}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Source Rankings Tab ───────────────────────────────────────────────────────

function SourceRankingsTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--text-tertiary)]">
          Ranked by Data Value Score. All scores are illustrative — <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-[var(--fraud-warning-bg)] text-[var(--fraud-warning)]">demo</span>
        </p>
        <div className="flex items-center gap-2">
          {(["government", "internal", "company", "external"] as const).map((t) => (
            <span key={t} className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-primary)]">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: sourceTypeColors[t] }} />
              <span className="capitalize text-[var(--text-secondary)]">{t}</span>
            </span>
          ))}
        </div>
      </div>
      <div className="rounded-lg bg-[var(--bg-primary)] overflow-hidden" style={{ boxShadow: "var(--card-shadow)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[var(--border-primary)] bg-[var(--bg-secondary)]">
                {["Source / Provider", "Type", "Coverage", "Freshness", "Quality", "Pred. Lift", "Fin. Utility", "Redundancy", "Uniqueness", "Value Score", "Weight", "Best Use Case"].map((h) => (
                  <th key={h} className="px-3 py-2.5 text-left font-semibold text-[var(--text-tertiary)] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sourceRankings.slice().sort((a, b) => b.dataValueScore - a.dataValueScore).map((src) => (
                <tr key={src.id} className="border-b border-[var(--border-primary)] last:border-0 hover:bg-[var(--bg-secondary)] transition-colors">
                  <td className="px-3 py-2.5 font-medium text-[var(--text-primary)] whitespace-nowrap">{src.name}</td>
                  <td className="px-3 py-2.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize"
                          style={{ backgroundColor: sourceTypeColors[src.type] + "18", color: sourceTypeColors[src.type] }}>
                      {src.type}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-[var(--text-secondary)]">{src.coverage}</td>
                  <td className="px-3 py-2.5 text-[var(--text-secondary)]">{src.freshness}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-10 h-1.5 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
                        <div className="h-full rounded-full" style={{
                          width: `${src.qualityScore}%`,
                          backgroundColor: src.qualityScore >= 80 ? "#3D5C00" : src.qualityScore >= 60 ? "#92400E" : "#B91C1C",
                        }} />
                      </div>
                      <span className="text-[var(--text-primary)] font-medium">{src.qualityScore}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 font-medium" style={{ color: src.predictiveLift.startsWith("+") ? "var(--brand-accent)" : "var(--text-tertiary)" }}>
                    {src.predictiveLift}
                  </td>
                  <td className="px-3 py-2.5 text-[var(--text-secondary)]">{src.financialUtility}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-8 h-1.5 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${src.redundancyScore}%`, backgroundColor: src.redundancyScore > 50 ? "#FF3333" : "#FFA500" }} />
                      </div>
                      <span className="text-[var(--text-secondary)]">{src.redundancyScore}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-8 h-1.5 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
                        <div className="h-full rounded-full bg-[#00D0FF]" style={{ width: `${src.uniquenessScore}%` }} />
                      </div>
                      <span className="text-[var(--text-secondary)]">{src.uniquenessScore}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    {src.dataValueScore > 0 ? (
                      <div className="flex items-center gap-1.5">
                        <div className="w-10 h-2 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
                          <div className="h-full rounded-full" style={{
                            width: `${src.dataValueScore}%`,
                            backgroundColor: src.dataValueScore >= 75 ? "#3D5C00" : src.dataValueScore >= 55 ? "#92400E" : "#B91C1C",
                          }} />
                        </div>
                        <span className="font-bold text-[var(--text-primary)]">{src.dataValueScore}</span>
                      </div>
                    ) : (
                      <span className="text-[var(--text-tertiary)]">Pending</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 font-semibold text-[var(--text-primary)]">{src.recommendedWeight}</td>
                  <td className="px-3 py-2.5 text-[var(--text-secondary)] whitespace-nowrap">{src.bestUseCase}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Case Explorer Tab ─────────────────────────────────────────────────────────

function CaseExplorerTab() {
  const c = caseExample;
  const riskColor = c.riskBand === "Critical" ? "var(--fraud-critical)" : c.riskBand === "High" ? "var(--fraud-warning)" : "var(--brand-accent)";
  const riskBg    = c.riskBand === "Critical" ? "var(--fraud-critical-bg)" : c.riskBand === "High" ? "var(--fraud-warning-bg)" : "rgba(229,255,143,0.10)";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <p className="text-sm text-[var(--text-tertiary)]">
          Source contribution for a single fraud case — shows which data source powered each signal.
        </p>
        <DemoBadge />
      </div>

      <div className="rounded-lg bg-[var(--bg-primary)] p-5" style={{ boxShadow: "var(--card-shadow)" }}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wide mb-0.5">Entity</div>
            <div className="text-lg font-bold text-[var(--text-primary)]">{c.entityName}</div>
            <div className="text-xs text-[var(--text-tertiary)] mt-0.5">Case ID: {c.id} · {c.reviewStatus}</div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wide mb-1">Fraud Probability</div>
              <div className="text-3xl font-black" style={{ color: riskColor }}>
                {(c.fraudProbability * 100).toFixed(0)}%
              </div>
            </div>
            <div className="text-center">
              <div className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wide mb-1">Risk Band</div>
              <span className="inline-block px-3 py-1 rounded-lg text-sm font-bold"
                    style={{ backgroundColor: riskBg, color: riskColor }}>
                {c.riskBand}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-[var(--bg-primary)] p-5" style={{ boxShadow: "var(--card-shadow)" }}>
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Top Fraud Signals & Source Attribution</h3>
        <div className="space-y-2.5">
          {c.signals.map((sig, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-[var(--bg-secondary)]">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold"
                   style={{ backgroundColor: signalTypeColors[sig.sourceType] + "20", color: signalTypeColors[sig.sourceType] }}>
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[var(--text-primary)] font-medium leading-snug">{sig.signal}</p>
                <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                        style={{ backgroundColor: signalTypeColors[sig.sourceType] + "18", color: signalTypeColors[sig.sourceType] }}>
                    {sig.source}
                  </span>
                  <span className="text-[10px] text-[var(--text-tertiary)]">{signalTypeLabels[sig.sourceType]}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[10px] text-[var(--text-tertiary)] mb-0.5">Confidence</div>
                <div className="font-bold text-sm" style={{ color: signalTypeColors[sig.sourceType] }}>
                  {(sig.confidence * 100).toFixed(0)}%
                </div>
                <div className="text-[10px] text-[var(--text-tertiary)] mt-0.5">Weight {(sig.featureWeight * 100).toFixed(0)} pp</div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[var(--border-primary)] flex-wrap">
          {(Object.entries(signalTypeLabels) as [string, string][]).map(([key, label]) => (
            <span key={key} className="flex items-center gap-1.5 text-[10px] text-[var(--text-secondary)]">
              <span className="w-2.5 h-2.5 rounded" style={{ backgroundColor: signalTypeColors[key] }} />
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Timeline Tab ──────────────────────────────────────────────────────────────

const timelineTypeStyle = {
  success: { dot: "var(--brand-accent)",  text: "var(--brand-accent)" },
  warning: { dot: "var(--fraud-warning)", text: "var(--fraud-warning)" },
  info:    { dot: "var(--text-tertiary)", text: "var(--text-secondary)" },
};

function TimelineTab() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <p className="text-sm text-[var(--text-tertiary)]">Orchestration activity log — today's pipeline run.</p>
        <DemoBadge />
      </div>
      <div className="rounded-lg bg-[var(--bg-primary)] p-5" style={{ boxShadow: "var(--card-shadow)" }}>
        <div className="space-y-0">
          {timelineEvents.map((ev, i) => {
            const style = timelineTypeStyle[ev.type];
            return (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0 mt-1.5" style={{ backgroundColor: style.dot }} />
                  {i < timelineEvents.length - 1 && (
                    <div className="w-px flex-1 bg-[var(--border-primary)] my-0.5" style={{ minHeight: 16 }} />
                  )}
                </div>
                <div className="pb-3 flex-1">
                  <div className="flex items-start gap-2 flex-wrap">
                    <span className="font-mono text-[10px] text-[var(--text-tertiary)] pt-0.5 shrink-0">{ev.time}</span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-[var(--bg-tertiary)] text-[var(--text-secondary)] shrink-0">
                      {ev.agent}
                    </span>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: style.text }}>{ev.event}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

const TABS = ["Pipeline", "Data Valuation", "Source Rankings", "Case Explorer", "Timeline"] as const;
type Tab = typeof TABS[number];

export default function OrchestrationPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Pipeline");
  const [selectedAgentId, setSelectedAgentId] = useState("data-intake");

  const runningCount   = agents.filter((a) => a.status === "running").length;
  const warningCount   = agents.filter((a) => a.status === "warning").length;
  const completedCount = agents.filter((a) => a.status === "completed").length;

  return (
    <div className="space-y-5">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Agentic Orchestration</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">
            Multi-agent fraud intelligence &amp; data valuation pipeline · PayPal transaction monitoring — last 24 hours
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
                style={{ backgroundColor: "#14532D", color: "#FFFFFF" }}>
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
            {completedCount} Completed
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
                style={{ backgroundColor: "#0369A1", color: "#FFFFFF" }}>
            <Loader2 className="w-3.5 h-3.5 shrink-0 animate-spin" strokeWidth={2} />
            {runningCount} Running
          </span>
          {warningCount > 0 && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
                  style={{ backgroundColor: "#92400E", color: "#FFFFFF" }}>
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
              {warningCount} Warning
            </span>
          )}
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-4 gap-4">
        <AgentStatCard icon={Database}   label="Records in pipeline"   value="2.85M"   sub="Across 7 providers" accent />
        <AgentStatCard icon={Network}    label="Entities resolved"     value="18,420"  sub="71.4% cross-source match rate" />
        <AgentStatCard icon={Brain}      label="Model PR-AUC"          value="0.847"   sub="v3.4.0 live · v3.4.1 training" accent />
        <AgentStatCard icon={ShieldCheck} label="Sources active"       value="6 / 7"   sub="Source G pending quality gate" />
      </div>

      {/* ── 24h chart + pipeline panel ── */}
      <div className="grid grid-cols-[1fr_280px] gap-4">
        <TxMonitorChart />
        <AgentPipelinePanel selectedId={selectedAgentId} onSelectAgent={setSelectedAgentId} />
      </div>

      {/* ── Mini charts ── */}
      <div className="grid grid-cols-3 gap-4">
        <FraudRateChart />
        <SourceValueChart />
        <QualityTrendChart />
      </div>

      {/* ── Data flow ── */}
      <div className="rounded-lg bg-[var(--bg-primary)] p-4" style={{ boxShadow: "var(--card-shadow)" }}>
        <div className="text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wide mb-3">
          Data Value Pipeline
        </div>
        <DataFlowDiagram />
      </div>

      {/* ── Tabs ── */}
      <div className="-mx-6 px-6 border-b border-[var(--border-primary)] flex items-center gap-1">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${
              activeTab === tab
                ? "border-[#F97316] text-[#C2410C]"
                : "border-transparent text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="pt-1">
        {activeTab === "Pipeline"        && <PipelineTab selectedId={selectedAgentId} onSelect={setSelectedAgentId} />}
        {activeTab === "Data Valuation"  && <DataValuationTab />}
        {activeTab === "Source Rankings" && <SourceRankingsTab />}
        {activeTab === "Case Explorer"   && <CaseExplorerTab />}
        {activeTab === "Timeline"        && <TimelineTab />}
      </div>
    </div>
  );
}
