"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Square, RotateCcw, AlertTriangle } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type ActorId =
  | "telegram"
  | "nfib"
  | "interpol"
  | "fincen"
  | "brazil"
  | "paypal"
  | "lloyds"
  | "instagram"
  | "gse";

type MsgType = "SIGNAL" | "ALERT" | "QUERY" | "RESPONSE" | "VERDICT" | "ACTION";

interface Actor {
  name: string;
  color: string;
  abbr: string;
  cx: number;
  cy: number;
  jurisdiction: string;
  sector: string;
}

interface Step {
  id: number;
  actorId: ActorId;
  msgType: MsgType;
  content: string;
  score?: number;
  weight?: number;
  targets?: ActorId[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ACTORS: Record<ActorId, Actor> = {
  telegram:  { name: "Telegram",     color: "#2AABEE", abbr: "TG",  cx: 350, cy: 30,  jurisdiction: "UK",     sector: "Platform"        },
  nfib:      { name: "UK NFIB",      color: "#7c3aed", abbr: "GOV", cx: 453, cy: 75,  jurisdiction: "UK",     sector: "Government"      },
  interpol:  { name: "INTERPOL",     color: "#dc2626", abbr: "INT", cx: 495, cy: 180, jurisdiction: "INTL",   sector: "Law Enforcement" },
  fincen:    { name: "US FinCEN",    color: "#9333ea", abbr: "FIN", cx: 453, cy: 285, jurisdiction: "US",     sector: "Government"      },
  brazil:    { name: "Brazil COAF",  color: "#16a34a", abbr: "BR",  cx: 350, cy: 325, jurisdiction: "BR",     sector: "Government"      },
  paypal:    { name: "PayPal",       color: "#003087", abbr: "PP",  cx: 247, cy: 285, jurisdiction: "US",     sector: "PSP"             },
  lloyds:    { name: "Lloyds Bank",  color: "#2563eb", abbr: "BK",  cx: 205, cy: 180, jurisdiction: "UK",     sector: "Bank"            },
  instagram: { name: "Instagram",    color: "#E1306C", abbr: "IG",  cx: 247, cy: 75,  jurisdiction: "US",     sector: "Platform"        },
  gse:       { name: "GSE Hub",      color: "#d97706", abbr: "GSE", cx: 350, cy: 180, jurisdiction: "GLOBAL", sector: "Coordination"    },
};

const MSG_COLORS: Record<MsgType, string> = {
  SIGNAL:   "#2AABEE",
  ALERT:    "#dc2626",
  QUERY:    "#d97706",
  RESPONSE: "#7c3aed",
  VERDICT:  "#dc2626",
  ACTION:   "#16a34a",
};

// Weights sum to 1.0. Weighted sum = 0.896 → CRITICAL
const STEPS: Step[] = [
  {
    id: 1,
    actorId: "telegram",
    msgType: "SIGNAL",
    content: "New account registered: +44-7700-900123 (age: 3 hours). Session IP: 185.220.101.45 — known Tor exit node. Bio: \"guaranteed 500% investment returns\". 4 outbound DMs matched romance-scam template. Signal hash published to coordination layer.",
    score: 0.78,
    weight: 0.15,
    targets: ["gse"],
  },
  {
    id: 2,
    actorId: "nfib",
    msgType: "ALERT",
    content: "SIM swap for +44-7700-900123 at 03:42 UTC — ported EE → Giffgaff without verified owner consent. Cross-references 12 prior incidents matching Operation PHANTOM mule recruitment pattern. Category: facilitated account takeover.",
    score: 0.91,
    weight: 0.20,
    targets: ["gse"],
  },
  {
    id: 3,
    actorId: "instagram",
    msgType: "SIGNAL",
    content: "@fastinvestuk linked to same phone hash. Account age: 4 hours, 0 followers, 1,247 following. 8 DMs matched investment-scam template. Off-platform redirect to counterfeit FCA authorisation page. Off-platform activity logged.",
    score: 0.83,
    weight: 0.12,
    targets: ["gse"],
  },
  {
    id: 4,
    actorId: "gse",
    msgType: "QUERY",
    content: "Cross-referencing identifier hash [a3f8…c291] across 47 participating nodes. Enforcing k-anonymity (k≥3). Jurisdiction gating: full detail within UK; aggregate-only cross-border (GDPR / LGPD compliance). Bloom filter query dispatched. Awaiting responses.",
    targets: ["telegram", "nfib", "instagram", "lloyds", "interpol", "fincen", "brazil", "paypal"],
  },
  {
    id: 5,
    actorId: "lloyds",
    msgType: "RESPONSE",
    content: "Phone number linked to account opened 6 days ago. Received 3 inbound transfers totalling £8,400. All funds immediately forwarded to BR recipient IBAN BR18-0036-0305. Funds in-out window: < 2 hours. Classic money mule behaviour confirmed.",
    score: 0.94,
    weight: 0.25,
    targets: ["gse"],
  },
  {
    id: 6,
    actorId: "interpol",
    msgType: "ALERT",
    content: "Destination IBAN confirmed in Project HAECHI-IV database. Associated with 12 APP fraud cases across 6 jurisdictions. Brazilian recipient entity flagged by COAF (Financial Activities Control Council). Estimated victim count: 34.",
    score: 0.97,
    weight: 0.18,
    targets: ["gse", "brazil"],
  },
  {
    id: 7,
    actorId: "fincen",
    msgType: "RESPONSE",
    content: "Registration email matches BSA Suspicious Activity Report #2024-98471. Pattern: rapid account creation → high-value P2P transfers → sudden dormancy. Risk tier escalated to ELEVATED. Sharing pursuant to FinCEN Exchange authority.",
    score: 0.88,
    weight: 0.10,
    targets: ["gse"],
  },
  {
    id: 8,
    actorId: "gse",
    msgType: "RESPONSE",
    content: "Aggregate result: 7 of 47 nodes returned positive Bloom filter matches. DP-noised count: 6.3 (ε=0.5). k=7 satisfies anonymity threshold. Cross-border aggregate: CRITICAL. Quorum Matrix computation complete — forwarding verdict to PayPal.",
    targets: ["paypal"],
  },
  {
    id: 9,
    actorId: "paypal",
    msgType: "VERDICT",
    content: "Quorum Matrix weighted score: 0.896 — CRITICAL RISK LEVEL. Account creation BLOCKED. Case #QRM-2024-8472 opened. Automatic referrals dispatched to Action Fraud (UK) and FinCEN (US). Liability contribution logged to reimbursement pool.",
    score: 0.896,
  },
  {
    id: 10,
    actorId: "nfib",
    msgType: "ACTION",
    content: "Enforcement action initiated. Proportional fine issued to Giffgaff (SIM swap facilitation — Tier 2 liability). Early-detection bonuses allocated from reimbursement pool to Lloyds Bank and Telegram. Security certifications for both maintained.",
    targets: ["lloyds", "telegram"],
  },
];

const MATRIX_ROWS = STEPS.filter(
  (s): s is Step & { score: number; weight: number } =>
    s.score !== undefined && s.weight !== undefined && s.id !== 9
);

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function LiveDemoPage() {
  const [visibleSteps, setVisibleSteps] = useState<Step[]>([]);
  const [playing, setPlaying] = useState(false);
  const [activeActors, setActiveActors] = useState<Set<ActorId>>(new Set());
  const indexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const feedRef = useRef<HTMLDivElement>(null);

  const advanceStep = () => {
    const idx = indexRef.current;
    if (idx >= STEPS.length) {
      setPlaying(false);
      return;
    }
    const step = STEPS[idx];
    setVisibleSteps((prev) => [...prev, step]);

    const active = new Set<ActorId>([step.actorId]);
    if (step.targets) step.targets.forEach((t) => active.add(t));
    setActiveActors(active);

    indexRef.current += 1;
    timerRef.current = setTimeout(advanceStep, 1700);

    setTimeout(() => {
      feedRef.current?.scrollTo({ top: feedRef.current.scrollHeight, behavior: "smooth" });
    }, 60);
  };

  const handlePlay = () => {
    if (playing || indexRef.current >= STEPS.length) return;
    setPlaying(true);
    advanceStep();
  };

  const handlePause = () => {
    setPlaying(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handleReset = () => {
    handlePause();
    setVisibleSteps([]);
    setActiveActors(new Set());
    indexRef.current = 0;
  };

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const done = indexRef.current >= STEPS.length && !playing;
  const matrixVisible = MATRIX_ROWS.filter((r) => visibleSteps.some((s) => s.id === r.id));
  const totalScore = matrixVisible.reduce((sum, r) => sum + r.score * r.weight, 0);
  const totalWeight = matrixVisible.reduce((sum, r) => sum + r.weight, 0);
  const hasVerdict = visibleSteps.some((s) => s.msgType === "VERDICT");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Live Demo</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">
            Operation PHANTOM — harmonised fraud detection across domains, sectors, and jurisdictions
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!playing && !done && visibleSteps.length < STEPS.length && (
            <button
              onClick={handlePlay}
              className="px-4 py-2.5 text-sm font-medium rounded-xl bg-[var(--brand-primary)] text-[var(--brand-primary-fg)] hover:bg-[var(--brand-primary-hover)] transition-colors flex items-center gap-2"
            >
              <Play className="w-4 h-4 shrink-0" strokeWidth={1.5} />
              {visibleSteps.length === 0 ? "Play Demo" : "Resume"}
            </button>
          )}
          {playing && (
            <button
              onClick={handlePause}
              className="px-4 py-2.5 text-sm font-medium rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-primary)] hover:bg-[var(--bg-tertiary)] transition-colors flex items-center gap-2"
            >
              <Square className="w-4 h-4 shrink-0" strokeWidth={1.5} />
              Pause
            </button>
          )}
          <button
            onClick={handleReset}
            className="px-4 py-2.5 text-sm font-medium rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-primary)] hover:bg-[var(--bg-tertiary)] transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4 shrink-0" strokeWidth={1.5} />
            Reset
          </button>
        </div>
      </div>

      {/* Scenario context */}
      <div className="bg-[var(--bg-tertiary)] rounded-xl border border-[var(--border-primary)] px-5 py-3 text-sm text-[var(--text-secondary)]">
        <span className="font-semibold text-[var(--text-primary)]">Scenario: </span>
        A fraudster opens a PayPal account using a SIM-swapped UK phone number also linked to scam accounts on Telegram and Instagram.
        Funds are routed through a UK money mule to a Brazilian IBAN connected to an INTERPOL-tracked network.
        Quorum detects the pattern before any funds are lost — by harmonising signals across 6 actors in 3 jurisdictions.
      </div>

      {/* Network + Timeline */}
      <div className="grid grid-cols-2 gap-4">
        {/* Network SVG */}
        <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-primary)] shadow-[var(--card-shadow)] p-6">
          <h3 className="font-semibold text-[var(--text-primary)] text-sm mb-1">Signal Network</h3>
          <p className="text-xs text-[var(--text-tertiary)] mb-3">
            Actors exchange privacy-preserving signal hashes through the GSE coordination hub
          </p>
          <NetworkSVG activeActors={activeActors} />
        </div>

        {/* Signal Timeline */}
        <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-primary)] shadow-[var(--card-shadow)] flex flex-col">
          <div className="px-6 py-4 border-b border-[var(--border-primary)] flex items-center gap-2 shrink-0">
            {playing && (
              <div className="w-2 h-2 rounded-full bg-[var(--fraud-cleared)] animate-alert-pulse" />
            )}
            <h3 className="font-semibold text-[var(--text-primary)] text-sm">
              Signal Timeline
              {visibleSteps.length > 0 && (
                <span className="font-normal text-[var(--text-tertiary)] ml-2">
                  {visibleSteps.length} / {STEPS.length} steps
                </span>
              )}
            </h3>
          </div>
          <div ref={feedRef} className="p-4 space-y-3 overflow-auto flex-1" style={{ maxHeight: 360 }}>
            {visibleSteps.length === 0 ? (
              <div className="text-center py-12 text-sm text-[var(--text-tertiary)]">
                Press Play to start the demo
              </div>
            ) : (
              visibleSteps.map((step) => {
                const actor = ACTORS[step.actorId];
                return (
                  <div key={step.id} className="flex gap-3 animate-card-in">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-white text-[10px] font-bold"
                      style={{ backgroundColor: actor.color }}
                    >
                      {actor.abbr}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <span className="text-xs font-semibold text-[var(--text-primary)]">
                          {actor.name}
                        </span>
                        <span
                          className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold rounded"
                          style={{
                            backgroundColor: MSG_COLORS[step.msgType] + "18",
                            color: MSG_COLORS[step.msgType],
                          }}
                        >
                          {step.msgType}
                        </span>
                        <span className="text-[10px] text-[var(--text-tertiary)]">
                          {actor.jurisdiction} · {actor.sector}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                        {step.content}
                      </p>
                      {step.score !== undefined && step.weight !== undefined && (
                        <div className="mt-1 flex items-center gap-3 text-[10px]">
                          <span className="text-[var(--text-tertiary)]">Signal:</span>
                          <span
                            className="font-mono font-bold"
                            style={{
                              color:
                                step.score > 0.90
                                  ? "var(--fraud-critical)"
                                  : step.score > 0.80
                                  ? "var(--fraud-warning)"
                                  : "var(--fraud-review)",
                            }}
                          >
                            {step.score.toFixed(2)}
                          </span>
                          <span className="text-[var(--text-tertiary)]">
                            weight {(step.weight * 100).toFixed(0)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Quorum Matrix */}
      {matrixVisible.length > 0 && (
        <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-primary)] shadow-[var(--card-shadow)] animate-card-in">
          <div className="px-6 py-4 border-b border-[var(--border-primary)]">
            <h3 className="font-semibold text-[var(--text-primary)]">Universal Quorum Matrix</h3>
            <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
              WEIGHTED_SCORE = Σ (Nᵢ × Wᵢ) &nbsp;·&nbsp; Nᵢ = normalised fraud signal from source i &nbsp;·&nbsp; Wᵢ = policy-defined weight
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border-primary)]">
                  {["Actor", "Sector", "Jurisdiction", "Signal Nᵢ", "Weight Wᵢ", "Contribution Nᵢ×Wᵢ", ""].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left py-3 px-4 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {matrixVisible.map((row) => {
                  const actor = ACTORS[row.actorId];
                  const contrib = row.score * row.weight;
                  return (
                    <tr
                      key={row.id}
                      className="border-b border-[var(--border-primary)] hover:bg-[var(--bg-secondary)] transition-colors animate-card-in"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded flex items-center justify-center text-white text-[9px] font-bold shrink-0"
                            style={{ backgroundColor: actor.color }}
                          >
                            {actor.abbr}
                          </div>
                          <span className="font-medium text-[var(--text-primary)]">{actor.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs text-[var(--text-secondary)]">{actor.sector}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 text-xs rounded bg-[var(--bg-tertiary)] text-[var(--text-secondary)]">
                          {actor.jurisdiction}
                        </span>
                      </td>
                      <td
                        className="py-3 px-4 font-mono font-bold"
                        style={{
                          color:
                            row.score > 0.90
                              ? "var(--fraud-critical)"
                              : row.score > 0.80
                              ? "var(--fraud-warning)"
                              : "var(--fraud-review)",
                        }}
                      >
                        {row.score.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 font-mono text-[var(--text-secondary)]">
                        {(row.weight * 100).toFixed(0)}%
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-[var(--accent-color)]">
                        {contrib.toFixed(3)}
                      </td>
                      <td className="py-3 px-4 pr-6">
                        <div className="w-20 h-1.5 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min(100, contrib * 250)}%`,
                              backgroundColor: actor.color,
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-[var(--bg-secondary)]">
                  <td colSpan={5} className="py-4 px-4 text-sm font-semibold text-[var(--text-primary)]">
                    Quorum Weighted Score
                    <span className="font-normal text-[var(--text-tertiary)] ml-2">
                      ({(totalWeight * 100).toFixed(0)}% of weights reported)
                    </span>
                  </td>
                  <td
                    className="py-4 px-4 font-mono font-bold text-2xl"
                    style={{
                      color:
                        totalScore > 0.85
                          ? "var(--fraud-critical)"
                          : totalScore > 0.65
                          ? "var(--fraud-warning)"
                          : "var(--fraud-cleared)",
                    }}
                  >
                    {totalScore.toFixed(3)}
                  </td>
                  <td className="py-4 px-4">
                    {totalScore > 0.85 ? (
                      <span className="inline-flex items-center px-2.5 py-1 text-xs font-bold rounded-full bg-[var(--fraud-critical-bg)] text-[var(--fraud-critical)] uppercase tracking-wide">
                        Critical
                      </span>
                    ) : totalScore > 0.65 ? (
                      <span className="inline-flex items-center px-2.5 py-1 text-xs font-bold rounded-full bg-[var(--fraud-warning-bg)] text-[var(--fraud-warning)] uppercase tracking-wide">
                        High
                      </span>
                    ) : null}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Verdict callout */}
      {hasVerdict && (
        <div className="bg-[var(--fraud-critical-bg)] rounded-xl border border-[var(--fraud-critical)] p-6 animate-card-in">
          <div className="flex items-start gap-3">
            <AlertTriangle
              className="w-5 h-5 text-[var(--fraud-critical)] shrink-0 mt-0.5"
              strokeWidth={1.5}
            />
            <div>
              <h3 className="font-bold text-[var(--fraud-critical)] text-base">
                Fraud Prevented — Account Blocked Before Funds Lost
              </h3>
              <p className="text-sm text-[var(--fraud-critical)] opacity-80 mt-1 leading-relaxed">
                Six actors across three jurisdictions contributed signals without sharing any raw PII.
                Privacy-preserving hashing, Bloom filters, and differential privacy (ε=0.5) ensured
                GDPR and LGPD compliance throughout. Liability is distributed proportionally. The
                reimbursement pool is funded. Security certifications are maintained for early reporters.
              </p>
              <div className="mt-3 flex items-center gap-4 text-xs text-[var(--fraud-critical)] opacity-70 flex-wrap">
                <span>6 actors contributed</span>
                <span>·</span>
                <span>3 jurisdictions</span>
                <span>·</span>
                <span>0 PII shared</span>
                <span>·</span>
                <span>Score 0.896 / 1.00</span>
                <span>·</span>
                <span>47ms average latency</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Network SVG ─────────────────────────────────────────────────────────────

function NetworkSVG({ activeActors }: { activeActors: Set<ActorId> }) {
  const outerActors = (Object.entries(ACTORS) as [ActorId, Actor][]).filter(
    ([id]) => id !== "gse"
  );
  const gse = ACTORS.gse;

  return (
    <svg viewBox="0 0 700 370" className="w-full">
      <defs>
        <filter id="lineGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <style>{`
          @keyframes actorPulse {
            0%, 100% { opacity: 0.15; }
            50% { opacity: 0.55; }
          }
          @keyframes lineGlowAnim {
            0%, 100% { opacity: 0.35; }
            50%       { opacity: 1; }
          }
          @keyframes gsePulse {
            0%, 100% { opacity: 0.1; }
            50% { opacity: 0.35; }
          }
          .pulse-ring { animation: actorPulse 1s ease-in-out infinite; }
          .flow-line  { animation: lineGlowAnim 0.85s ease-in-out infinite; }
          .gse-ring   { animation: gsePulse 1.1s ease-in-out infinite; }
        `}</style>
      </defs>

      {/* Inactive base lines */}
      {outerActors.map(([id, actor]) => {
        const isActive = activeActors.has(id) || activeActors.has("gse");
        if (isActive) return null;
        return (
          <line
            key={`line-inactive-${id}`}
            x1={actor.cx} y1={actor.cy}
            x2={gse.cx}   y2={gse.cy}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={0.75}
            strokeDasharray="4 5"
          />
        );
      })}

      {/* Active glowing lines — rendered last so glow sits on top */}
      {outerActors.map(([id, actor]) => {
        const isActive = activeActors.has(id) || activeActors.has("gse");
        if (!isActive) return null;
        return (
          <g key={`line-${id}`}>
            {/* Wide soft glow layer */}
            <line
              x1={actor.cx} y1={actor.cy}
              x2={gse.cx}   y2={gse.cy}
              stroke={actor.color}
              strokeWidth={6}
              opacity={0.18}
              filter="url(#lineGlow)"
            />
            {/* Sharp bright core */}
            <line
              x1={actor.cx} y1={actor.cy}
              x2={gse.cx}   y2={gse.cy}
              stroke={actor.color}
              strokeWidth={1.5}
              className="flow-line"
              filter="url(#lineGlow)"
            />
          </g>
        );
      })}

      {/* Outer actor nodes */}
      {outerActors.map(([id, actor]) => {
        const isActive = activeActors.has(id);
        return (
          <g key={`node-${id}`}>
            {isActive && (
              <circle
                cx={actor.cx}
                cy={actor.cy}
                r={24}
                fill={actor.color}
                className="pulse-ring"
                style={{ pointerEvents: "none" }}
              />
            )}
            <circle
              cx={actor.cx}
              cy={actor.cy}
              r={17}
              fill={isActive ? actor.color : "var(--bg-secondary)"}
              stroke={actor.color}
              strokeWidth={isActive ? 2 : 1}
              strokeOpacity={isActive ? 1 : 0.5}
            />
            <text
              x={actor.cx}
              y={actor.cy + 1}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="8"
              fontFamily="monospace"
              fontWeight="700"
              fill={isActive ? "white" : actor.color}
            >
              {actor.abbr}
            </text>
            <text
              x={actor.cx}
              y={actor.cy + 30}
              textAnchor="middle"
              fontSize="8"
              fontFamily="monospace"
              fill={isActive ? actor.color : "var(--text-tertiary)"}
              fontWeight={isActive ? "600" : "400"}
            >
              {actor.name}
            </text>
            <text
              x={actor.cx}
              y={actor.cy + 41}
              textAnchor="middle"
              fontSize="7"
              fontFamily="monospace"
              fill="var(--text-tertiary)"
              opacity="0.6"
            >
              {actor.jurisdiction}
            </text>
          </g>
        );
      })}

      {/* GSE center node */}
      {(() => {
        const isActive = activeActors.has("gse");
        return (
          <g>
            {isActive && (
              <circle
                cx={gse.cx}
                cy={gse.cy}
                r={34}
                fill={gse.color}
                className="gse-ring"
                style={{ pointerEvents: "none" }}
              />
            )}
            <circle
              cx={gse.cx}
              cy={gse.cy}
              r={24}
              fill={isActive ? gse.color : "var(--bg-secondary)"}
              stroke={gse.color}
              strokeWidth={isActive ? 2.5 : 1.5}
              strokeOpacity={0.9}
            />
            <text
              x={gse.cx}
              y={gse.cy}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="9"
              fontFamily="monospace"
              fontWeight="700"
              fill={isActive ? "white" : gse.color}
            >
              GSE
            </text>
            <text
              x={gse.cx}
              y={gse.cy + 38}
              textAnchor="middle"
              fontSize="8"
              fontFamily="monospace"
              fill={gse.color}
              fontWeight="600"
            >
              Coordination Hub
            </text>
            <text
              x={gse.cx}
              y={gse.cy + 49}
              textAnchor="middle"
              fontSize="7"
              fontFamily="monospace"
              fill="var(--text-tertiary)"
              opacity="0.7"
            >
              GLOBAL · No PII
            </text>
          </g>
        );
      })()}
    </svg>
  );
}
