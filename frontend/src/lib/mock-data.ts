import type { FraudCase, AttackAgent, SimulatedSystem } from "./types";

// ── Deterministic seeded RNG for reproducible mock data ───────
function seededRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function generateCases(): FraudCase[] {
  const types: { type: FraudCase["type"]; amountRange: [number, number]; riskBias: number }[] = [
    { type: "APP Fraud", amountRange: [500, 25000], riskBias: 75 },
    { type: "Unauthorised", amountRange: [200, 15000], riskBias: 65 },
    { type: "First-Party", amountRange: [100, 8000], riskBias: 45 },
    { type: "Collusion", amountRange: [2000, 50000], riskBias: 80 },
  ];
  const statuses: FraudCase["status"][] = ["critical", "warning", "review", "cleared"];
  const regions = ["UK", "US East", "US West", "EU West", "APAC", "LATAM"];
  const cases: FraudCase[] = [];
  const rng = seededRng(42);

  const baseDate = new Date("2025-05-15T10:00:00Z").getTime();

  for (const { type, amountRange, riskBias } of types) {
    for (let i = 0; i < 55; i++) {
      const riskScore = Math.min(99, Math.max(15, Math.round(riskBias + (rng() - 0.5) * 50)));
      // Map risk score to status with some randomness
      let status: FraudCase["status"];
      if (riskScore >= 85) status = statuses[0]; // critical
      else if (riskScore >= 65) status = rng() > 0.3 ? statuses[1] : statuses[0]; // warning / critical
      else if (riskScore >= 40) status = rng() > 0.4 ? statuses[2] : statuses[1]; // review / warning
      else status = rng() > 0.5 ? statuses[3] : statuses[2]; // cleared / review

      const amount = Math.round(amountRange[0] + rng() * (amountRange[1] - amountRange[0]));
      const hoursAgo = rng() * 336; // spread over 14 days
      const timestamp = new Date(baseDate - hoursAgo * 3600000).toISOString();
      const region = regions[Math.floor(rng() * regions.length)];
      const idSuffix = (rng() * 0xffffff).toString(16).slice(0, 6).toUpperCase();

      cases.push({
        id: `TXN-${idSuffix}`,
        type,
        amount,
        riskScore,
        status,
        account: `usr_${Math.floor(rng() * 9000 + 1000)}${String.fromCharCode(97 + Math.floor(rng() * 26))}`,
        timestamp,
        region,
      });
    }
  }

  // Sort by timestamp descending (most recent first)
  cases.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  return cases;
}

export const mockCases: FraudCase[] = generateCases();

export const mockAttackAgents: AttackAgent[] = [
  {
    id: "agt-001",
    name: "APP Fraud Prober",
    vector: "app_fraud",
    status: "completed",
    targetRegion: "UK",
    intensity: "high",
    progress: 100,
    findings: 14,
    startedAt: "2025-05-15T08:00:00Z",
  },
  {
    id: "agt-002",
    name: "Account Takeover Bot",
    vector: "unauthorised",
    status: "running",
    targetRegion: "US East",
    intensity: "medium",
    progress: 67,
    findings: 8,
    startedAt: "2025-05-15T09:15:00Z",
  },
  {
    id: "agt-003",
    name: "Refund Abuse Scanner",
    vector: "first_party",
    status: "idle",
    targetRegion: "EU West",
    intensity: "low",
    progress: 0,
    findings: 0,
    startedAt: null,
  },
  {
    id: "agt-004",
    name: "Ring Detection Stress",
    vector: "collusion",
    status: "running",
    targetRegion: "APAC",
    intensity: "high",
    progress: 34,
    findings: 3,
    startedAt: "2025-05-15T09:30:00Z",
  },
];

export const mockSystems: SimulatedSystem[] = [
  {
    id: "sys-uk-01",
    name: "PayPal UK Gateway",
    region: "UK",
    fraudWeaknesses: ["app_fraud", "unauthorised"],
    firewallStrength: 72,
    isOnline: true,
  },
  {
    id: "sys-us-east-01",
    name: "PayPal US East Hub",
    region: "US East",
    fraudWeaknesses: ["unauthorised", "first_party"],
    firewallStrength: 85,
    isOnline: true,
  },
  {
    id: "sys-eu-west-01",
    name: "PayPal EU West Node",
    region: "EU West",
    fraudWeaknesses: ["collusion", "app_fraud"],
    firewallStrength: 68,
    isOnline: true,
  },
  {
    id: "sys-apac-01",
    name: "PayPal APAC Relay",
    region: "APAC",
    fraudWeaknesses: ["first_party", "collusion"],
    firewallStrength: 60,
    isOnline: false,
  },
  {
    id: "sys-latam-01",
    name: "PayPal LATAM Gateway",
    region: "LATAM",
    fraudWeaknesses: ["app_fraud", "unauthorised", "first_party"],
    firewallStrength: 55,
    isOnline: true,
  },
  {
    id: "sys-us-west-01",
    name: "PayPal US West Hub",
    region: "US West",
    fraudWeaknesses: ["collusion"],
    firewallStrength: 90,
    isOnline: true,
  },
];

export const regions = [
  "All Regions",
  "UK",
  "US East",
  "US West",
  "EU West",
  "APAC",
  "LATAM",
];

export const vectorLabels: Record<string, string> = {
  app_fraud: "APP Fraud",
  unauthorised: "Unauthorised Fraud",
  first_party: "First-Party Fraud",
  collusion: "Collusion Fraud",
};
