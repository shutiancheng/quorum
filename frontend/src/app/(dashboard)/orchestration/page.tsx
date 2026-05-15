"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Loader2,
  AlertTriangle,
  Circle,
  ChevronRight,
  Database,
  ShieldCheck,
  Network,
  Cpu,
  Brain,
  FlaskConical,
  TrendingUp,
  Scale,
  Eye,
  ArrowRight,
  Info,
  Clock,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  agents,
  sourceRankings,
  timelineEvents,
  caseExample,
  dataValuationData,
  type Agent,
  type AgentStatus,
} from "@/lib/agent-orchestration-config";

// ── Helpers ───────────────────────────────────────────────────────────────────

const agentIcons = [
  Database, ShieldCheck, Network, Cpu, Brain, FlaskConical, TrendingUp, Scale, Eye,
];

const statusConfig: Record<AgentStatus, { label: string; color: string; bg: string; dot: string }> = {
  completed:   { label: "Completed",   color: "var(--fraud-cleared)",   bg: "var(--fraud-cleared-bg)",  dot: "#16a34a" },
  running:     { label: "Running",     color: "#6366f1",                bg: "#eef2ff",                  dot: "#6366f1" },
  warning:     { label: "Warning",     color: "var(--fraud-warning)",   bg: "var(--fraud-warning-bg)",  dot: "#f59e0b" },
  not_started: { label: "Not Started", color: "var(--text-tertiary)",   bg: "var(--bg-tertiary)",       dot: "#a8a29e" },
};

function StatusPill({ status }: { status: AgentStatus }) {
  const cfg = statusConfig[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-full"
      style={{ backgroundColor: cfg.bg, color: cfg.color }}
    >
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: cfg.dot }} />
      {cfg.label}
    </span>
  );
}

function StatusIcon({ status }: { status: AgentStatus }) {
  if (status === "completed")
    return <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: "var(--fraud-cleared)" }} strokeWidth={2} />;
  if (status === "running")
    return <Loader2 className="w-4 h-4 shrink-0 animate-spin" style={{ color: "#6366f1" }} strokeWidth={2} />;
  if (status === "warning")
    return <AlertTriangle className="w-4 h-4 shrink-0" style={{ color: "var(--fraud-warning)" }} strokeWidth={2} />;
  return <Circle className="w-4 h-4 shrink-0" style={{ color: "var(--text-tertiary)" }} strokeWidth={1.5} />;
}

function DemoBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium rounded bg-[var(--fraud-warning-bg)] text-[var(--fraud-warning)]">
      <Info className="w-2.5 h-2.5 shrink-0" strokeWidth={2} />
      demo
    </span>
  );
}

const sourceTypeColors: Record<string, string> = {
  government: "#6366f1",
  company:    "#0ea5e9",
  internal:   "#16a34a",
  external:   "#f59e0b",
};

const sourceTypeBgs: Record<string, string> = {
  government: "#eef2ff",
  company:    "#f0f9ff",
  internal:   "#f0fdf4",
  external:   "#fffbeb",
};

const signalTypeLabels: Record<string, string> = {
  government:  "Government data",
  company:     "Company data",
  graph:       "Graph features",
  behavioural: "Behavioural data",
};

// ── Pipeline Node ─────────────────────────────────────────────────────────────

