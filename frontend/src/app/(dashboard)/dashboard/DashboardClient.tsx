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

const ROI_CURVE = [
  { m: "Month 1", roi: 40 }, { m: "2", roi: 95 }, { m: "3", roi: 160 },
  { m: "4", roi: 210 }, { m: "5", roi: 255 }, { m: "6", roi: 290 },
  { m: "7", roi: 305 }, { m: "8", roi: 318 }, { m: "9", roi: 330 },
  { m: "10", roi: 337 }, { m: "11", roi: 340 }, { m: "12", roi: 340 },
];

const NETWORK_CURVE = [
  { n: 3, s: 820 }, { n: 5, s: 1100 }, { n: 7, s: 1380 }, { n: 9, s: 1640 },
  { n: 11, s: 1920 }, { n: 12, s: 2300 }, { n: 14, s: 2620 },
  { n: 17, s: 2980 }, { n: 20, s: 3280 }, { n: 25, s: 3700 },
];

const METRICS = [
  { label: "Detection rate",  before: "68%",    after: "87%",    delta: "+19pp", good: true  },
  { label: "False positives", before: "2.3%",   after: "0.8%",   delta: "−75%",  good: true  },
  { label: "Investigation",   before: "4.2 hr", after: "1.1 hr", delta: "−74%",  good: true  },
];

const SAVINGS_CATS = [
  { label: "Fraud losses\nprevented",       value: "$1.60M", pct: 70, sub: "19pp detection uplift" },
  { label: "False positive\ncost reduction", value: "$420K",  pct: 18, sub: "1.5pp FP improvement" },
  { label: "Investigation\ntime saved",      value: "$280K",  pct: 12, sub: "3.1 hr per case" },
];

const TT = { backgroundColor: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 8, fontSize: 12 };
const TICK = { fontSize: 11, fill: "#777" };

