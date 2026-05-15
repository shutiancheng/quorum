"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import {
  COUNTRY_FRAUD,
  TOTAL_ANNUAL_LOSS_M,
  type CountryFraud,
  type SimEvent,
} from "./WorldMapView";

/* ═══ Helpers ═══ */
function isoToFlag(iso2: string): string {
  return String.fromCodePoint(
    ...iso2.split("").map((c) => 0x1f1e6 + c.charCodeAt(0) - 65)
  );
}

function fmtUSD(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${Math.round(n).toLocaleString()}`;
}

function fmtTime(d: Date): string {
  return d.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

const FRAUD_LABELS = ["APP", "ATO", "CNP", "1st Party", "BNPL"] as const;
type FraudLabel = (typeof FRAUD_LABELS)[number];

function pickFraudType(d: CountryFraud): FraudLabel {
  const r = Math.random() * 100;
  if (r < d.app) return "APP";
  if (r < d.app + d.ato) return "ATO";
  if (r < d.app + d.ato + d.unauth) return "CNP";
  if (r < d.app + d.ato + d.unauth + d.fp) return "1st Party";
  return "BNPL";
}

function fraudColor(t: FraudLabel): string {
  switch (t) {
    case "APP":       return "#ef4444";
    case "ATO":       return "#f97316";
    case "CNP":       return "#eab308";
    case "1st Party": return "#a855f7";
    case "BNPL":      return "#3b82f6";
  }
}

function lossBarColor(lossM: number): string {
  if (lossM >= 200) return "#dc2626";
  if (lossM >= 100) return "#ef4444";
  if (lossM >= 50)  return "#f97316";
  if (lossM >= 20)  return "#f59e0b";
  if (lossM >= 10)  return "#eab308";
  if (lossM >= 5)   return "#84cc16";
  return "#4ade80";
}

/* ═══ Pre-sorted ranking ═══ */
const RANKED_COUNTRIES = Object.entries(COUNTRY_FRAUD)
  .map(([id, data]) => ({ id, ...data }))
  .sort((a, b) => b.lossM - a.lossM);

const MAX_LOSS = RANKED_COUNTRIES[0]?.lossM ?? 1;

/* Weighted picker for sim */
const WEIGHTED_PICKER: string[] = (() => {
  const arr: string[] = [];
  Object.entries(COUNTRY_FRAUD).forEach(([id, d]) => {
    const w = Math.max(1, Math.ceil(Math.sqrt(d.lossM)));
    for (let i = 0; i < w; i++) arr.push(id);
  });
  return arr;
})();

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */
export default function ThreatActivityView({
  fullscreen = false,
}: {
  fullscreen?: boolean;
}) {
  /* ── Simulation state ── */
  const [simEvents, setSimEvents] = useState<SimEvent[]>([]);
  const [dailyTotals, setDailyTotals] = useState<Record<string, number>>({});
  const [totalToday, setTotalToday] = useState(0);
  const [eventsCount, setEventsCount] = useState(0);
  const [blockedCount, setBlockedCount] = useState(0);
  const eventIdRef = useRef(0);
  const targetTotalRef = useRef(0);
  const [displayTotal, setDisplayTotal] = useState(0);

  /* ── Simulation interval ── */
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;
    const startTimer = setTimeout(() => {
      intervalId = setInterval(() => {
        const n = Math.random() > 0.5 ? 2 : 1;
        const batch: SimEvent[] = [];
        let batchTotal = 0;
        let batchBlocked = 0;
        const totalsUpd: Record<string, number> = {};

        for (let i = 0; i < n; i++) {
          const cid =
            WEIGHTED_PICKER[Math.floor(Math.random() * WEIGHTED_PICKER.length)];
          const cd = COUNTRY_FRAUD[cid];
          const daily = (cd.lossM * 1_000_000) / 365;
          const amount = Math.round(daily * (0.0008 + Math.random() * 0.004));
          const status: SimEvent["status"] =
            Math.random() > 0.18
              ? "blocked"
              : Math.random() > 0.5
              ? "flagged"
              : "loss";
          if (status === "blocked") batchBlocked++;
          eventIdRef.current++;
          batch.push({
            id: eventIdRef.current,
            countryId: cid,
            countryName: cd.name,
            iso2: cd.iso2,
            type: pickFraudType(cd),
            amount,
            time: new Date(),
            status,
          });
          totalsUpd[cid] = (totalsUpd[cid] || 0) + amount;
          batchTotal += amount;
        }

        setSimEvents((prev) => [...batch, ...prev].slice(0, 80));
        setDailyTotals((prev) => {
          const next = { ...prev };
          for (const [k, v] of Object.entries(totalsUpd))
            next[k] = (next[k] || 0) + v;
          return next;
        });
        setTotalToday((prev) => prev + batchTotal);
        setEventsCount((prev) => prev + n);
        setBlockedCount((prev) => prev + batchBlocked);
        targetTotalRef.current += batchTotal;
      }, 2200);
    }, 400);

    return () => {
      clearTimeout(startTimer);
      clearInterval(intervalId);
    };
  }, []);

  /* Smooth counter */
  useEffect(() => {
    const tick = setInterval(() => {
      setDisplayTotal((prev) => {
        const target = targetTotalRef.current;
        const diff = target - prev;
        if (Math.abs(diff) < 50) return target;
        return Math.round(prev + diff * 0.12);
      });
    }, 60);
    return () => clearInterval(tick);
  }, []);

  const blockRate =
    eventsCount > 0 ? ((blockedCount / eventsCount) * 100).toFixed(1) : "0.0";

  const listHeight = fullscreen ? "max-h-[calc(100vh-200px)]" : "max-h-[400px]";

  return (
    <div className={`space-y-4 ${fullscreen ? "p-0" : ""}`}>
      {/* ── Summary stats ── */}
      <div className="grid grid-cols-4 gap-3">
        {[
          {
            label: "Annual Losses (2025)",
            value: `$${(TOTAL_ANNUAL_LOSS_M / 1000).toFixed(2)}B`,
            color: "var(--fraud-critical)",
          },
          {
            label: "Today\u2019s Losses",
            value: fmtUSD(displayTotal),
            color: "var(--fraud-warning)",
          },
          {
            label: "Events Detected",
            value: eventsCount.toLocaleString(),
            color: "var(--fraud-review)",
          },
          {
            label: "Block Rate",
            value: `${blockRate}%`,
            color: "var(--fraud-cleared)",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-primary)] p-3"
          >
            <p className="text-xs text-[var(--text-tertiary)]">{s.label}</p>
            <p className="text-lg font-semibold mt-0.5" style={{ color: s.color }}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* ── Main content: rankings + feed ── */}
      <div className="grid grid-cols-5 gap-4">
        {/* Rankings (3 cols) */}
        <div className="col-span-3 bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-primary)] shadow-[var(--card-shadow)] overflow-hidden">
          <div className="px-4 py-3 border-b border-[var(--border-primary)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-alert-pulse shrink-0" />
              <h3 className="font-semibold text-[var(--text-primary)] text-sm">
                Countries by Fraud Loss
              </h3>
            </div>
            <span className="text-[10px] text-[var(--text-tertiary)]">
              {RANKED_COUNTRIES.length} countries tracked
            </span>
          </div>

          {/* Header row */}
          <div className="grid grid-cols-[32px_1fr_80px_80px_72px_1fr] gap-2 px-4 py-2 text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider font-medium border-b border-[var(--border-primary)]">
            <span>#</span>
            <span>Country</span>
            <span className="text-right">Annual Loss</span>
            <span className="text-right">Today</span>
            <span className="text-right">Rate</span>
            <span />
          </div>

          <div className={`overflow-y-auto ${listHeight}`}>
            {RANKED_COUNTRIES.map((c, i) => {
              const todayLoss = dailyTotals[c.id] || 0;
              const barWidth = (c.lossM / MAX_LOSS) * 100;
              return (
                <div
                  key={c.id}
                  className="grid grid-cols-[32px_1fr_80px_80px_72px_1fr] gap-2 px-4 py-2 items-center text-xs border-b border-[var(--border-primary)]/50 hover:bg-[var(--sidebar-item-hover)] transition-colors"
                >
                  <span className="text-[var(--text-tertiary)] font-mono text-[10px]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm shrink-0">{isoToFlag(c.iso2)}</span>
                    <span className="text-[var(--text-primary)] font-medium truncate">
                      {c.name}
                    </span>
                  </div>
                  <span
                    className="text-right font-semibold"
                    style={{ color: lossBarColor(c.lossM) }}
                  >
                    ${c.lossM.toFixed(1)}M
                  </span>
                  <span className="text-right font-medium text-[var(--fraud-warning)]">
                    {todayLoss > 0 ? fmtUSD(todayLoss) : "\u2014"}
                  </span>
                  <span className="text-right text-[var(--text-secondary)]">
                    {(c.rate * 100).toFixed(3)}%
                  </span>
                  <div className="h-1.5 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${barWidth}%`,
                        backgroundColor: lossBarColor(c.lossM),
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live feed (2 cols) */}
        <div className="col-span-2 bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-primary)] shadow-[var(--card-shadow)] overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-[var(--border-primary)] flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />
            <h3 className="font-semibold text-[var(--text-primary)] text-sm">
              Live Threat Feed
            </h3>
          </div>

          {/* Feed legend */}
          <div className="px-4 py-2 border-b border-[var(--border-primary)] flex items-center gap-3 flex-wrap">
            {(
              [
                ["APP", "#ef4444"],
                ["ATO", "#f97316"],
                ["CNP", "#eab308"],
                ["1st Party", "#a855f7"],
                ["BNPL", "#3b82f6"],
              ] as const
            ).map(([label, color]) => (
              <div key={label} className="flex items-center gap-1">
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span className="text-[10px] text-[var(--text-tertiary)]">{label}</span>
              </div>
            ))}
            <div className="ml-auto flex items-center gap-3">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                <span className="text-[10px] text-[var(--text-tertiary)]">Blocked</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                <span className="text-[10px] text-[var(--text-tertiary)]">Flagged</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                <span className="text-[10px] text-[var(--text-tertiary)]">Loss</span>
              </div>
            </div>
          </div>

          <div className={`overflow-y-auto flex-1 ${listHeight}`}>
            {simEvents.length === 0 && (
              <div className="p-4 text-center text-sm text-[var(--text-tertiary)] italic">
                Initializing threat detection...
              </div>
            )}
            {simEvents.map((ev) => (
              <div
                key={ev.id}
                className="flex items-center gap-2 px-4 py-2 text-xs border-b border-[var(--border-primary)]/30 animate-card-in hover:bg-[var(--sidebar-item-hover)] transition-colors"
              >
                <span className="text-[var(--text-tertiary)] font-mono text-[10px] w-[56px] shrink-0">
                  {fmtTime(ev.time)}
                </span>
                <span
                  className="w-[52px] shrink-0 font-semibold text-[11px]"
                  style={{ color: fraudColor(ev.type) }}
                >
                  {ev.type}
                </span>
                <span className="text-sm shrink-0">{isoToFlag(ev.iso2)}</span>
                <span className="text-[var(--text-primary)] font-medium truncate min-w-0">
                  {ev.countryName}
                </span>
                <span className="ml-auto font-semibold text-[var(--fraud-critical)] shrink-0">
                  +{fmtUSD(ev.amount)}
                </span>
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    ev.status === "blocked"
                      ? "bg-green-500"
                      : ev.status === "flagged"
                      ? "bg-amber-400"
                      : "bg-red-500"
                  }`}
                  title={ev.status}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