function PipelineNode({
  agent,
  icon: Icon,
  index,
  selected,
  onSelect,
  isLast,
}: {
  agent: Agent;
  icon: React.ElementType;
  index: number;
  selected: boolean;
  onSelect: () => void;
  isLast: boolean;
}) {
  return (
    <div className="flex flex-col items-center">
      <button
        onClick={onSelect}
        className={`w-full text-left rounded-xl border transition-all p-3 ${
          selected
            ? "border-[var(--brand-primary)] bg-[var(--bg-tertiary)] shadow-sm ring-1 ring-[var(--brand-primary)]"
            : "border-[var(--border-primary)] bg-[var(--bg-primary)] hover:border-[var(--border-secondary)] hover:bg-[var(--bg-secondary)]"
        }`}
      >
        <div className="flex items-center gap-2.5 mb-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: "var(--bg-tertiary)" }}
          >
            <Icon className="w-3.5 h-3.5" style={{ color: "var(--text-secondary)" }} strokeWidth={1.5} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-[var(--text-primary)] leading-tight truncate">
              {agent.name}
            </div>
          </div>
          <ChevronRight className="w-3 h-3 shrink-0 text-[var(--text-tertiary)]" strokeWidth={1.5} />
        </div>
        <div className="flex items-center justify-between gap-2">
          <StatusPill status={agent.status} />
          {agent.metrics[0] && (
            <span className="text-[10px] text-[var(--text-tertiary)] truncate max-w-[90px]">
              {agent.metrics[0].value} {agent.metrics[0].label}
            </span>
          )}
        </div>
      </button>
      {!isLast && (
        <div className="flex flex-col items-center py-0.5">
          <div className="w-px h-3 bg-[var(--border-secondary)]" />
          <div className="w-1.5 h-1.5 rotate-45 border-r border-b border-[var(--border-secondary)]" />
        </div>
      )}
    </div>
  );
}

// ── Agent Detail Panel ────────────────────────────────────────────────────────

function AgentDetailPanel({ agent, icon: Icon }: { agent: Agent; icon: React.ElementType }) {
  const updated = new Date(agent.lastUpdated).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="space-y-4 animate-card-in">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center shrink-0">
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

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-2">
        {agent.metrics.map((m) => (
          <div
            key={m.label}
            className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3"
          >
            <div className="flex items-start justify-between gap-1 mb-1">
              <span className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wide leading-tight">{m.label}</span>
              {m.demo && <DemoBadge />}
            </div>
            <div className="text-lg font-bold text-[var(--text-primary)] leading-tight">{m.value}</div>
          </div>
        ))}
      </div>

      {/* Warnings */}
      {agent.warnings.length > 0 && (
        <div className="rounded-xl border border-[var(--fraud-warning)] bg-[var(--fraud-warning-bg)] p-3 space-y-1">
          <div className="flex items-center gap-1.5 mb-1">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--fraud-warning)" }} strokeWidth={2} />
            <span className="text-xs font-semibold" style={{ color: "var(--fraud-warning)" }}>Warnings</span>
          </div>
          {agent.warnings.map((w, i) => (
            <p key={i} className="text-xs" style={{ color: "var(--fraud-warning)" }}>{w}</p>
          ))}
        </div>
      )}

      {/* I/O */}
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

      {/* Checks */}
      <div>
        <div className="text-[10px] font-semibold uppercase tracking-wide text-[var(--text-tertiary)] mb-1.5">Key Checks / Logic</div>
        <ul className="space-y-1">
          {agent.checks.map((c, i) => (
            <li key={i} className="flex items-start gap-1.5 text-xs text-[var(--text-secondary)]">
              <CheckCircle2 className="w-3 h-3 shrink-0 mt-0.5" style={{ color: "var(--fraud-cleared)" }} strokeWidth={2} />
              {c}
            </li>
          ))}
        </ul>
      </div>

      {/* Next action */}
      <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-tertiary)] p-3">
        <div className="text-[10px] font-semibold uppercase tracking-wide text-[var(--text-tertiary)] mb-1">Next Recommended Action</div>
        <p className="text-xs text-[var(--text-primary)]">{agent.nextAction}</p>
      </div>
    </div>
  );
}

// ── Pipeline Tab ──────────────────────────────────────────────────────────────

