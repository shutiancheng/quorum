"use client";

import { useState } from "react";
import { ShieldAlert, CreditCard, Users, CheckCircle, TrendingDown, TrendingUp, ArrowRight } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";
import StatCard from "@/components/StatCard";
import TabNav from "@/components/TabNav";
import DataTable from "@/components/DataTable";
import type { FraudCase } from "@/lib/types";

// ── Antigravity Hero ──────────────────────────────────────────────────────────

const PARTICLES = [
  { x: "8%",  y: "75%", s: 3, c: "rgba(249,115,22,0.9)", dur: 4.2, delay: 0    },
  { x: "14%", y: "85%", s: 2, c: "rgba(249,115,22,0.5)", dur: 5.1, delay: 0.8  },
  { x: "22%", y: "70%", s: 4, c: "rgba(255,255,255,0.25)", dur: 3.8, delay: 1.5 },
  { x: "30%", y: "90%", s: 2, c: "rgba(249,115,22,0.6)", dur: 6.0, delay: 0.3  },
  { x: "42%", y: "80%", s: 3, c: "rgba(255,255,255,0.2)", dur: 4.5, delay: 2.1  },
  { x: "55%", y: "88%", s: 2, c: "rgba(249,115,22,0.4)", dur: 5.5, delay: 0.6  },
  { x: "65%", y: "72%", s: 4, c: "rgba(249,115,22,0.7)", dur: 3.5, delay: 1.2  },
  { x: "74%", y: "82%", s: 2, c: "rgba(255,255,255,0.2)", dur: 6.2, delay: 0.9  },
  { x: "82%", y: "68%", s: 3, c: "rgba(249,115,22,0.5)", dur: 4.8, delay: 1.8  },
  { x: "91%", y: "78%", s: 2, c: "rgba(255,255,255,0.3)", dur: 5.3, delay: 0.4  },
  { x: "18%", y: "55%", s: 2, c: "rgba(249,115,22,0.35)", dur: 7.0, delay: 2.5 },
  { x: "50%", y: "60%", s: 3, c: "rgba(249,115,22,0.3)", dur: 5.8, delay: 3.0  },
];

const RINGS = [
  { w: 130, h: 48,  border: "1.5px solid rgba(249,115,22,0.70)", anim: "ag-spin   7s linear infinite",         rot: "-15deg" },
  { w: 200, h: 72,  border: "1px   solid rgba(249,115,22,0.40)", anim: "ag-spin-r 11s linear infinite",        rot: "20deg"  },
  { w: 290, h: 100, border: "1px   solid rgba(249,115,22,0.22)", anim: "ag-spin   16s linear infinite 0.5s",   rot: "-5deg"  },
  { w: 390, h: 136, border: "1px   solid rgba(249,115,22,0.12)", anim: "ag-spin-r 24s linear infinite 1s",     rot: "35deg"  },
  { w: 500, h: 170, border: "1px   solid rgba(255,255,255,0.05)", anim: "ag-spin  34s linear infinite 2s",     rot: "-20deg" },
];

