"use client";

import { useState } from "react";
import { Download, ArrowUpRight, Check, X } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import DataTable from "@/components/DataTable";
import TabNav from "@/components/TabNav";
import { mockCases } from "@/lib/mock-data";

// ── Static data ───────────────────────────────────────────────────────────────

const heroStats = [
  { label: "Total Alerts",     value: "3,847", sub: "+247 new today" },
  { label: "Blocked Value",    value: "$1.2M",  sub: "Fraud prevented" },
  { label: "Accounts Flagged", value: "421",    sub: "Pending review" },
  { label: "Cases Resolved",   value: "1,893",  sub: "Last 24 hours" },
];

type Severity = "critical" | "warning" | "neutral" | "success";

const timelineEvents: {
  id: number;
  label: string;
  detail: string;
  time: string;
  severity: Severity;
}[] = [
  { id: 1, label: "Suspicious Login Detected",    detail: "Finance-DB-01 — Tor exit node",     time: "09:14", severity: "critical" },
  { id: 2, label: "Malware Signature Triggered",  detail: "MITRE T1078 — Valid accounts",      time: "09:18", severity: "warning"  },
  { id: 3, label: "Lateral Movement Detected",    detail: "3 hops across internal network",    time: "09:31", severity: "neutral"  },
  { id: 4, label: "Alert Escalated to Critical",  detail: "Auto-escalation — Confidence 92%",  time: "09:45", severity: "critical" },
];

const SEVERITY_STYLE: Record<Severity, { bg: string; border: string; dot: string; text: string }> = {
  critical: { bg: "var(--fraud-critical-bg)", border: "var(--fraud-critical)", dot: "var(--fraud-critical)", text: "var(--fraud-critical)" },
  warning:  { bg: "var(--fraud-warning-bg)",  border: "var(--fraud-warning)",  dot: "var(--fraud-warning)",  text: "var(--fraud-warning)"  },
  neutral:  { bg: "var(--bg-tertiary)",        border: "var(--border-secondary)", dot: "var(--text-tertiary)", text: "var(--text-secondary)" },
  success:  { bg: "var(--fraud-cleared-bg)",  border: "var(--fraud-cleared)",  dot: "var(--fraud-cleared)",  text: "var(--fraud-cleared)"  },
};

const suggestedActions = [
  { id: 1, action: "Quarantine Finance-DB-01 Server",    priority: "High",   time: "1 min ago" },
  { id: 2, action: "Block IP 203.145.12.89 on Firewall", priority: "High",   time: "2 min ago" },
  { id: 3, action: "Force Credential Reset",             priority: "Medium", time: "3 min ago" },
];

// Fixed dot-plot data — login anomalies Aug–Sep spike
const loginDots: { x: number; y: number; anomaly?: boolean }[] = [
  { x: 0,   y: 14 }, { x: 0.2, y: 22 }, { x: 0.5, y: 9  }, { x: 0.7, y: 18 },
  { x: 1,   y: 25 }, { x: 1.2, y: 17 }, { x: 1.5, y: 31 }, { x: 1.7, y: 20 },
  { x: 2,   y: 48, anomaly: true }, { x: 2.2, y: 55, anomaly: true },
  { x: 2.4, y: 61, anomaly: true }, { x: 2.6, y: 52, anomaly: true },
  { x: 2.1, y: 38 }, { x: 2.8, y: 45 },
  { x: 3,   y: 44, anomaly: true }, { x: 3.2, y: 38, anomaly: true },
  { x: 3.5, y: 29 }, { x: 3.7, y: 33 },
  { x: 4,   y: 21 }, { x: 4.2, y: 16 }, { x: 4.5, y: 24 }, { x: 4.7, y: 19 },
  { x: 5,   y: 14 }, { x: 5.2, y: 10 }, { x: 5.5, y: 17 },
];

const threatData = [
  { m: "Jan", v: 18 }, { m: "Feb", v: 24 }, { m: "Mar", v: 32 },
  { m: "Apr", v: 45 }, { m: "May", v: 62 }, { m: "Jun", v: 78 },
  { m: "Jul", v: 91 }, { m: "Aug", v: 88 }, { m: "Sep", v: 70 },
  { m: "Oct", v: 54 }, { m: "Nov", v: 40 }, { m: "Dec", v: 28 },
];

const viewTabs = ["Overview", "Case Table"] as const;