function PipelineTab() {
  const [selectedId, setSelectedId] = useState("data-intake");
  const selected = agents.find((a) => a.id === selectedId)!;
  const selectedIdx = agents.findIndex((a) => a.id === selectedId);
  const SelectedIcon = agentIcons[selectedIdx];

  return (
    <div className="grid grid-cols-[280px_1fr] gap-5">
      {/* Pipeline column */}
      <div className="space-y-0">
        <div className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-tertiary)] mb-3">
          Agent Pipeline
        </div>
        {agents.map((agent, i) => (
          <PipelineNode
            key={agent.id}
            agent={agent}
            icon={agentIcons[i]}
            index={i}
            selected={selectedId === agent.id}
            onSelect={() => setSelectedId(agent.id)}
            isLast={i === agents.length - 1}
          />
        ))}
      </div>

      {/* Detail panel */}
      <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-primary)] shadow-[var(--card-shadow)] p-5">
        <AgentDetailPanel agent={selected} icon={SelectedIcon} />
      </div>
    </div>
  );
}

// ── Data Flow Diagram ─────────────────────────────────────────────────────────

const flowSteps = [
  { label: "Provider Data", sub: "Raw ingestion", color: "#6366f1" },
  { label: "Quality Checks", sub: "Completeness & freshness", color: "#0ea5e9" },
  { label: "Entity Matching", sub: "Cross-source resolution", color: "#8b5cf6" },
  { label: "Feature Generation", sub: "312 fraud signals", color: "#f59e0b" },
  { label: "Fraud Model", sub: "Ensemble scoring", color: "#ef4444" },
  { label: "With vs Without", sub: "Ablation evaluation", color: "#ec4899" },
  { label: "Data Value Score", sub: "0 – 100 per source", color: "#16a34a" },
];

