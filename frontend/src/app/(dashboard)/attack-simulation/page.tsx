"use client";

import { useState } from "react";
import {
  Swords,
  Play,
  Square,
  Plus,
  Server,
  Shield,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Settings2,
  Globe,
  Zap,
} from "lucide-react";
import Modal from "@/components/Modal";
import {
  mockAttackAgents,
  mockSystems,
  regions,
  vectorLabels,
} from "@/lib/mock-data";
import type { AttackAgent, AttackVector, SimulatedSystem } from "@/lib/types";

const vectorOptions: { value: AttackVector; label: string }[] = [
  { value: "app_fraud", label: "APP Fraud" },
  { value: "unauthorised", label: "Unauthorised Fraud" },
  { value: "first_party", label: "First-Party Fraud" },
  { value: "collusion", label: "Collusion Fraud" },
];

const intensityColors = {
  low: "var(--fraud-cleared)",
  medium: "var(--fraud-warning)",
  high: "var(--fraud-critical)",
};

function AgentStatusIcon({ status }: { status: AttackAgent["status"] }) {
  switch (status) {
    case "running":
      return (
        <Loader2
          className="w-4 h-4 shrink-0 animate-spin text-[var(--fraud-review)]"
          strokeWidth={1.5}
        />
      );
    case "completed":
      return (
        <CheckCircle
          className="w-4 h-4 shrink-0 text-[var(--fraud-cleared)]"
          strokeWidth={1.5}
        />
      );
    case "failed":
      return (
        <AlertTriangle
          className="w-4 h-4 shrink-0 text-[var(--fraud-critical)]"
          strokeWidth={1.5}
        />
      );
    default:
      return (
        <div className="w-4 h-4 shrink-0 rounded-full border-2 border-[var(--border-secondary)]" />
      );
  }
}

function statusLabel(status: AttackAgent["status"]) {
  const map: Record<string, { label: string; bg: string; text: string }> = {
    idle: {
      label: "Idle",
      bg: "var(--bg-tertiary)",
      text: "var(--text-tertiary)",
    },
    configuring: {
      label: "Configuring",
      bg: "var(--fraud-warning-bg)",
      text: "var(--fraud-warning)",
    },
    running: {
      label: "Running",
      bg: "var(--fraud-review-bg)",
      text: "var(--fraud-review)",
    },
    completed: {
      label: "Completed",
      bg: "var(--fraud-cleared-bg)",
      text: "var(--fraud-cleared)",
    },
    failed: {
      label: "Failed",
      bg: "var(--fraud-critical-bg)",
      text: "var(--fraud-critical)",
    },
  };
  const s = map[status];
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full"
      style={{ backgroundColor: s.bg, color: s.text }}
    >
      {s.label}
    </span>
  );
}