function ValueSection() {
  return (
    <div className="space-y-4">

      {/* ── Dark ROI hero ── */}
      <div className="rounded-2xl overflow-hidden"
           style={{ background: "linear-gradient(135deg, #0D0603 0%, #1A0804 60%, #0D0603 100%)" }}>
        <div className="px-8 py-6 flex items-center justify-between gap-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2"
               style={{ color: "rgba(249,115,22,0.55)" }}>
              Quorum Intelligence Network · PayPal profile
            </p>
            <p className="text-white text-sm font-medium opacity-60">
              Estimated annual value of joining the shared fraud intelligence network
            </p>
          </div>
          <div className="flex items-center gap-10 shrink-0">
            {[
              { label: "Annual savings", value: "$2.3M", color: "#F97316" },
              { label: "First-year ROI", value: "340%",  color: "#4ade80" },
              { label: "Payback period", value: "<1 mo", color: "#ffffff" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-4xl font-black leading-none" style={{ color: s.color }}>{s.value}</div>
                <div className="text-[11px] mt-1.5 font-medium" style={{ color: "rgba(255,255,255,0.35)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Big loss comparison ── */}
      <div className="grid grid-cols-[1fr_auto_1fr] rounded-2xl overflow-hidden"
           style={{ boxShadow: "var(--card-shadow)" }}>

        {/* Without */}
        <div className="bg-[var(--bg-secondary)] p-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-tertiary)] mb-4">
            ✕ Without Quorum
          </p>
          <div className="text-[52px] font-black leading-none tracking-tight text-[var(--fraud-critical)] mb-1">
            $2.8M
          </div>
          <p className="text-xs text-[var(--text-tertiary)] mb-5">annual fraud losses</p>
          <div className="space-y-3">
            {METRICS.map((m) => (
              <div key={m.label} className="flex items-center justify-between">
                <span className="text-xs text-[var(--text-tertiary)]">{m.label}</span>
                <span className="text-sm font-bold text-[var(--text-tertiary)]">{m.before}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Centre badge */}
        <div className="flex flex-col items-center justify-center gap-3 px-6 bg-white">
          <div className="rounded-2xl text-white text-center px-5 py-3"
               style={{ backgroundColor: "#F97316", boxShadow: "0 8px 24px rgba(249,115,22,0.40)" }}>
            <div className="text-[10px] font-bold uppercase tracking-wider opacity-70 mb-0.5">saved</div>
            <div className="text-3xl font-black">$1.6M</div>
          </div>
          <ArrowRight className="w-6 h-6 text-[#F97316]" strokeWidth={2.5} />
        </div>

        {/* With Quorum */}
        <div className="bg-[var(--bg-primary)] p-6" style={{ borderLeft: "3px solid #F97316" }}>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#F97316] mb-4">
            ✓ With Quorum
          </p>
          <div className="text-[52px] font-black leading-none tracking-tight text-[var(--text-primary)] mb-1">
            $1.2M
          </div>
          <p className="text-xs text-[var(--text-tertiary)] mb-5">annual fraud losses</p>
          <div className="space-y-3">
            {METRICS.map((m) => (
              <div key={m.label} className="flex items-center justify-between">
                <span className="text-xs text-[var(--text-secondary)]">{m.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded text-white"
                        style={{ backgroundColor: "#14532D" }}>{m.delta}</span>
                  <span className="text-sm font-bold text-[var(--text-primary)]">{m.after}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Savings category cards ── */}
      <div className="grid grid-cols-3 gap-4">
        {SAVINGS_CATS.map((s) => (
          <div key={s.label} className="rounded-xl p-5"
               style={{ background: "rgba(249,115,22,0.05)", border: "1.5px solid rgba(249,115,22,0.18)", boxShadow: "var(--card-shadow)" }}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#F97316] mb-3 whitespace-pre-line">
              {s.label}
            </p>
            <div className="text-3xl font-black text-[var(--text-primary)] mb-1">{s.value}</div>
            <p className="text-[11px] text-[var(--text-tertiary)] mb-3">{s.sub}</p>
            <div className="h-2 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
              <div className="h-full rounded-full bg-[#F97316]" style={{ width: `${s.pct}%` }} />
            </div>
            <p className="text-[10px] text-[var(--text-tertiary)] mt-1.5 text-right font-semibold">{s.pct}% of total</p>
          </div>
        ))}
      </div>

      {/* ── Charts ── */}
      <div className="grid grid-cols-2 gap-4">

        {/* ROI curve */}
        <div className="bg-[var(--bg-primary)] rounded-xl p-5" style={{ boxShadow: "var(--card-shadow)" }}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">Return on Investment</p>
              <p className="text-[11px] text-[var(--text-tertiary)] mt-0.5">ROI % over first 12 months — breaks even in week 3</p>
            </div>
            <span className="text-lg font-black text-[#4ade80]">340%</span>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={ROI_CURVE} margin={{ top: 4, right: 4, left: -8, bottom: 0 }}>
              <defs>
                <linearGradient id="roiGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#F97316" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#F97316" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
              <XAxis dataKey="m" tick={TICK} tickLine={false} axisLine={false} />
              <YAxis tick={TICK} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
              <Tooltip contentStyle={TT} formatter={(v: any) => [`${v}%`, "ROI"]} />
              <Area type="monotone" dataKey="roi" stroke="#F97316" strokeWidth={2.5}
                    fill="url(#roiGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Network effect curve */}
        <div className="bg-[var(--bg-primary)] rounded-xl p-5" style={{ boxShadow: "var(--card-shadow)" }}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">Network Effect</p>
              <p className="text-[11px] text-[var(--text-tertiary)] mt-0.5">Avg savings per institution grows as network expands — $K</p>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-bold text-[#F97316]">You are here</span>
              <div className="text-[10px] text-[var(--text-tertiary)]">12 institutions</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={NETWORK_CURVE} margin={{ top: 4, right: 4, left: -8, bottom: 0 }}>
              <defs>
                <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#F97316" stopOpacity={0.22} />
                  <stop offset="95%" stopColor="#F97316" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
              <XAxis dataKey="n" tick={TICK} tickLine={false} axisLine={false}
                     label={{ value: "institutions in network", position: "insideBottomRight", offset: -5, style: { fontSize: 10, fill: "#aaa" } }} />
              <YAxis tick={TICK} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}K`} />
              <Tooltip contentStyle={TT} formatter={(v: any) => [`$${v}K`, "Avg savings/institution"]}
                       labelFormatter={(l) => `${l} institutions`} />
              <Area type="monotone" dataKey="s" stroke="#F97316" strokeWidth={2.5}
                    fill="url(#netGrad)" dot={false} />
              {/* "You are here" marker */}
              <Area type="monotone" dataKey="s" stroke="none" fill="none"
                    dot={(props: any) => {
                      if (props.payload.n !== 12) return <g key={props.key} />;
                      return (
                        <g key={props.key}>
                          <circle cx={props.cx} cy={props.cy} r={7} fill="#F97316" />
                          <circle cx={props.cx} cy={props.cy} r={12} fill="none"
                                  stroke="#F97316" strokeWidth={1.5} strokeOpacity={0.4} />
                        </g>
                      );
                    }} />
            </AreaChart>
          </ResponsiveContainer>
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
