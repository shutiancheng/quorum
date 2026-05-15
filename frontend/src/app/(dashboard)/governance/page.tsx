"use client";

import { useState } from "react";
import TabNav from "@/components/TabNav";
import { useNetwork } from "@/lib/network-context";
import { JURISDICTIONS, PARTICIPANT_TYPES } from "@/lib/network-data";
import { Scale, Landmark, Shield, Eye } from "lucide-react";

const tabs = ["Reciprocity", "Framework", "Compliance"];

export default function GovernancePage() {
  const [activeTab, setActiveTab] = useState("Reciprocity");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
          Governance
        </h1>
        <p className="text-sm text-[var(--text-tertiary)] mt-1">
          Reciprocity model, governance framework, and jurisdiction compliance
        </p>
      </div>

      <TabNav tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "Reciprocity" && <ReciprocityView />}
      {activeTab === "Framework" && <FrameworkView />}
      {activeTab === "Compliance" && <ComplianceView />}
    </div>
  );
}

/* ── Reciprocity ── */
function ReciprocityView() {
  const { participants, contributeSignals } = useNetwork();
  const sorted = [...participants].sort((a, b) => b.credits - a.credits);

  return (
    <div className="space-y-4">
      {/* Model + Tiers */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-primary)] shadow-[var(--card-shadow)] p-5">
          <h3 className="font-semibold text-[var(--text-primary)] mb-3">
            Reciprocity Model
          </h3>
          <p className="text-sm text-[var(--text-secondary)] mb-3">
            The exchange uses a{" "}
            <strong className="text-[var(--text-primary)]">
              credit-based reciprocity system
            </strong>{" "}
            to prevent free-riding:
          </p>
          <div className="space-y-2 pl-3 border-l-2 border-[var(--border-secondary)]">
            {[
              { b: "Earn credits", t: "by contributing fraud signals (1 signal = 1 credit for large participants, 2 credits for smaller ones)" },
              { b: "Spend credits", t: "by querying the network (1 query = 1 credit)" },
              { b: "Cold-start", t: "new joiners receive 50 seed credits + a probationary tier" },
              { b: "Negative balance", t: "restricted tier — queries blocked until signals contributed" },
            ].map((item, i) => (
              <div key={i} className="text-sm text-[var(--text-secondary)]">
                <strong className="text-[var(--text-primary)]">
                  {item.b}
                </strong>{" "}
                — {item.t}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-primary)] shadow-[var(--card-shadow)] p-5">
          <h3 className="font-semibold text-[var(--text-primary)] mb-3">
            Tier Status
          </h3>
          <div className="space-y-3">
            {[
              {
                tier: "Full",
                color: "var(--fraud-cleared)",
                bg: "var(--fraud-cleared-bg)",
                desc: "Unrestricted queries. Credits > 0. Good standing.",
              },
              {
                tier: "Probation",
                color: "var(--fraud-warning)",
                bg: "var(--fraud-warning-bg)",
                desc: "Limited to 10 queries/day. New participants or those with low credits.",
              },
              {
                tier: "Restricted",
                color: "var(--fraud-critical)",
                bg: "var(--fraud-critical-bg)",
                desc: "Queries blocked. Must contribute signals to restore access.",
              },
            ].map((t) => (
              <div key={t.tier} className="flex items-start gap-2">
                <span
                  className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full shrink-0 mt-0.5"
                  style={{ backgroundColor: t.bg, color: t.color }}
                >
                  {t.tier}
                </span>
                <span className="text-sm text-[var(--text-secondary)]">
                  {t.desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Participant Ledger */}
      <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-primary)] shadow-[var(--card-shadow)]">
        <div className="px-5 py-4 border-b border-[var(--border-primary)]">
          <h3 className="font-semibold text-[var(--text-primary)]">
            Participant Ledger
          </h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border-primary)]">
              {["Participant", "Jurisdiction", "Type", "Contributed", "Queries Used", "Credits", "Tier", "Action"].map((h) => (
                <th key={h} className="text-left py-3 px-4 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((p) => {
              const tierColor =
                p.tier === "full"
                  ? "var(--fraud-cleared)"
                  : p.tier === "probation"
                  ? "var(--fraud-warning)"
                  : "var(--fraud-critical)";
              const tierBg =
                p.tier === "full"
                  ? "var(--fraud-cleared-bg)"
                  : p.tier === "probation"
                  ? "var(--fraud-warning-bg)"
                  : "var(--fraud-critical-bg)";
              return (
                <tr key={p.id} className="border-b border-[var(--border-primary)] hover:bg-[var(--bg-secondary)] transition-colors">
                  <td className="py-3 px-4 font-medium text-[var(--text-primary)]">
                    {p.name}
                  </td>
                  <td className="py-3 px-4">
                    <span style={{ color: JURISDICTIONS[p.jurisdiction]?.color }}>
                      {JURISDICTIONS[p.jurisdiction]?.flag}
                    </span>{" "}
                    <span className="text-[var(--text-secondary)]">{p.jurisdiction}</span>
                  </td>
                  <td className="py-3 px-4 text-[var(--text-secondary)]">
                    {PARTICIPANT_TYPES[p.type]?.label}
                  </td>
                  <td className="py-3 px-4 font-mono" style={{ color: "var(--fraud-cleared)" }}>
                    {p.contributedSignals}
                  </td>
                  <td className="py-3 px-4 font-mono" style={{ color: "var(--fraud-warning)" }}>
                    {p.queriesUsed}
                  </td>
                  <td
                    className="py-3 px-4 font-mono font-bold"
                    style={{
                      color:
                        p.credits > 50
                          ? "var(--fraud-cleared)"
                          : p.credits > 0
                          ? "var(--fraud-warning)"
                          : "var(--fraud-critical)",
                    }}
                  >
                    {p.credits}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full"
                      style={{ backgroundColor: tierBg, color: tierColor }}
                    >
                      {p.tier}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => contributeSignals(p.id, 10)}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--border-primary)] transition-colors"
                    >
                      +10 signals
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Framework ── */
function FrameworkView() {
  const govItems = [
    {
      title: "Independent Foundation",
      desc: "A non-profit foundation (e.g. Swiss or UK CIC) governs the protocol, independent from any single participant.",
      icon: Landmark,
    },
    {
      title: "Multi-Stakeholder Board",
      desc: "Board includes regulated entities, civil society, data protection authorities (observer), and technical experts.",
      icon: Scale,
    },
    {
      title: "Participation Agreement",
      desc: "Legally binding agreement covering data handling, reciprocity obligations, dispute resolution, and exit procedures.",
      icon: Shield,
    },
    {
      title: "Independent Audit",
      desc: "Quarterly audits by accredited third party. Query patterns reviewed for abuse. Results published in anonymised form.",
      icon: Eye,
    },
  ];

  const safeguards = [
    { b: "No Bulk Enumeration", t: "Bloom filters prevent listing all flagged entities. You can test membership — you cannot extract the set." },
    { b: "Rate Limiting", t: "100 queries/day/node. Anomalous query patterns trigger automatic review." },
    { b: "Purpose Limitation", t: "Every query requires a purpose code (e.g. 'transaction_screening'). Off-purpose use triggers sanctions." },
    { b: "Dispute & Appeal", t: "Flagged entities can challenge via an independent panel. False positives generate liability for the contributor." },
    { b: "Transparency Reports", t: "Bi-annual reports on query volumes, denial rates, dispute outcomes, and reciprocity distribution." },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Governance Structure */}
        <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-primary)] shadow-[var(--card-shadow)] p-5">
          <h3 className="font-semibold text-[var(--text-primary)] mb-3">
            Governance Structure
          </h3>
          <div className="space-y-3">
            {govItems.map((item) => (
              <div key={item.title} className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center shrink-0 mt-0.5">
                  <item.icon className="w-4 h-4 text-[var(--text-secondary)] shrink-0" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="text-sm font-medium text-[var(--text-primary)]">
                    {item.title}
                  </div>
                  <div className="text-xs text-[var(--text-tertiary)]">
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Anti-Weaponisation */}
        <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-primary)] shadow-[var(--card-shadow)] p-5">
          <h3 className="font-semibold text-[var(--text-primary)] mb-3">
            Anti-Weaponisation Safeguards
          </h3>
          <div className="space-y-3">
            {safeguards.map((item) => (
              <div key={item.b} className="text-sm text-[var(--text-secondary)]">
                <strong className="text-[var(--text-primary)]">
                  {item.b}
                </strong>{" "}
                — {item.t}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Protocol versioning */}
      <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-primary)] shadow-[var(--card-shadow)] p-5">
        <h3 className="font-semibold text-[var(--text-primary)] mb-4">
          Protocol Versioning & Evolution
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              version: "v0.1 — MVP (Now)",
              desc: "Bloom filters + DP aggregates. Credit-based reciprocity. 3 jurisdictions. Manual onboarding.",
            },
            {
              version: "v0.5 — Enhanced",
              desc: "MPC-based PSI for richer queries. Automated onboarding API. Expanded to 10+ jurisdictions. Real-time streaming.",
            },
            {
              version: "v1.0 — Production",
              desc: "Fully homomorphic encryption for queries. Decentralised governance (DAO-lite). Automated compliance engine. 50+ participants.",
            },
          ].map((v) => (
            <div
              key={v.version}
              className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)]"
            >
              <div className="text-sm font-semibold text-[var(--accent-color)] mb-1">
                {v.version}
              </div>
              <div className="text-xs text-[var(--text-tertiary)]">
                {v.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Compliance ── */
function ComplianceView() {
  const rows = [
    [
      "Legal Basis",
      "Legitimate interest (Art. 6(1)(f) UK GDPR) + DPIA",
      "No federal baseline; SAR obligations (BSA/AML)",
      "LGPD Art. 10 legitimate interest + DPIA",
    ],
    [
      "Cross-Border Transfer",
      "UK adequacy decisions / SCCs",
      "No federal restriction (sector-specific rules)",
      "LGPD Art. 33 — adequacy or SCCs required",
    ],
    [
      "Data Localisation",
      "No strict localisation; processing records required",
      "State-level varies; federal proposals pending",
      "LGPD allows transfer with safeguards",
    ],
    [
      "Data Subject Rights",
      "Access, erasure, objection (ICO oversight)",
      "CCPA/CPRA rights (CA residents)",
      "Full LGPD rights (ANPD oversight)",
    ],
    [
      "Sentinel Mesh Approach",
      "Bloom filters = no personal data crosses border",
      "Hashed tokens satisfy de-identification standard",
      "DP aggregates comply with minimisation principle",
    ],
  ];

  return (
    <div className="space-y-4">
      <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-primary)] shadow-[var(--card-shadow)]">
        <div className="px-5 py-4 border-b border-[var(--border-primary)]">
          <h3 className="font-semibold text-[var(--text-primary)]">
            Jurisdiction Compliance Matrix
          </h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border-primary)]">
              <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">
                Requirement
              </th>
              {Object.entries(JURISDICTIONS).map(([k, v]) => (
                <th
                  key={k}
                  className="text-left py-3 px-4 text-xs font-medium uppercase tracking-wider"
                  style={{ color: v.color }}
                >
                  {v.flag} {k}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row[0]} className="border-b border-[var(--border-primary)] hover:bg-[var(--bg-secondary)] transition-colors">
                <td className="py-3 px-4 font-medium text-[var(--text-primary)]">
                  {row[0]}
                </td>
                <td className="py-3 px-4 text-[var(--text-secondary)]">
                  {row[1]}
                </td>
                <td className="py-3 px-4 text-[var(--text-secondary)]">
                  {row[2]}
                </td>
                <td className="py-3 px-4 text-[var(--text-secondary)]">
                  {row[3]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Regime summaries */}
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(JURISDICTIONS).map(([k, v]) => (
          <div
            key={k}
            className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-primary)] shadow-[var(--card-shadow)] p-5"
            style={{ borderTop: `3px solid ${v.color}` }}
          >
            <div className="text-lg mb-1">
              {v.flag}
            </div>
            <h3 className="font-semibold text-[var(--text-primary)] mb-1">
              {k}
            </h3>
            <p className="text-xs text-[var(--text-tertiary)]">
              {v.regime}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