export default function AttackSimulationPage() {
  const [agents, setAgents] = useState<AttackAgent[]>(mockAttackAgents);
  const [systems, setSystems] = useState<SimulatedSystem[]>(mockSystems);
  const [showNewAgent, setShowNewAgent] = useState(false);
  const [showSystemConfig, setShowSystemConfig] = useState(false);
  const [selectedSystem, setSelectedSystem] =
    useState<SimulatedSystem | null>(null);
  const [regionFilter, setRegionFilter] = useState("All Regions");

  // New agent form state
  const [newName, setNewName] = useState("");
  const [newVector, setNewVector] = useState<AttackVector>("app_fraud");
  const [newRegion, setNewRegion] = useState("UK");
  const [newIntensity, setNewIntensity] = useState<"low" | "medium" | "high">(
    "medium"
  );

  const filteredSystems =
    regionFilter === "All Regions"
      ? systems
      : systems.filter((s) => s.region === regionFilter);

  function handleLaunchAgent() {
    const agent: AttackAgent = {
      id: `agt-${String(agents.length + 1).padStart(3, "0")}`,
      name: newName || `Agent ${agents.length + 1}`,
      vector: newVector,
      status: "running",
      targetRegion: newRegion,
      intensity: newIntensity,
      progress: 0,
      findings: 0,
      startedAt: new Date().toISOString(),
    };
    setAgents([agent, ...agents]);
    setShowNewAgent(false);
    setNewName("");
  }

  function handleToggleSystem(id: string) {
    setSystems(
      systems.map((s) =>
        s.id === id ? { ...s, isOnline: !s.isOnline } : s
      )
    );
  }

  function handleUpdateFirewall(id: string, strength: number) {
    setSystems(
      systems.map((s) =>
        s.id === id ? { ...s, firewallStrength: strength } : s
      )
    );
  }

  function handleToggleWeakness(id: string, vector: AttackVector) {
    setSystems(
      systems.map((s) => {
        if (s.id !== id) return s;
        const has = s.fraudWeaknesses.includes(vector);
        return {
          ...s,
          fraudWeaknesses: has
            ? s.fraudWeaknesses.filter((v) => v !== vector)
            : [...s.fraudWeaknesses, vector],
        };
      })
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
            Attack Simulation
          </h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">
            Deploy red-team agents to probe simulated PayPal fraud defences
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSystemConfig(true)}
            className="px-4 py-2.5 text-sm font-medium rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] border border-[var(--border-primary)] transition-colors flex items-center gap-2"
          >
            <Settings2 className="w-4 h-4 shrink-0" strokeWidth={1.5} />
            Configure Systems
          </button>
          <button
            onClick={() => setShowNewAgent(true)}
            className="px-4 py-2.5 text-sm font-medium rounded-xl bg-[var(--brand-primary)] text-[var(--brand-primary-fg)] hover:bg-[var(--brand-primary-hover)] transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4 shrink-0" strokeWidth={1.5} />
            Deploy Agent
          </button>
        </div>
      </div>

      {/* Simulated Systems Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            Simulated Systems
          </h2>
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--bg-tertiary)]">
            {regions.map((r) => (
              <button
                key={r}
                onClick={() => setRegionFilter(r)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
                  regionFilter === r
                    ? "bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm"
                    : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {filteredSystems.map((sys) => (
            <div
              key={sys.id}
              className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-primary)] shadow-[var(--card-shadow)] p-6 animate-card-in"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center">
                    <Server
                      className="w-5 h-5 text-[var(--text-secondary)] shrink-0"
                      strokeWidth={1.5}
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-[var(--text-primary)]">
                      {sys.name}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-[var(--text-tertiary)]">
                      <Globe
                        className="w-3 h-3 shrink-0"
                        strokeWidth={1.5}
                      />
                      {sys.region}
                    </div>
                  </div>
                </div>
                {/* Online toggle */}
                <button
                  onClick={() => handleToggleSystem(sys.id)}
                  className={`relative shrink-0 w-11 h-6 rounded-full transition-colors duration-200 ${
                    sys.isOnline
                      ? "bg-[var(--toggle-active)]"
                      : "bg-[var(--toggle-track)]"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
                      sys.isOnline ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Firewall strength */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-[var(--text-tertiary)]">
                    Firewall Strength
                  </span>
                  <span className="text-xs font-medium text-[var(--text-primary)]">
                    {sys.firewallStrength}%
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${sys.firewallStrength}%`,
                      backgroundColor:
                        sys.firewallStrength >= 80
                          ? "var(--fraud-cleared)"
                          : sys.firewallStrength >= 60
                          ? "var(--fraud-warning)"
                          : "var(--fraud-critical)",
                    }}
                  />
                </div>
              </div>

              {/* Weaknesses */}
              <div>
                <span className="text-xs text-[var(--text-tertiary)] mb-1.5 block">
                  Known Weaknesses
                </span>
                <div className="flex flex-wrap gap-1">
                  {sys.fraudWeaknesses.map((w) => (
                    <span
                      key={w}
                      className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-[var(--fraud-critical-bg)] text-[var(--fraud-critical)]"
                    >
                      {vectorLabels[w]}
                    </span>
                  ))}
                  {sys.fraudWeaknesses.length === 0 && (
                    <span className="text-xs text-[var(--text-tertiary)]">
                      No known weaknesses
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Agents */}
      <div>
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
          Attack Agents
        </h2>
        <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-primary)] shadow-[var(--card-shadow)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border-primary)]">
                <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">
                  Agent
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">
                  Attack Vector
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">
                  Target Region
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">
                  Intensity
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">
                  Progress
                </th>
                <th className="text-right py-3 px-4 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">
                  Findings
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">
                  Status
                </th>
                <th className="text-right py-3 px-4 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent) => (
                <tr
                  key={agent.id}
                  className="border-b border-[var(--border-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <AgentStatusIcon status={agent.status} />
                      <div>
                        <div className="font-medium text-[var(--text-primary)]">
                          {agent.name}
                        </div>
                        <div className="text-xs text-[var(--text-tertiary)] font-mono">
                          {agent.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[var(--text-secondary)]">
                    {vectorLabels[agent.vector]}
                  </td>
                  <td className="py-3 px-4 text-[var(--text-secondary)]">
                    {agent.targetRegion}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className="inline-flex items-center gap-1 text-xs font-medium"
                      style={{ color: intensityColors[agent.intensity] }}
                    >
                      <Zap className="w-3 h-3 shrink-0" strokeWidth={1.5} />
                      {agent.intensity.charAt(0).toUpperCase() +
                        agent.intensity.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${agent.progress}%`,
                            backgroundColor:
                              agent.status === "completed"
                                ? "var(--fraud-cleared)"
                                : "var(--fraud-review)",
                          }}
                        />
                      </div>
                      <span className="text-xs text-[var(--text-tertiary)]">
                        {agent.progress}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-[var(--text-primary)]">
                    {agent.findings}
                  </td>
                  <td className="py-3 px-4">{statusLabel(agent.status)}</td>
                  <td className="py-3 px-4 text-right">
                    {agent.status === "running" ? (
                      <button
                        onClick={() =>
                          setAgents(
                            agents.map((a) =>
                              a.id === agent.id
                                ? { ...a, status: "completed", progress: 100 }
                                : a
                            )
                          )
                        }
                        className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--fraud-critical)] hover:bg-[var(--fraud-critical-bg)] transition-colors"
                      >
                        <Square
                          className="w-4 h-4 shrink-0"
                          strokeWidth={1.5}
                        />
                      </button>
                    ) : agent.status === "idle" ? (
                      <button
                        onClick={() =>
                          setAgents(
                            agents.map((a) =>
                              a.id === agent.id
                                ? {
                                    ...a,
                                    status: "running",
                                    startedAt: new Date().toISOString(),
                                  }
                                : a
                            )
                          )
                        }
                        className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--fraud-cleared)] hover:bg-[var(--fraud-cleared-bg)] transition-colors"
                      >
                        <Play
                          className="w-4 h-4 shrink-0"
                          strokeWidth={1.5}
                        />
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deploy Agent Modal */}
      <Modal
        open={showNewAgent}
        onClose={() => setShowNewAgent(false)}
        title="Deploy Attack Agent"
        footer={
          <>
            <button
              onClick={() => setShowNewAgent(false)}
              className="px-4 py-2.5 text-sm font-medium rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] border border-[var(--border-primary)] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleLaunchAgent}
              className="px-4 py-2.5 text-sm font-medium rounded-xl bg-[var(--fraud-critical)] text-white transition-colors flex items-center gap-2"
            >
              <Swords className="w-4 h-4 shrink-0" strokeWidth={1.5} />
              Launch Attack
            </button>
          </>
        }
      >
        <div className="space-y-4">
          {/* Agent Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--text-secondary)]">
              Agent Name
            </label>
            <input
              type="text"
              placeholder="e.g. APP Fraud Prober"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent transition-colors"
            />
          </div>

          {/* Attack Vector */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--text-secondary)]">
              Attack Vector
            </label>
            <select
              value={newVector}
              onChange={(e) =>
                setNewVector(e.target.value as AttackVector)
              }
              className="w-full px-3 py-2 text-sm rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent transition-colors"
            >
              {vectorOptions.map((v) => (
                <option key={v.value} value={v.value}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>

          {/* Target Region */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--text-secondary)]">
              Target Region
            </label>
            <select
              value={newRegion}
              onChange={(e) => setNewRegion(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent transition-colors"
            >
              {regions
                .filter((r) => r !== "All Regions")
                .map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
            </select>
          </div>

          {/* Intensity */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--text-secondary)]">
              Attack Intensity
            </label>
            <div className="flex items-center gap-2">
              {(["low", "medium", "high"] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setNewIntensity(level)}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-xl border transition-colors ${
                    newIntensity === level
                      ? "border-[var(--brand-primary)] bg-[var(--bg-tertiary)] text-[var(--text-primary)]"
                      : "border-[var(--border-primary)] text-[var(--text-tertiary)] hover:bg-[var(--bg-secondary)]"
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* System Configuration Modal */}
      <Modal
        open={showSystemConfig}
        onClose={() => {
          setShowSystemConfig(false);
          setSelectedSystem(null);
        }}
        title={
          selectedSystem
            ? `Configure: ${selectedSystem.name}`
            : "Select System to Configure"
        }
        footer={
          selectedSystem ? (
            <>
              <button
                onClick={() => setSelectedSystem(null)}
                className="px-4 py-2.5 text-sm font-medium rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] border border-[var(--border-primary)] transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => {
                  setShowSystemConfig(false);
                  setSelectedSystem(null);
                }}
                className="px-4 py-2.5 text-sm font-medium rounded-xl bg-[var(--brand-primary)] text-[var(--brand-primary-fg)] hover:bg-[var(--brand-primary-hover)] transition-colors"
              >
                Save
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowSystemConfig(false)}
              className="px-4 py-2.5 text-sm font-medium rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] border border-[var(--border-primary)] transition-colors"
            >
              Close
            </button>
          )
        }
      >
        {!selectedSystem ? (
          <div className="space-y-2">
            {systems.map((sys) => (
              <button
                key={sys.id}
                onClick={() => setSelectedSystem(sys)}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-[var(--bg-secondary)] transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center">
                  <Server
                    className="w-4 h-4 text-[var(--text-secondary)] shrink-0"
                    strokeWidth={1.5}
                  />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-[var(--text-primary)]">
                    {sys.name}
                  </div>
                  <div className="text-xs text-[var(--text-tertiary)]">
                    {sys.region} — Firewall: {sys.firewallStrength}%
                  </div>
                </div>
                <div
                  className={`w-2 h-2 rounded-full ${
                    sys.isOnline
                      ? "bg-[var(--fraud-cleared)]"
                      : "bg-[var(--text-tertiary)]"
                  }`}
                />
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Firewall Strength Slider */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--text-secondary)]">
                Firewall Strength: {selectedSystem.firewallStrength}%
              </label>
              <input
                type="range"
                min={0}
                max={100}
                value={selectedSystem.firewallStrength}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  handleUpdateFirewall(selectedSystem.id, val);
                  setSelectedSystem({
                    ...selectedSystem,
                    firewallStrength: val,
                  });
                }}
                className="w-full accent-[var(--brand-primary)]"
              />
              <div className="flex justify-between text-xs text-[var(--text-tertiary)]">
                <span>Weak</span>
                <span>Strong</span>
              </div>
            </div>

            {/* Fraud Weaknesses Toggles */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--text-secondary)]">
                Fraud Vulnerabilities
              </label>
              <p className="text-xs text-[var(--text-tertiary)]">
                Toggle which fraud types this system is vulnerable to
              </p>
              <div className="space-y-2 mt-2">
                {vectorOptions.map((v) => {
                  const isWeak =
                    selectedSystem.fraudWeaknesses.includes(v.value);
                  return (
                    <div
                      key={v.value}
                      className="flex items-center justify-between px-3 py-2 rounded-xl bg-[var(--bg-secondary)]"
                    >
                      <div className="flex items-center gap-2">
                        <Shield
                          className="w-4 h-4 shrink-0 text-[var(--text-tertiary)]"
                          strokeWidth={1.5}
                        />
                        <span className="text-sm text-[var(--text-primary)]">
                          {v.label}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          handleToggleWeakness(selectedSystem.id, v.value);
                          setSelectedSystem({
                            ...selectedSystem,
                            fraudWeaknesses: isWeak
                              ? selectedSystem.fraudWeaknesses.filter(
                                  (w) => w !== v.value
                                )
                              : [
                                  ...selectedSystem.fraudWeaknesses,
                                  v.value,
                                ],
                          });
                        }}
                        className={`relative shrink-0 w-11 h-6 rounded-full transition-colors duration-200 ${
                          isWeak
                            ? "bg-[var(--fraud-critical)]"
                            : "bg-[var(--toggle-track)]"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
                            isWeak ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Region */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--text-secondary)]">
                Geographic Region
              </label>
              <select
                value={selectedSystem.region}
                onChange={(e) => {
                  const newReg = e.target.value;
                  setSystems(
                    systems.map((s) =>
                      s.id === selectedSystem.id
                        ? { ...s, region: newReg }
                        : s
                    )
                  );
                  setSelectedSystem({
                    ...selectedSystem,
                    region: newReg,
                  });
                }}
                className="w-full px-3 py-2 text-sm rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent transition-colors"
              >
                {regions
                  .filter((r) => r !== "All Regions")
                  .map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