function HeroBanner() {
  return (
    <div
      className="relative overflow-hidden rounded-2xl"
      style={{
        background:
          "radial-gradient(ellipse at 38% 60%, rgba(249,115,22,0.13) 0%, #0A0503 40%, #020202 100%)",
        minHeight: 256,
      }}
    >
      {/* Floating particles */}
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: p.x, top: p.y,
            width: p.s, height: p.s,
            backgroundColor: p.c,
            animation: `ag-rise ${p.dur}s ease-out ${p.delay}s infinite`,
          }}
        />
      ))}

      {/* Orbital rings — centred on the $1.2M number */}
      <div className="absolute pointer-events-none" style={{ left: "33%", top: "54%" }}>
        {RINGS.map((r, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: r.w, height: r.h,
              left: "50%", top: "50%",
              border: r.border,
              borderRadius: "50%",
              animation: r.anim,
              transform: `translate(-50%,-50%) rotate(${r.rot})`,
            }}
          />
        ))}
        {/* Bright orbiting dot on innermost ring */}
        <div
          style={{
            position: "absolute",
            left: "50%", top: "50%",
            width: 6, height: 6,
            borderRadius: "50%",
            backgroundColor: "#F97316",
            boxShadow: "0 0 10px 3px rgba(249,115,22,0.8)",
            animation: "ag-orbit-dot 7s linear infinite",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center gap-16 px-10 py-8" style={{ minHeight: 256 }}>

        {/* Main stat */}
        <div className="ag-float" style={{ animationDelay: "0s" }}>
          <p
            className="text-[11px] font-bold uppercase tracking-[0.2em] mb-4"
            style={{ color: "rgba(249,115,22,0.65)" }}
          >
            PayPal · Fraud Overview · last 24 hours
          </p>
          <div
            className="text-[72px] font-black leading-none tracking-tight ag-glow-pulse"
            style={{ color: "#F97316", fontVariantNumeric: "tabular-nums" }}
          >
            $1.2M
          </div>
          <p className="text-sm mt-2 font-medium" style={{ color: "rgba(255,255,255,0.45)" }}>
            total value blocked today
          </p>
        </div>

        {/* Mini stat grid */}
        <div className="grid grid-cols-2 gap-3 ml-auto">
          {[
            { label: "Total Alerts",     value: "3,847", change: "+8.2%",  pos: true  },
            { label: "Blocked Value",    value: "$1.2M", change: "+23.1%", pos: true  },
            { label: "Accounts Flagged", value: "421",   change: "-3.4%",  pos: false },
            { label: "Cases Resolved",   value: "1,893", change: "+15.7%", pos: true  },
          ].map((s, i) => (
            <div
              key={s.label}
              className="rounded-xl px-4 py-3"
              style={{
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.07)",
                animation: `ag-fade-in-up 0.5s ease-out ${i * 0.1 + 0.2}s both`,
                minWidth: 130,
              }}
            >
              <p className="text-[10px] font-semibold uppercase tracking-wider mb-1.5"
                 style={{ color: "rgba(255,255,255,0.35)" }}>
                {s.label}
              </p>
              <p className="text-2xl font-black text-white leading-none">{s.value}</p>
              <p
                className="text-[11px] font-semibold mt-1"
                style={{ color: s.pos ? "#4ade80" : "#f87171" }}
              >
                {s.change} vs yesterday
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

const tabs = ["All Cases", "APP Fraud", "Unauthorised", "First-Party", "Collusion"];
const tabTypeMap: Record<string, string | null> = {
  "All Cases": null, "APP Fraud": "APP Fraud", Unauthorised: "Unauthorised",
  "First-Party": "First-Party", Collusion: "Collusion",
};

// ── Value Intelligence Section ────────────────────────────────────────────────

const CUMULATIVE_SAVINGS = [
  { m: "Jan", s: 192 }, { m: "Feb", s: 383 }, { m: "Mar", s: 575 },
  { m: "Apr", s: 766 }, { m: "May", s: 958 }, { m: "Jun", s: 1150 },
  { m: "Jul", s: 1341 }, { m: "Aug", s: 1533 }, { m: "Sep", s: 1725 },
  { m: "Oct", s: 1916 }, { m: "Nov", s: 2108 }, { m: "Dec", s: 2300 },
];

const NETWORK_EFFECT = [
  { n: "3",  saving: 1100 },
  { n: "5",  saving: 1520 },
  { n: "8",  saving: 1920 },
  { n: "12", saving: 2300 },
  { n: "15", saving: 2680 },
  { n: "20", saving: 3150 },
  { n: "25", saving: 3540 },
];

const BEFORE = [
  { label: "Fraud Detection Rate",   value: "68%",    icon: TrendingDown },
  { label: "False Positive Rate",    value: "2.3%",   icon: TrendingUp },
  { label: "Avg Investigation Time", value: "4.2 hr", icon: TrendingUp },
  { label: "Annual Fraud Loss",      value: "$2.8M",  icon: TrendingUp },
];
const AFTER = [
  { label: "Fraud Detection Rate",   value: "87%",    delta: "+19pp",  good: true },
  { label: "False Positive Rate",    value: "0.8%",   delta: "−1.5pp", good: true },
  { label: "Avg Investigation Time", value: "1.1 hr", delta: "−74%",   good: true },
  { label: "Annual Fraud Loss",      value: "$1.2M",  delta: "−57%",   good: true },
];
const SAVINGS_BREAKDOWN = [
  { label: "Fraud losses prevented",      value: "$1.60M", pct: 70 },
  { label: "False positive cost savings", value: "$420K",  pct: 18 },
  { label: "Investigation time saved",    value: "$280K",  pct: 12 },
];

const TOOLTIP_STYLE = {
  backgroundColor: "#fff", border: "1px solid rgba(0,0,0,0.08)",
  borderRadius: 8, fontSize: 12,
};
const TICK = { fontSize: 11, fill: "#777" };

function ValueSection() {
  return (
    <div className="space-y-4">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-[var(--text-primary)]">
            Intelligence Sharing Value
          </h2>
          <p className="text-[11px] text-[var(--text-tertiary)] mt-0.5">
            Estimated annual savings from joining the Quorum fraud intelligence network — PayPal profile
          </p>
        </div>
        <div className="flex items-center gap-2 bg-[#F97316] text-white rounded-xl px-4 py-2"
             style={{ boxShadow: "0 4px 16px rgba(249,115,22,0.35)" }}>
          <span className="text-[11px] font-semibold uppercase tracking-wide opacity-80">Total annual savings</span>
          <span className="text-xl font-black">$2.3M</span>
        </div>
      </div>

      {/* Before / After comparison */}
      <div className="rounded-xl overflow-hidden" style={{ boxShadow: "var(--card-shadow)" }}>
        <div className="grid grid-cols-[1fr_auto_1fr]">
          {/* Before */}
          <div className="bg-[var(--bg-secondary)] p-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-4">
              Without Quorum
            </p>
            <div className="space-y-3">
              {BEFORE.map((b) => (
                <div key={b.label} className="flex items-center justify-between">
                  <span className="text-xs text-[var(--text-secondary)]">{b.label}</span>
                  <span className="text-sm font-bold text-[var(--text-tertiary)]">{b.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Arrow divider */}
          <div className="bg-[var(--bg-tertiary)] flex flex-col items-center justify-center px-4 gap-2">
            <ArrowRight className="w-5 h-5 text-[#F97316]" strokeWidth={2.5} />
            <span className="text-[9px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider rotate-90 whitespace-nowrap">Quorum</span>
          </div>

          {/* After */}
          <div className="bg-[var(--bg-primary)] p-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#F97316] mb-4">
              With Quorum
            </p>
            <div className="space-y-3">
              {AFTER.map((a) => (
                <div key={a.label} className="flex items-center justify-between">
                  <span className="text-xs text-[var(--text-secondary)]">{a.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded text-white"
                          style={{ backgroundColor: "#14532D" }}>
                      {a.delta}
                    </span>
                    <span className="text-sm font-bold text-[var(--text-primary)]">{a.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Savings breakdown bar */}
        <div className="border-t border-[var(--border-primary)] bg-[var(--bg-primary)] px-5 py-4">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--text-tertiary)] mb-3">
            Savings breakdown
          </p>
          <div className="space-y-2">
            {SAVINGS_BREAKDOWN.map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <span className="text-xs text-[var(--text-secondary)] w-48 shrink-0">{s.label}</span>
                <div className="flex-1 h-2 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
                  <div className="h-full rounded-full bg-[#F97316]" style={{ width: `${s.pct}%` }} />
                </div>
                <span className="text-xs font-bold text-[var(--text-primary)] w-14 text-right">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Cumulative savings */}
        <div className="bg-[var(--bg-primary)] rounded-xl p-5" style={{ boxShadow: "var(--card-shadow)" }}>
          <div className="mb-3">
            <p className="text-sm font-semibold text-[var(--text-primary)]">Cumulative Savings Over 12 Months</p>
            <p className="text-[11px] text-[var(--text-tertiary)] mt-0.5">Realised value from network participation — $K</p>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={CUMULATIVE_SAVINGS} margin={{ top: 4, right: 4, left: -8, bottom: 0 }}>
              <defs>
                <linearGradient id="savGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#F97316" stopOpacity={0.22} />
                  <stop offset="95%" stopColor="#F97316" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
              <XAxis dataKey="m" tick={TICK} tickLine={false} axisLine={false} />
              <YAxis tick={TICK} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}K`} />
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: any) => [`$${v}K`, "Savings to date"]} />
              <Area type="monotone" dataKey="s" stroke="#F97316" strokeWidth={2.5}
                    fill="url(#savGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Network effect */}
        <div className="bg-[var(--bg-primary)] rounded-xl p-5" style={{ boxShadow: "var(--card-shadow)" }}>
          <div className="mb-3">
            <p className="text-sm font-semibold text-[var(--text-primary)]">Network Effect — More Members, More Savings</p>
            <p className="text-[11px] text-[var(--text-tertiary)] mt-0.5">Avg annual savings per institution by network size — $K</p>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={NETWORK_EFFECT} margin={{ top: 4, right: 4, left: -8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
              <XAxis dataKey="n" tick={TICK} tickLine={false} axisLine={false} label={{ value: "institutions", position: "insideRight", offset: -4, style: { fontSize: 10, fill: "#aaa" } }} />
              <YAxis tick={TICK} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}K`} />
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: any) => [`$${v}K`, "Avg savings/institution"]} />
              <Bar dataKey="saving" radius={[5, 5, 0, 0]} barSize={28}>
                {NETWORK_EFFECT.map((_, i) => (
                  <Cell key={i}
                    fill={i === 3 ? "#F97316" : "rgba(249,115,22,0.35)"}
                    stroke={i === 3 ? "#EA6C08" : "none"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="text-[10px] text-[var(--text-tertiary)] mt-2 text-center">
            ● Current network size: <span className="font-semibold text-[#F97316]">12 institutions</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function DashboardClient({ cases }: { cases: FraudCase[] }) {
  const [activeTab, setActiveTab] = useState("All Cases");
  const [search, setSearch] = useState("");

  const filteredCases = cases.filter((c) => {
    const matchesTab = !tabTypeMap[activeTab] || c.type === tabTypeMap[activeTab];
    const matchesSearch =
      !search ||
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.type.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-5">
      <HeroBanner />

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard icon={ShieldAlert} label="Total Alerts"    value="3,847" change="+8.2%"  />
        <StatCard icon={CreditCard}  label="Blocked Value"   value="$1.2M" change="+23.1%" />
        <StatCard icon={Users}       label="Accounts Flagged" value="421"  change="-3.4%"  />
        <StatCard icon={CheckCircle} label="Cases Resolved"  value="1,893" change="+15.7%" />
      </div>

      {/* Intelligence value */}
      <ValueSection />

      {/* Cases table */}
      <div className="bg-[var(--bg-primary)] rounded-2xl" style={{ boxShadow: "var(--card-shadow)" }}>
        <div className="px-5 py-4 border-b border-[var(--border-primary)] flex items-center justify-between">
          <TabNav tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
          <input
            placeholder="Search cases..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-1.5 text-sm rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] w-56 transition-colors"
            style={{ border: "1px solid var(--border-primary)" }}
          />
        </div>
        <div className="p-0">
          <DataTable cases={filteredCases} />
        </div>
      </div>
    </div>
  );
}
