export interface Jurisdiction {
  flag: string;
  regime: string;
  color: string;
}

export interface ParticipantType {
  label: string;
}

export interface Participant {
  id: string;
  name: string;
  type: "bank" | "psp" | "telco" | "platform";
  jurisdiction: "UK" | "US" | "BR";
  contributedSignals: number;
  queriesUsed: number;
  credits: number;
  tier: "full" | "probation" | "restricted";
}

export interface LiveSignal {
  id: string;
  timestamp: string;
  source: string;
  sourceType: string;
  jurisdiction: string;
  signalType: string;
  privacyMethod: string;
  confidence: string;
}

export interface QueryResult {
  id: number;
  timestamp: string;
  querier: string;
  querierJurisdiction?: string;
  hash: string;
  bloomMatch?: boolean;
  dpAggregateCount?: number;
  trueCount?: number;
  epsilonUsed?: number;
  respondingNodes?: number;
  jurisdictionFiltering?: { name: string; jurisdiction: string; canShareDetail: string }[];
  status: "COMPLETED" | "DENIED";
  reason?: string;
  privacyGuarantee?: string;
}

export const JURISDICTIONS: Record<string, Jurisdiction> = {
  UK: { flag: "\u{1F1EC}\u{1F1E7}", regime: "UK GDPR / Data Protection Act 2018", color: "#2563eb" },
  US: { flag: "\u{1F1FA}\u{1F1F8}", regime: "State-level (CCPA/CPRA) + sector regs", color: "#dc2626" },
  BR: { flag: "\u{1F1E7}\u{1F1F7}", regime: "LGPD (Lei Geral de Protecao de Dados)", color: "#16a34a" },
};

export const PARTICIPANT_TYPES: Record<string, ParticipantType> = {
  bank: { label: "Bank" },
  psp: { label: "Payment Provider" },
  telco: { label: "Telecom" },
  platform: { label: "Platform" },
};

export const SIGNAL_TYPES: Record<string, string[]> = {
  bank: ["mule_account_pattern", "unusual_velocity", "beneficiary_risk_score", "device_fingerprint_hash"],
  psp: ["chargeback_cluster", "merchant_risk_indicator", "cross_merchant_pattern", "ip_geolocation_mismatch"],
  telco: ["sim_swap_indicator", "number_porting_velocity", "call_pattern_anomaly", "smishing_source_hash"],
  platform: ["account_takeover_signal", "synthetic_identity_indicator", "social_engineering_pattern", "ad_fraud_cluster"],
};

export const PRIVACY_METHODS = ["bloom_filter", "dp_aggregate", "psi_sketch", "hashed_token"] as const;

export const PRIVACY_METHOD_COLORS: Record<string, string> = {
  bloom_filter: "var(--fraud-review)",
  dp_aggregate: "var(--accent-color)",
  psi_sketch: "var(--fraud-critical)",
  hashed_token: "var(--fraud-warning)",
};

export const initialParticipants: Participant[] = [
  { id: "barclays", name: "UK Bank Alpha", type: "bank", jurisdiction: "UK", contributedSignals: 847, queriesUsed: 312, credits: 535, tier: "full" },
  { id: "stripe_uk", name: "PSP Beta (UK)", type: "psp", jurisdiction: "UK", contributedSignals: 623, queriesUsed: 580, credits: 43, tier: "full" },
  { id: "jpmorgan", name: "US Bank Gamma", type: "bank", jurisdiction: "US", contributedSignals: 1203, queriesUsed: 445, credits: 758, tier: "full" },
  { id: "square", name: "US PSP Delta", type: "psp", jurisdiction: "US", contributedSignals: 392, queriesUsed: 390, credits: 2, tier: "probation" },
  { id: "nubank", name: "BR Bank Epsilon", type: "bank", jurisdiction: "BR", contributedSignals: 534, queriesUsed: 201, credits: 333, tier: "full" },
  { id: "vodafone", name: "UK Telco Zeta", type: "telco", jurisdiction: "UK", contributedSignals: 289, queriesUsed: 150, credits: 139, tier: "full" },
  { id: "meta", name: "Social Platform Eta", type: "platform", jurisdiction: "US", contributedSignals: 156, queriesUsed: 420, credits: -264, tier: "restricted" },
  { id: "vivo", name: "BR Telco Theta", type: "telco", jurisdiction: "BR", contributedSignals: 198, queriesUsed: 95, credits: 103, tier: "full" },
];