function DataFlowDiagram() {
  return (
    <div className="overflow-x-auto">
      <div className="flex items-center gap-0 min-w-max py-2">
        {flowSteps.map((step, i) => (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className="w-28 rounded-xl px-3 py-2.5 text-center"
                style={{ backgroundColor: step.color + "18", border: `1.5px solid ${step.color}40` }}
              >
                <div className="text-xs font-semibold leading-tight" style={{ color: step.color }}>
                  {step.label}
                </div>
                <div className="text-[10px] mt-0.5" style={{ color: step.color + "bb" }}>
                  {step.sub}
                </div>
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
    shapley: +(d.shapleyScore * 100).toFixed(1),
    score: d.dataValueScore,
  }));

  const barColors = ["#6366f1", "#16a34a", "#0ea5e9", "#8b5cf6", "#f59e0b", "#ec4899"];

  return (
    <div className="space-y-5">
      {/* Formula banner */}
      <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center shrink-0">
            <TrendingUp className="w-4 h-4 text-[var(--text-secondary)] shrink-0" strokeWidth={1.5} />
          </div>
          <div>
            <div className="text-sm font-semibold text-[var(--text-primary)] mb-1">Data Valuation Formula</div>
            <code className="text-xs font-mono bg-[var(--bg-tertiary)] px-2 py-1 rounded-lg text-[var(--text-primary)] border border-[var(--border-primary)]">
              Value(source) = Utility(model <strong>with</strong> source) − Utility(model <strong>without</strong> source)
            </code>
            <p className="text-xs text-[var(--text-tertiary)] mt-1.5">
              Utility measured as PR-AUC on hold-out fraud labels. Also tracked: recall at fixed FPR, fraud loss prevented, FP cost reduction.
            </p>
          </div>
        </div>
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Baseline PR-AUC", value: "0.721", sub: "No external sources" },
          { label: "Full Ensemble PR-AUC", value: "0.847", sub: "+12.6 pp vs baseline" },
          { label: "Top Source Lift", value: "+9.4 pp", sub: "Government Registry" },
          { label: "Est. Annual Value", value: "£2.68M", sub: "Combined source uplift" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] p-3 shadow-[var(--card-shadow)]">
            <div className="flex items-start justify-between mb-1">
              <span className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wide">{s.label}</span>
              <DemoBadge />
            </div>
            <div className="text-xl font-bold text-[var(--text-primary)]">{s.value}</div>
            <div className="text-[10px] text-[var(--text-tertiary)] mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Chart + table */}
      <div className="grid grid-cols-[1fr_1fr] gap-5">
        {/* Marginal lift chart */}
        <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-primary)] shadow-[var(--card-shadow)] p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Marginal PR-AUC Lift by Source</h3>
            <DemoBadge />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: "var(--text-tertiary)" }} tickFormatter={(v) => `+${v} pp`} />
              <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11, fill: "var(--text-secondary)" }} />
              <Tooltip
                formatter={(v) => [`+${v} pp`, "PR-AUC lift"]}
                contentStyle={{ backgroundColor: "var(--bg-elevated)", border: "1px solid var(--border-primary)", borderRadius: 10, fontSize: 12 }}
              />
              <Bar dataKey="lift" radius={[0, 4, 4, 0]}>
                {chartData.map((_, idx) => (
                  <Cell key={idx} fill={barColors[idx % barColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Ablation table */}
        <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-primary)] shadow-[var(--card-shadow)] p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Leave-One-Out Ablation</h3>
            <DemoBadge />
          </div>
          <div className="overflow-x-auto">
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
                    <td className="py-2 pr-2 font-medium" style={{ color: "var(--fraud-cleared)" }}>
                      +{(d.marginalLift * 100).toFixed(1)} pp
                    </td>
                    <td className="py-2 pr-2 font-mono text-[var(--text-secondary)]">{d.shapleyScore.toFixed(3)}</td>
                    <td className="py-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-12 h-1.5 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${d.dataValueScore}%`, backgroundColor: barColors[i % barColors.length] }}
                          />
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
      </div>

      {/* Utility dimensions note */}
      <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4">
        <div className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wide mb-2">Utility Dimensions (configurable)</div>
        <div className="flex flex-wrap gap-2">
          {["PR-AUC lift", "Recall at fixed false-positive rate", "Fraud loss prevented (£)", "False-positive cost reduction (£)", "Investigation cost reduction (£)"].map((dim) => (
            <span key={dim} className="px-2.5 py-1 text-xs rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-secondary)]">
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
          Ranked by Data Value Score. All scores are illustrative — marked {" "}
          <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-[var(--fraud-warning-bg)] text-[var(--fraud-warning)]">demo</span>.
        </p>
        <div className="flex items-center gap-2">
          {(["government", "internal", "company", "external"] as const).map((t) => (
            <span key={t} className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-primary)]">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: sourceTypeColors[t] }} />
              <span className="capitalize text-[var(--text-secondary)]">{t}</span>
            </span>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-primary)] shadow-[var(--card-shadow)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[var(--border-primary)] bg-[var(--bg-secondary)]">
                {[
                  "Source / Provider", "Type", "Coverage", "Freshness", "Quality",
                  "Pred. Lift", "Fin. Utility", "Redundancy", "Uniqueness",
                  "Value Score", "Weight", "Best Use Case",
                ].map((h) => (
                  <th key={h} className="px-3 py-2.5 text-left font-semibold text-[var(--text-tertiary)] whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sourceRankings
                .slice()
                .sort((a, b) => b.dataValueScore - a.dataValueScore)
                .map((src) => (
                  <tr
                    key={src.id}
                    className="border-b border-[var(--border-primary)] last:border-0 hover:bg-[var(--bg-secondary)] transition-colors"
                  >
                    <td className="px-3 py-2.5 font-medium text-[var(--text-primary)] whitespace-nowrap">{src.name}</td>
                    <td className="px-3 py-2.5">
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-medium capitalize"
                        style={{ backgroundColor: sourceTypeBgs[src.type], color: sourceTypeColors[src.type] }}
                      >
                        {src.type}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-[var(--text-secondary)]">{src.coverage}</td>
                    <td className="px-3 py-2.5 text-[var(--text-secondary)]">{src.freshness}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-10 h-1.5 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${src.qualityScore}%`,
                              backgroundColor: src.qualityScore >= 80 ? "#16a34a" : src.qualityScore >= 60 ? "#f59e0b" : "#ef4444",
                            }}
                          />
                        </div>
                        <span className="text-[var(--text-primary)] font-medium">{src.qualityScore}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 font-medium" style={{ color: src.predictiveLift.startsWith("+") ? "var(--fraud-cleared)" : "var(--text-tertiary)" }}>
                      {src.predictiveLift}
                    </td>
                    <td className="px-3 py-2.5 text-[var(--text-secondary)]">{src.financialUtility}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-8 h-1.5 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${src.redundancyScore}%`,
                              backgroundColor: src.redundancyScore > 50 ? "#ef4444" : "#f59e0b",
                            }}
                          />
                        </div>
                        <span className="text-[var(--text-secondary)]">{src.redundancyScore}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-8 h-1.5 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
                          <div className="h-full rounded-full bg-[#6366f1]" style={{ width: `${src.uniquenessScore}%` }} />
                        </div>
                        <span className="text-[var(--text-secondary)]">{src.uniquenessScore}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      {src.dataValueScore > 0 ? (
                        <div className="flex items-center gap-1.5">
                          <div className="w-10 h-2 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${src.dataValueScore}%`,
                                backgroundColor: src.dataValueScore >= 75 ? "#16a34a" : src.dataValueScore >= 55 ? "#f59e0b" : "#ef4444",
                              }}
                            />
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

const signalTypeColors: Record<string, string> = {
  government:  "#6366f1",
  company:     "#0ea5e9",
  graph:       "#8b5cf6",
  behavioural: "#f59e0b",
};

function CaseExplorerTab() {
  const c = caseExample;
  const riskColor = c.riskBand === "Critical" ? "var(--fraud-critical)" : c.riskBand === "High" ? "#f59e0b" : "#16a34a";
  const riskBg    = c.riskBand === "Critical" ? "var(--fraud-critical-bg)" : c.riskBand === "High" ? "var(--fraud-warning-bg)" : "var(--fraud-cleared-bg)";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <p className="text-sm text-[var(--text-tertiary)]">
          Source contribution for a single fraud case — shows which data source powered each signal.
        </p>
        <DemoBadge />
      </div>

      {/* Case header */}
      <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-primary)] shadow-[var(--card-shadow)] p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wide mb-0.5">Entity</div>
            <div className="text-lg font-bold text-[var(--text-primary)]">{c.entityName}</div>
            <div className="text-xs text-[var(--text-tertiary)] mt-0.5">Case ID: {c.id} · {c.reviewStatus}</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wide mb-1">Fraud Probability</div>
              <div className="text-3xl font-black" style={{ color: riskColor }}>
                {(c.fraudProbability * 100).toFixed(0)}%
              </div>
            </div>
            <div className="text-center">
              <div className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wide mb-1">Risk Band</div>
              <span
                className="inline-block px-3 py-1 rounded-xl text-sm font-bold"
                style={{ backgroundColor: riskBg, color: riskColor }}
              >
                {c.riskBand}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Signals */}
      <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-primary)] shadow-[var(--card-shadow)] p-5">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Top Fraud Signals & Source Attribution</h3>
        <div className="space-y-3">
          {c.signals.map((sig, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)]">
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold text-white"
                style={{ backgroundColor: signalTypeColors[sig.sourceType] }}
              >
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[var(--text-primary)] font-medium leading-snug">{sig.signal}</p>
                <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                    style={{
                      backgroundColor: signalTypeColors[sig.sourceType] + "18",
                      color: signalTypeColors[sig.sourceType],
                    }}
                  >
                    {sig.source}
                  </span>
                  <span className="text-[10px] text-[var(--text-tertiary)]">
                    {signalTypeLabels[sig.sourceType]}
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[10px] text-[var(--text-tertiary)] mb-0.5">Confidence</div>
                <div className="font-bold text-sm" style={{ color: signalTypeColors[sig.sourceType] }}>
                  {(sig.confidence * 100).toFixed(0)}%
                </div>
                <div className="text-[10px] text-[var(--text-tertiary)] mt-0.5">
                  Weight {(sig.featureWeight * 100).toFixed(0)} pp
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
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
  success: { dot: "#16a34a", text: "var(--fraud-cleared)" },
  warning: { dot: "#f59e0b", text: "var(--fraud-warning)" },
  info:    { dot: "#6366f1", text: "#6366f1" },
};

function TimelineTab() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <p className="text-sm text-[var(--text-tertiary)]">
          Orchestration activity log — today's pipeline run.
        </p>
        <DemoBadge />
      </div>
      <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-primary)] shadow-[var(--card-shadow)] p-5">
        <div className="space-y-0">
          {timelineEvents.map((ev, i) => {
            const style = timelineTypeStyle[ev.type];
            return (
              <div key={i} className="flex gap-3">
                {/* Timeline track */}
                <div className="flex flex-col items-center">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0 mt-1.5"
                    style={{ backgroundColor: style.dot }}
                  />
                  {i < timelineEvents.length - 1 && (
                    <div className="w-px flex-1 bg-[var(--border-primary)] my-0.5" style={{ minHeight: 16 }} />
                  )}
                </div>
                {/* Content */}
                <div className="pb-3 flex-1">
                  <div className="flex items-start gap-2 flex-wrap">
                    <span className="font-mono text-[10px] text-[var(--text-tertiary)] pt-0.5 shrink-0">{ev.time}</span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-[var(--bg-tertiary)] text-[var(--text-secondary)] shrink-0">
                      {ev.agent}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5" style={{ color: ev.type !== "info" ? style.text : undefined }}>
                    {ev.event}
                  </p>
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

  const runningCount  = agents.filter((a) => a.status === "running").length;
  const warningCount  = agents.filter((a) => a.status === "warning").length;
  const completedCount = agents.filter((a) => a.status === "completed").length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Agentic Orchestration</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">
            Multi-agent fraud intelligence & data valuation pipeline
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-[var(--fraud-cleared-bg)] text-[var(--fraud-cleared)] border border-[var(--fraud-cleared)]/20">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
            {completedCount} Completed
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-[#eef2ff] text-[#6366f1] border border-[#6366f1]/20">
            <Loader2 className="w-3.5 h-3.5 shrink-0 animate-spin" strokeWidth={2} />
            {runningCount} Running
          </span>
          {warningCount > 0 && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-[var(--fraud-warning-bg)] text-[var(--fraud-warning)] border border-[var(--fraud-warning)]/20">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
              {warningCount} Warning
            </span>
          )}
        </div>
      </div>

      {/* Data flow summary */}
      <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4">
        <div className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-tertiary)] mb-3">
          Data Value Pipeline
        </div>
        <DataFlowDiagram />
      </div>

      {/* Status strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Records in pipeline", value: "2.85M", sub: "Across 7 providers", color: "var(--fraud-cleared)" },
          { label: "Entities resolved",   value: "18,420", sub: "71.4% cross-source match rate", color: "#6366f1" },
          { label: "Active model version", value: "v3.4.0", sub: "v3.4.1 retraining in progress", color: "var(--fraud-warning)" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] shadow-[var(--card-shadow)] p-3 flex items-center gap-3">
            <div className="w-2 h-8 rounded-full shrink-0" style={{ backgroundColor: s.color + "60" }} />
            <div>
              <div className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wide">{s.label}</div>
              <div className="font-bold text-[var(--text-primary)] text-base">{s.value}</div>
              <div className="text-[10px] text-[var(--text-tertiary)]">{s.sub}</div>
            </div>
            <DemoBadge />
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="-mx-6 px-6 border-b border-[var(--border-primary)] flex items-center gap-1">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${
              activeTab === tab
                ? "border-[var(--brand-primary)] text-[var(--text-primary)]"
                : "border-transparent text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="pt-1">
        {activeTab === "Pipeline"         && <PipelineTab />}
        {activeTab === "Data Valuation"   && <DataValuationTab />}
        {activeTab === "Source Rankings"  && <SourceRankingsTab />}
        {activeTab === "Case Explorer"    && <CaseExplorerTab />}
        {activeTab === "Timeline"         && <TimelineTab />}
      </div>
    </div>
  );
}
