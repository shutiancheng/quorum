export type FraudStatus = "critical" | "warning" | "cleared" | "review";

export interface FraudCase {
  id: string;
  type: "APP Fraud" | "Unauthorised" | "First-Party" | "Collusion";
  amount: number;
  riskScore: number;
  status: FraudStatus;
  account: string;
  timestamp: string;
  region: string;
}

export interface StatCardData {
  label: string;
  value: string;
  change: string;
  changeDirection: "up" | "down";
}

export type AttackVector =
  | "app_fraud"
  | "unauthorised"
  | "first_party"
  | "collusion";

export type AttackAgentStatus =
  | "idle"
  | "configuring"
  | "running"
  | "completed"
  | "failed";

export interface AttackAgent {
  id: string;
  name: string;
  vector: AttackVector;
  status: AttackAgentStatus;
  targetRegion: string;
  intensity: "low" | "medium" | "high";
  progress: number;
  findings: number;
  startedAt: string | null;
}

export interface SimulatedSystem {
  id: string;
  name: string;
  region: string;
  fraudWeaknesses: AttackVector[];
  firewallStrength: number;
  isOnline: boolean;
}