// ── Component ─────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [view, setView] = useState<"Overview" | "Case Table">("Overview");
  const [search, setSearch] = useState("");
  const [caseTab, setCaseTab] = useState("All Cases");
  const [actionStates, setActionStates] = useState<Record<number, "approved" | "rejected" | null>>(
    { 1: null, 2: null, 3: null }
  );

  function handleAction(id: number, state: "approved" | "rejected") {
    setActionStates((prev) => ({ ...prev, [id]: prev[id] === state ? null : state }));
  }

  const caseTabs = ["All Cases", "APP Fraud", "Unauthorised", "First-Party", "Collusion"];
  const tabTypeMap: Record<string, string | null> = {
    "All Cases": null, "APP Fraud": "APP Fraud", "Unauthorised": "Unauthorised",
    "First-Party": "First-Party", "Collusion": "Collusion",
  };
  const filteredCases = mockCases.filter((c) => {
    const matchesTab = !tabTypeMap[caseTab] || c.type === tabTypeMap[caseTab];
    const matchesSearch = !search || c.id.toLowerCase().includes(search.toLowerCase()) || c.type.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-5">
      {/* ── Page header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Fraud Overview</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-0.5">PayPal transaction monitoring — last 24 hours</p>
        </div>
        <div className="flex items-center gap-3">
          <TabNav tabs={viewTabs as unknown as string[]} activeTab={view} onTabChange={(t) => setView(t as typeof view)} />
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-colors"
            style={{ backgroundColor: "var(--brand-primary)", color: "#000" }}>
            <Download className="w-4 h-4 shrink-0" strokeWidth={2} />
            Download
          </button>
        </div>
      </div>

      {view === "Case Table" ? (
        /* ── Case table view ── */
        <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-primary)]">
          <div className="px-6 py-4 border-b border-[var(--border-primary)] flex items-center justify-between">
            <TabNav tabs={caseTabs} activeTab={caseTab} onTabChange={setCaseTab} />
            <input
              placeholder="Search cases..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-1.5 text-sm rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] w-52 transition-colors"
            />
          </div>
          <DataTable cases={filteredCases} />
        </div>
      ) : (
        <>
          {/* ── Hero lime cards ── */}
          <div className="grid grid-cols-4 gap-4">
            {heroStats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl p-6 flex flex-col gap-2 animate-card-in relative overflow-hidden"
                style={{ backgroundColor: "var(--brand-primary)" }}
              >
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-black/50">{s.label}</span>
                  <ArrowUpRight className="w-4 h-4 text-black/30 shrink-0" strokeWidth={1.5} />
                </div>
                <div className="text-[2rem] font-bold text-black tracking-tight leading-none">{s.value}</div>
                <div className="text-xs text-black/40 font-medium">{s.sub}</div>
              </div>
            ))}
          </div>

          {/* ── Incident Timeline ── */}
          <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-primary)] p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-semibold text-[var(--text-primary)]">Incident Timeline</h2>
              <span className="text-xs text-[var(--text-tertiary)] font-mono">INC-2048 · Active</span>
            </div>

            <div className="relative">
              {/* Dashed connector line — sits at mid-point between boxes and dots */}
              <div
                className="absolute left-[12.5%] right-[12.5%] pointer-events-none"
                style={{ top: "calc(100% - 36px)", borderTop: "1.5px dashed var(--border-secondary)" }}
              />

              <div className="grid grid-cols-4 gap-4">
                {timelineEvents.map((ev) => {
                  const s = SEVERITY_STYLE[ev.severity];
                  return (
                    <div key={ev.id} className="flex flex-col items-center">
                      {/* Event box */}
                      <div
                        className="w-full rounded-2xl p-3 mb-4 border"
                        style={{ backgroundColor: s.bg, borderColor: s.border }}
                      >
                        <p className="text-xs font-semibold leading-snug" style={{ color: s.text }}>
                          {ev.label}
                        </p>
                        <p className="text-[10px] mt-1 text-[var(--text-tertiary)] leading-snug">
                          {ev.detail}
                        </p>
                      </div>

                      {/* Node dot on the line */}
                      <div
                        className="w-3 h-3 rounded-full relative z-10 border-[3px] border-[var(--bg-primary)]"
                        style={{ backgroundColor: s.dot }}
                      />

                      {/* Time label */}
                      <p className="text-[10px] font-mono text-[var(--text-tertiary)] mt-2">{ev.time}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Bottom row ── */}
          <div className="grid grid-cols-3 gap-4">

            {/* AI Suggested Actions */}
            <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-primary)] p-6 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-[var(--text-primary)]">AI Suggested Actions</h2>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: "var(--brand-primary)", color: "#000" }}
                >
                  {Object.values(actionStates).filter((v) => v === null).length} PENDING
                </span>
              </div>

              <div className="flex flex-col gap-3 flex-1">
                {suggestedActions.map((a) => {
                  const state = actionStates[a.id];
                  return (
                    <div
                      key={a.id}
                      className="p-3 rounded-2xl border transition-all duration-200"
                      style={{
                        backgroundColor: state === "approved" ? "var(--fraud-cleared-bg)" : state === "rejected" ? "var(--fraud-critical-bg)" : "var(--bg-tertiary)",
                        borderColor: state === "approved" ? "var(--fraud-cleared)" : state === "rejected" ? "var(--fraud-critical)" : "var(--border-primary)",
                      }}
                    >
                      <div className="flex items-start gap-2 mb-2.5">
                        <p className="text-xs font-medium text-[var(--text-primary)] leading-snug flex-1">{a.action}</p>
                        <span
                          className="text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0"
                          style={{
                            backgroundColor: a.priority === "High" ? "var(--fraud-critical-bg)" : "var(--fraud-warning-bg)",
                            color: a.priority === "High" ? "var(--fraud-critical)" : "var(--fraud-warning)",
                          }}
                        >
                          {a.priority}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleAction(a.id, "approved")}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors"
                          style={{ backgroundColor: state === "approved" ? "var(--fraud-cleared)" : "var(--brand-primary)", color: "#000" }}
                        >
                          <Check className="w-3 h-3 shrink-0" strokeWidth={2.5} />
                          Approve
                        </button>
                        <button
                          onClick={() => handleAction(a.id, "rejected")}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors border"
                          style={{
                            backgroundColor: "transparent",
                            borderColor: state === "rejected" ? "var(--fraud-critical)" : "var(--border-secondary)",
                            color: state === "rejected" ? "var(--fraud-critical)" : "var(--text-tertiary)",
                          }}
                        >
                          <X className="w-3 h-3 shrink-0" strokeWidth={2.5} />
                          Reject
                        </button>
                        <span className="text-[10px] text-[var(--text-tertiary)] ml-auto">{a.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Login Attempts — dot plot */}
            <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-primary)] p-6 flex flex-col">
              <div className="flex items-start justify-between mb-1">
                <div>
                  <h2 className="text-sm font-semibold text-[var(--text-primary)]">Login Attempts</h2>
                  <p className="text-xs text-[var(--text-tertiary)] mt-0.5">Failed logins — anomalies highlighted</p>
                </div>
                <span className="text-2xl font-bold" style={{ color: "var(--brand-primary)" }}>76</span>
              </div>

              <div className="flex-1 mt-4">
                <svg viewBox="0 0 260 130" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                  {/* Subtle grid */}
                  {[0, 32, 65, 98].map((y) => (
                    <line key={y} x1="0" y1={y} x2="260" y2={y}
                      stroke="var(--border-primary)" strokeWidth="0.5" />
                  ))}

                  {/* Month labels */}
                  {["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"].map((m, i) => (
                    <text key={m} x={10 + i * 48} y="126" fontSize="8"
                      fill="var(--text-tertiary)" textAnchor="middle">{m}</text>
                  ))}

                  {/* Dots */}
                  {loginDots.map((d, i) => (
                    <circle
                      key={i}
                      cx={10 + d.x * 48}
                      cy={110 - (d.y / 70) * 100}
                      r={d.anomaly ? 4.5 : 2.5}
                      fill={d.anomaly ? "var(--brand-primary)" : "var(--text-tertiary)"}
                      opacity={d.anomaly ? 0.95 : 0.45}
                    />
                  ))}

                  {/* Anomaly annotation */}
                  <text x="88" y="10" fontSize="7" fill="var(--brand-primary)" fontWeight="700" textAnchor="middle">
                    ▲ Spike Aug–Sep
                  </text>
                </svg>
              </div>
            </div>

            {/* Threat Detection — area chart */}
            <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-primary)] p-6 flex flex-col">
              <div className="flex items-start justify-between mb-1">
                <div>
                  <h2 className="text-sm font-semibold text-[var(--text-primary)]">Threat Detection</h2>
                  <p className="text-xs text-[var(--text-tertiary)] mt-0.5">Detection rate — last 12 months</p>
                </div>
                <span className="text-sm font-bold" style={{ color: "var(--brand-primary)" }}>+40%</span>
              </div>

              <div className="flex-1 mt-3" style={{ minHeight: 110 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={threatData} margin={{ top: 4, right: 0, left: -28, bottom: 0 }}>
                    <defs>
                      <linearGradient id="tGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#8BBF00" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#8BBF00" stopOpacity={0}    />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="m" tick={{ fontSize: 8, fill: "var(--text-tertiary)" }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--bg-elevated)",
                        border: "1px solid var(--border-primary)",
                        borderRadius: 10,
                        fontSize: 11,
                        color: "var(--text-primary)",
                      }}
                      itemStyle={{ color: "var(--brand-primary)" }}
                    />
                    <Area type="monotone" dataKey="v" stroke="#8BBF00" strokeWidth={2} fill="url(#tGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Percentage bubbles */}
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <span
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                  style={{ backgroundColor: "var(--brand-primary)", color: "#000" }}
                >
                  +45% Jun
                </span>
                <span
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                  style={{ backgroundColor: "var(--brand-primary)", color: "#000" }}
                >
                  +35% Aug
                </span>
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
}
