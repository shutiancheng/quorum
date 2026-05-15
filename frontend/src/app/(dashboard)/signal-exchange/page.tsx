"use client";

import { useState } from "react";
import TabNav from "@/components/TabNav";
import { useNetwork } from "@/lib/network-context";
import {
  JURISDICTIONS,
  PARTICIPANT_TYPES,
  PRIVACY_METHOD_COLORS,
} from "@/lib/network-data";
import {
  Radio,
  Zap,
  Globe,
  Clock,
  Landmark,
  CreditCard,
  Phone,
  Monitor,
} from "lucide-react";

const tabs = ["Architecture", "Live Feed"];

const typeIcons: Record<string, typeof Landmark> = {
  bank: Landmark,
  psp: CreditCard,
  telco: Phone,
  platform: Monitor,
};

export default function SignalExchangePage() {
  const [activeTab, setActiveTab] = useState("Architecture");
  const { liveSignals, participants } = useNetwork();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
            Signal Exchange
          </h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">
            Cross-border fraud signal exchange — privacy-preserving protocol
          </p>
        </div>
        <div className="flex items-center gap-2">
          {Object.entries(JURISDICTIONS).map(([k, v]) => (
            <span
              key={k}
              className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-lg border"
              style={{
                backgroundColor: v.color + "10",
                color: v.color,
                borderColor: v.color + "30",
              }}
            >
              {v.flag} {k}
            </span>
          ))}
        </div>
      </div>

      <TabNav tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "Architecture" && <ArchitectureView />}
      {activeTab === "Live Feed" && (
        <LiveFeedView
          signals={liveSignals}
          participantCount={participants.length}
        />
      )}
    </div>
  );
}

/* ── Architecture View ── */
function ArchitectureView() {
  return (
    <div className="space-y-4">
      {/* System design + Privacy architecture */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-primary)] shadow-[var(--card-shadow)] p-5">
          <h3 className="font-semibold text-[var(--text-primary)] mb-3">
            System Design
          </h3>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            <strong className="text-[var(--text-primary)]">
              Sentinel Mesh
            </strong>{" "}
            is a federated fraud signal exchange where no central party ever
            sees raw personal data. Each participant operates a local node
            that:
          </p>
          <div className="space-y-2 pl-3 border-l-2 border-[var(--border-secondary)]">
            {[
              "Ingests local fraud signals and computes privacy-preserving sketches (Bloom filters, DP aggregates)",
              "Publishes sketches to a coordination layer — never raw identifiers",
              "Queries other nodes via Private Set Intersection (PSI) against published Bloom filters",
              "Receives differentially-private aggregate responses, never individual records",
            ].map((step, i) => (
              <div key={i} className="flex gap-2 text-sm">
                <span className="text-[var(--accent-color)] font-bold shrink-0">
                  {i + 1}.
                </span>
                <span className="text-[var(--text-secondary)]">{step}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-primary)] shadow-[var(--card-shadow)] p-5">
          <h3 className="font-semibold text-[var(--text-primary)] mb-3">
            Privacy Architecture
          </h3>
          <div className="space-y-3">
            {[
              {
                color: "#2563eb",
                label: "Layer 1: Identifier Hashing",
                desc: "All PII is salted + hashed locally. Only cryptographic tokens cross node boundaries.",
              },
              {
                color: "#7c3aed",
                label: "Layer 2: Bloom Filter Encoding",
                desc: "Hashed tokens inserted into probabilistic data structures. Membership queries possible; enumeration is not.",
              },
              {
                color: "#db2777",
                label: "Layer 3: Differential Privacy",
                desc: "Aggregate responses have calibrated Laplace noise (\u03B5=0.5). Plausible deniability for any individual.",
              },
              {
                color: "#d97706",
                label: "Layer 4: Jurisdiction Gating",
                desc: "Cross-border queries return aggregate-only responses. Same-jurisdiction queries may return richer metadata.",
              },
            ].map((layer) => (
              <div
                key={layer.label}
                className="pl-3"
                style={{ borderLeft: `2px solid ${layer.color}60` }}
              >
                <div
                  className="text-xs font-semibold"
                  style={{ color: layer.color }}
                >
                  {layer.label}
                </div>
                <div className="text-xs text-[var(--text-tertiary)]">
                  {layer.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Network topology */}
      <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-primary)] shadow-[var(--card-shadow)] p-5">
        <h3 className="font-semibold text-[var(--text-primary)] mb-4">
          Network Topology
        </h3>
        <div className="flex justify-center py-4">
          <svg viewBox="0 0 700 320" className="w-full max-w-[700px]">
            {/* Coordination layer */}
            <rect
              x="220"
              y="120"
              width="260"
              height="80"
              rx="12"
              fill="var(--bg-tertiary)"
              stroke="var(--accent-color)"
              strokeWidth="1.5"
              strokeDasharray="6 3"
              opacity="0.6"
            />
            <text
              x="350"
              y="148"
              textAnchor="middle"
              fill="var(--text-tertiary)"
              fontSize="10"
              fontFamily="monospace"
            >
              COORDINATION LAYER
            </text>
            <text
              x="350"
              y="166"
              textAnchor="middle"
              fill="var(--text-primary)"
              fontSize="11"
              fontFamily="monospace"
              fontWeight="600"
            >
              Bloom Filter Registry
            </text>
            <text
              x="350"
              y="182"
              textAnchor="middle"
              fill="var(--text-tertiary)"
              fontSize="9"
              fontFamily="monospace"
            >
              No PII - No raw identifiers
            </text>

            {/* UK nodes */}
            <rect x="30" y="25" width="60" height="30" rx="6" fill="#2563eb15" stroke="#2563eb50" strokeWidth="1" />
            <text x="60" y="44" textAnchor="middle" fill="#2563eb" fontSize="9" fontFamily="monospace" fontWeight="600">UK Bank</text>
            <rect x="30" y="125" width="60" height="30" rx="6" fill="#2563eb15" stroke="#2563eb50" strokeWidth="1" />
            <text x="60" y="144" textAnchor="middle" fill="#2563eb" fontSize="9" fontFamily="monospace" fontWeight="600">UK PSP</text>
            <rect x="30" y="225" width="60" height="30" rx="6" fill="#2563eb15" stroke="#2563eb50" strokeWidth="1" />
            <text x="60" y="244" textAnchor="middle" fill="#2563eb" fontSize="9" fontFamily="monospace" fontWeight="600">UK Telco</text>
            <line x1="90" y1="40" x2="220" y2="140" stroke="#2563eb30" strokeWidth="1" />
            <line x1="90" y1="140" x2="220" y2="160" stroke="#2563eb30" strokeWidth="1" />
            <line x1="90" y1="240" x2="220" y2="180" stroke="#2563eb30" strokeWidth="1" />

            {/* US nodes */}
            <rect x="610" y="25" width="60" height="30" rx="6" fill="#dc262615" stroke="#dc262650" strokeWidth="1" />
            <text x="640" y="44" textAnchor="middle" fill="#dc2626" fontSize="9" fontFamily="monospace" fontWeight="600">US Bank</text>
            <rect x="610" y="125" width="60" height="30" rx="6" fill="#dc262615" stroke="#dc262650" strokeWidth="1" />
            <text x="640" y="144" textAnchor="middle" fill="#dc2626" fontSize="9" fontFamily="monospace" fontWeight="600">US PSP</text>
            <rect x="610" y="225" width="60" height="30" rx="6" fill="#dc262615" stroke="#dc262650" strokeWidth="1" />
            <text x="640" y="244" textAnchor="middle" fill="#dc2626" fontSize="9" fontFamily="monospace" fontWeight="600">Platform</text>
            <line x1="610" y1="40" x2="480" y2="140" stroke="#dc262630" strokeWidth="1" />
            <line x1="610" y1="140" x2="480" y2="160" stroke="#dc262630" strokeWidth="1" />
            <line x1="610" y1="240" x2="480" y2="180" stroke="#dc262630" strokeWidth="1" />

            {/* BR nodes */}
            <rect x="280" y="255" width="60" height="30" rx="6" fill="#16a34a15" stroke="#16a34a50" strokeWidth="1" />
            <text x="310" y="274" textAnchor="middle" fill="#16a34a" fontSize="9" fontFamily="monospace" fontWeight="600">BR Bank</text>
            <rect x="370" y="255" width="60" height="30" rx="6" fill="#16a34a15" stroke="#16a34a50" strokeWidth="1" />
            <text x="400" y="274" textAnchor="middle" fill="#16a34a" fontSize="9" fontFamily="monospace" fontWeight="600">BR Telco</text>
            <line x1="310" y1="255" x2="330" y2="200" stroke="#16a34a30" strokeWidth="1" />
            <line x1="400" y1="255" x2="380" y2="200" stroke="#16a34a30" strokeWidth="1" />

            {/* Jurisdiction labels */}
            <text x="60" y="16" textAnchor="middle" fill="#2563eb" fontSize="10" fontFamily="monospace" fontWeight="600">UK GDPR</text>
            <text x="640" y="16" textAnchor="middle" fill="#dc2626" fontSize="10" fontFamily="monospace" fontWeight="600">US REGS</text>
            <text x="350" y="310" textAnchor="middle" fill="#16a34a" fontSize="10" fontFamily="monospace" fontWeight="600">LGPD</text>
          </svg>
        </div>
      </div>

      {/* Three info cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            title: "Anti-Surveillance",
            items: [
              { b: "Query rate limiting", t: " — max 100 queries/day/node prevents bulk surveillance." },
              { b: "k-anonymity", t: " — responses only returned when \u22653 nodes hold matching signals." },
              { b: "Audit trail", t: " — all queries logged with purpose codes, subject to peer review." },
            ],
          },
          {
            title: "Cold-Start Solution",
            items: [
              { b: "Seed credits", t: " — new participants receive 50 bootstrap query credits." },
              { b: "Asymmetric pricing", t: " — small participants earn 2x credits per signal contributed." },
              { b: "Graduated access", t: " — probationary tier with limited queries until reciprocity proven." },
            ],
          },
          {
            title: "Non-Bank Integration",
            items: [
              { b: "Telcos", t: " contribute SIM-swap, number-porting, and smishing signals via standardised schema." },
              { b: "Platforms", t: " contribute account takeover and social engineering pattern signals." },
              { b: "Same reciprocity", t: " rules apply — no free-riding regardless of sector." },
            ],
          },
        ].map((card) => (
          <div
            key={card.title}
            className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-primary)] shadow-[var(--card-shadow)] p-5"
          >
            <h3 className="font-semibold text-[var(--text-primary)] mb-2 text-sm">
              {card.title}
            </h3>
            <div className="text-xs text-[var(--text-secondary)] leading-relaxed space-y-1">
              {card.items.map((item, i) => (
                <span key={i}>
                  <strong className="text-[var(--text-primary)]">
                    {item.b}
                  </strong>
                  {item.t}{" "}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Live Feed View ── */
function LiveFeedView({
  signals,
  participantCount,
}: {
  signals: ReturnType<typeof useNetwork>["liveSignals"];
  participantCount: number;
}) {
  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { icon: Radio, label: "Active Nodes", value: String(participantCount) },
          { icon: Zap, label: "Signals Captured", value: String(signals.length) },
          { icon: Globe, label: "Cross-Border Queries", value: String(Math.floor(signals.length * 0.6)) },
          { icon: Clock, label: "Avg Latency", value: "47ms" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-primary)] shadow-[var(--card-shadow)] p-5 animate-card-in"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-[var(--text-secondary)] shrink-0" strokeWidth={1.5} />
              </div>
              <span className="text-xs text-[var(--text-tertiary)]">{stat.label}</span>
            </div>
            <div className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Live table */}
      <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-primary)] shadow-[var(--card-shadow)]">
        <div className="px-5 py-4 border-b border-[var(--border-primary)] flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[var(--fraud-cleared)] animate-alert-pulse" />
          <h3 className="font-semibold text-[var(--text-primary)]">
            Live Signal Feed
          </h3>
        </div>
        <div className="max-h-[420px] overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border-primary)]">
                {["Time", "Source", "Type", "Signal", "Privacy Method", "Confidence"].map((h) => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {signals.map((s) => {
                const jur = JURISDICTIONS[s.jurisdiction];
                const pType = PARTICIPANT_TYPES[s.sourceType];
                const conf = parseFloat(s.confidence);
                return (
                  <tr key={s.id} className="border-b border-[var(--border-primary)] hover:bg-[var(--bg-secondary)] transition-colors">
                    <td className="py-2.5 px-4 text-xs text-[var(--text-tertiary)] font-mono tabular-nums">
                      {new Date(s.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-2.5 px-4 text-[var(--text-secondary)]">
                      <span style={{ color: jur?.color }}>{jur?.flag} </span>
                      {s.source}
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 text-xs rounded bg-[var(--bg-tertiary)] text-[var(--text-secondary)]">
                        {pType?.label}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-xs font-mono text-[var(--accent-color)]">
                      {s.signalType}
                    </td>
                    <td className="py-2.5 px-4">
                      <span
                        className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded"
                        style={{
                          backgroundColor: (PRIVACY_METHOD_COLORS[s.privacyMethod] || "var(--text-tertiary)") + "15",
                          color: PRIVACY_METHOD_COLORS[s.privacyMethod] || "var(--text-tertiary)",
                        }}
                      >
                        {s.privacyMethod}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-xs font-mono" style={{
                      color: conf > 0.85 ? "var(--fraud-critical)" : conf > 0.7 ? "var(--fraud-warning)" : "var(--fraud-cleared)",
                    }}>
                      {s.confidence}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
