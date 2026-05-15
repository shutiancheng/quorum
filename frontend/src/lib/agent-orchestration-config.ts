// ⚠️  All values marked [DEMO] are illustrative placeholders.
//     Replace with real pipeline outputs when the backend is connected.

export type AgentStatus = "completed" | "running" | "warning" | "not_started";

export interface AgentMetric {
  label: string;
  value: string;
  demo: boolean;
}

export interface Agent {
  id: string;
  name: string;
  shortName: string;
  description: string;
  status: AgentStatus;
  inputs: string[];
  outputs: string[];
  checks: string[];
  metrics: AgentMetric[];
  warnings: string[];
  nextAction: string;
  lastUpdated: string;
}

export interface SourceRanking {
  id: string;
  name: string;
  type: "company" | "government" | "internal" | "external";
  coverage: string;
  freshness: string;
  qualityScore: number;
  predictiveLift: string;
  financialUtility: string;
  redundancyScore: number;
  uniquenessScore: number;
  dataValueScore: number;
  recommendedWeight: string;
  bestUseCase: string;
}

export interface TimelineEvent {
  time: string;
  agent: string;
  event: string;
  type: "info" | "success" | "warning";
}

export interface FraudSignal {
  signal: string;
  source: string;
  sourceType: "government" | "company" | "graph" | "behavioural";
  confidence: number;
  featureWeight: number;
}

export interface DataValuationEntry {
  source: string;
  utilityWith: number;
  utilityWithout: number;
  marginalLift: number;
  shapleyScore: number;
  dataValueScore: number;
}

// ── Agents ────────────────────────────────────────────────────────────────────

export const agents: Agent[] = [
  {
    id: "data-intake",
    name: "Data Intake Agent",
    shortName: "Intake",
    description: "Ingests raw data feeds from all registered providers, validates schemas, deduplicates submissions, and routes records to downstream agents.",
    status: "completed",
    inputs: ["Provider API feeds", "Batch CSV/JSON uploads", "Streaming event logs"],
    outputs: ["Normalised record batches", "Ingestion audit log", "Provider metadata manifest"],
    checks: ["Schema validation", "Mandatory field presence", "Duplicate submission detection", "Provider authentication", "Rate-limit enforcement"],
    metrics: [
      { label: "Records ingested", value: "2,847,392", demo: false },
      { label: "Providers active", value: "7", demo: false },
      { label: "Rejection rate", value: "1.3%", demo: true },
      { label: "Avg latency", value: "84 ms", demo: true },
    ],
    warnings: [],
    nextAction: "Monitor provider SLA; flag if any feed goes silent for >15 min.",
    lastUpdated: "2026-05-15T09:12:00Z",
  },
  {
    id: "data-quality",
    name: "Data Quality Agent",
    shortName: "Quality",
    description: "Profiles every ingested dataset for completeness, consistency, freshness and statistical drift. Assigns per-source quality scores used by downstream valuation.",
    status: "completed",
    inputs: ["Normalised record batches", "Provider metadata manifest"],
    outputs: ["Quality report", "Per-field missingness scores", "Freshness scores", "Drift alerts"],
    checks: ["Missingness audit", "Format consistency", "Temporal freshness (<30 days)", "Statistical drift vs baseline", "Outlier detection"],
    metrics: [
      { label: "Usable records", value: "94.2%", demo: true },
      { label: "Avg freshness score", value: "87 / 100", demo: true },
      { label: "Drift alerts raised", value: "3", demo: true },
      { label: "Fields profiled", value: "214", demo: true },
    ],
    warnings: ["Source D showing 18% missingness on `director_dob` — flagged for review."],
    nextAction: "Escalate Source D missingness to data provider; adjust quality weight accordingly.",
    lastUpdated: "2026-05-15T09:14:00Z",
  },
  {
    id: "entity-resolution",
    name: "Entity Resolution Agent",
    shortName: "Entities",
    description: "Links records across providers to canonical company and person identities using fuzzy matching, graph-based clustering, and probabilistic deduplication.",
    status: "completed",
    inputs: ["Quality-validated records", "Canonical entity registry"],
    outputs: ["Resolved entity graph", "Cross-source match scores", "Entity confidence labels"],
    checks: ["Name fuzzy matching (token sort ratio ≥ 85)", "Address normalisation", "Company number cross-reference", "Alias and known-variation lookup", "Graph cluster validation"],
    metrics: [
      { label: "Entities resolved", value: "18,420", demo: true },
      { label: "Cross-source match rate", value: "71.4%", demo: true },
      { label: "Avg confidence", value: "0.83", demo: true },
      { label: "Ambiguous matches", value: "412", demo: true },
    ],
    warnings: ["412 ambiguous matches queued for human review."],
    nextAction: "Review ambiguous matches; consider lowering threshold for sanctions-linked records.",
    lastUpdated: "2026-05-15T09:17:00Z",
  },
  {
    id: "feature-engineering",
    name: "Feature Engineering Agent",
    shortName: "Features",
    description: "Constructs the full fraud feature set: network graph features, behavioural velocity indicators, company structure red flags, and cross-source aggregate signals.",
    status: "completed",
    inputs: ["Resolved entity graph", "Transaction history", "Company registry data"],
    outputs: ["Feature matrix (312 features)", "Feature importance ranking", "Source attribution map"],
    checks: ["Feature completeness check", "Correlation analysis (remove r > 0.95)", "Leakage guard (no future data)", "Null imputation audit"],
    metrics: [
      { label: "Features generated", value: "312", demo: true },
      { label: "Graph features", value: "84", demo: true },
      { label: "Behavioural features", value: "96", demo: true },
      { label: "Registry features", value: "132", demo: true },
    ],
    warnings: [],
    nextAction: "Run feature importance update after next model retraining.",
    lastUpdated: "2026-05-15T09:21:00Z",
  },
  {
    id: "fraud-modelling",
    name: "Fraud Modelling Agent",
    shortName: "Model",
    description: "Trains and serves the fraud detection ensemble (gradient boosting + GNN). Scores all entities and transactions in real time against the current model version.",
    status: "running",
    inputs: ["Feature matrix", "Labelled fraud ground truth", "Model config / hyperparameters"],
    outputs: ["Fraud probability scores", "Risk bands (Low / Medium / High / Critical)", "SHAP explanations per case"],
    checks: ["Cross-validation (5-fold stratified)", "Calibration check (Brier score)", "Label leakage guard", "Class imbalance handling (SMOTE)"],
    metrics: [
      { label: "PR-AUC", value: "0.847", demo: true },
      { label: "Recall @ 5% FPR", value: "79.3%", demo: true },
      { label: "Model version", value: "v3.4.1", demo: true },
      { label: "Training time", value: "6 min 14 s", demo: true },
    ],
    warnings: ["Retraining in progress — live scores using v3.4.0 until complete."],
    nextAction: "Validate v3.4.1 on hold-out set; promote if PR-AUC ≥ 0.84.",
    lastUpdated: "2026-05-15T09:28:00Z",
  },
  {
    id: "model-evaluation",
    name: "Model Evaluation Agent",
    shortName: "Evaluation",
    description: "Runs automated hold-out evaluation, A/B comparison vs previous model version, and fairness audits. Blocks model promotion if quality thresholds are not met.",
    status: "running",
    inputs: ["Fraud model output", "Hold-out labelled dataset", "Previous model scores"],
    outputs: ["Evaluation report", "A/B lift summary", "Fairness audit", "Promotion decision"],
    checks: ["PR-AUC vs threshold (≥ 0.84)", "Recall at 1% / 5% FPR", "Precision at P90", "Demographic parity audit", "False-positive cost estimate"],
    metrics: [
      { label: "PR-AUC (hold-out)", value: "Pending", demo: true },
      { label: "A/B lift vs v3.4.0", value: "+2.1 pp", demo: true },
      { label: "FP cost estimate", value: "£4,200 / day", demo: true },
      { label: "Promotion status", value: "In review", demo: true },
    ],
    warnings: ["Evaluation blocked pending retraining completion."],
    nextAction: "Auto-promote v3.4.1 once evaluation passes all thresholds.",
    lastUpdated: "2026-05-15T09:31:00Z",
  },
  {
    id: "data-valuation",
    name: "Data Valuation Agent",
    shortName: "Valuation",
    description: "Estimates the marginal value of each data source via leave-one-source-out ablation and approximate Shapley scoring. Outputs a Data Value Score (0–100) per provider.",
    status: "warning",
    inputs: ["Model evaluation outputs", "Per-source feature attribution", "Financial utility estimates"],
    outputs: ["Source value scores", "Ablation report", "Shapley contribution table", "Recommended weights"],
    checks: ["Leave-one-source-out ablation (7 sources)", "Approximate Shapley (100 permutations)", "Correlation-adjusted uniqueness", "Financial utility mapping"],
    metrics: [
      { label: "Sources valued", value: "6 / 7", demo: true },
      { label: "Top source lift", value: "+9.4 pp PR-AUC", demo: true },
      { label: "Baseline PR-AUC", value: "0.721", demo: true },
      { label: "Full-ensemble PR-AUC", value: "0.847", demo: true },
    ],
    warnings: ["Source G (Social Media) valuation incomplete — awaiting data quality gate.", "Shapley approximation uses 100 permutations; increase for higher accuracy."],
    nextAction: "Complete Source G valuation once quality score exceeds 70. Rerun Shapley with 500 permutations for final report.",
    lastUpdated: "2026-05-15T09:34:00Z",
  },
  {
    id: "source-weighting",
    name: "Source Weighting Agent",
    shortName: "Weighting",
    description: "Converts Data Value Scores into provider contract weights and pricing signals. Updates the ensemble's source mixing coefficients for the next model run.",
    status: "completed",
    inputs: ["Data Value Scores", "Contract cost data", "Provider SLA metadata"],
    outputs: ["Recommended provider weights", "Updated mixing coefficients", "Cost-adjusted value ranking", "Procurement recommendations"],
    checks: ["Cost-adjusted ROI calculation", "Minimum coverage constraint (≥ 60%)", "Redundancy check (max 2 sources per feature group)", "SLA compliance flag"],
    metrics: [
      { label: "Providers re-ranked", value: "6", demo: true },
      { label: "Top weight assigned", value: "34% (Gov Registry)", demo: true },
      { label: "Est. annual value uplift", value: "£1.2M", demo: true },
      { label: "Redundant sources flagged", value: "1", demo: true },
    ],
    warnings: ["Source E weight reduced due to high redundancy with Source C."],
    nextAction: "Share updated weights with procurement for next contract negotiation cycle.",
    lastUpdated: "2026-05-15T09:36:00Z",
  },
  {
    id: "monitoring-governance",
    name: "Monitoring / Governance Agent",
    shortName: "Governance",
    description: "Continuously monitors model drift, data lineage, regulatory compliance, and audit trail completeness. Raises alerts for governance breaches and SLA violations.",
    status: "running",
    inputs: ["Live model scores", "Data lineage logs", "Compliance rule set", "Alert thresholds"],
    outputs: ["Drift alerts", "Lineage report", "Compliance status", "Audit trail"],
    checks: ["Model PSI drift (threshold 0.2)", "Data lineage completeness", "GDPR lawful basis check", "PSD2 / FCA rule adherence", "Audit log integrity"],
    metrics: [
      { label: "Drift alerts (24h)", value: "0", demo: true },
      { label: "Lineage coverage", value: "98.7%", demo: true },
      { label: "Compliance status", value: "Green", demo: true },
      { label: "Audit events logged", value: "14,203", demo: true },
    ],
    warnings: [],
    nextAction: "Schedule quarterly external audit. Review FCA Consumer Duty obligations.",
    lastUpdated: "2026-05-15T09:38:00Z",
  },
];

// ── Source Rankings ────────────────────────────────────────────────────────────
// ⚠️  All values are [DEMO] illustrative placeholders.

export const sourceRankings: SourceRanking[] = [
  {
    id: "src-a",
    name: "Government Registry",
    type: "government",
    coverage: "97%",
    freshness: "Daily",
    qualityScore: 95,
    predictiveLift: "+9.4 pp",
    financialUtility: "£820K / yr",
    redundancyScore: 12,
    uniquenessScore: 91,
    dataValueScore: 88,
    recommendedWeight: "34%",
    bestUseCase: "Shell company detection",
  },
  {
    id: "src-b",
    name: "Bureau van Dijk / Orbis",
    type: "company",
    coverage: "83%",
    freshness: "Weekly",
    qualityScore: 88,
    predictiveLift: "+6.1 pp",
    financialUtility: "£510K / yr",
    redundancyScore: 28,
    uniquenessScore: 74,
    dataValueScore: 72,
    recommendedWeight: "22%",
    bestUseCase: "Director network fraud",
  },
  {
    id: "src-c",
    name: "Internal Transaction History",
    type: "internal",
    coverage: "100%",
    freshness: "Real-time",
    qualityScore: 97,
    predictiveLift: "+7.8 pp",
    financialUtility: "£670K / yr",
    redundancyScore: 18,
    uniquenessScore: 85,
    dataValueScore: 84,
    recommendedWeight: "28%",
    bestUseCase: "Transaction fraud & velocity",
  },
  {
    id: "src-d",
    name: "Credit Bureau",
    type: "external",
    coverage: "74%",
    freshness: "Monthly",
    qualityScore: 71,
    predictiveLift: "+3.2 pp",
    financialUtility: "£210K / yr",
    redundancyScore: 44,
    uniquenessScore: 58,
    dataValueScore: 51,
    recommendedWeight: "9%",
    bestUseCase: "First-party / synthetic identity",
  },
  {
    id: "src-e",
    name: "Internal Entity Graph",
    type: "internal",
    coverage: "100%",
    freshness: "Real-time",
    qualityScore: 93,
    predictiveLift: "+5.9 pp",
    financialUtility: "£490K / yr",
    redundancyScore: 52,
    uniquenessScore: 62,
    dataValueScore: 63,
    recommendedWeight: "14%",
    bestUseCase: "Network / collusion fraud",
  },
  {
    id: "src-f",
    name: "Sanctions / PEP Database",
    type: "government",
    coverage: "62%",
    freshness: "Daily",
    qualityScore: 91,
    predictiveLift: "+4.7 pp",
    financialUtility: "£380K / yr",
    redundancyScore: 9,
    uniquenessScore: 88,
    dataValueScore: 77,
    recommendedWeight: "18%",
    bestUseCase: "Sanctions & adverse media",
  },
  {
    id: "src-g",
    name: "Social Media Signals",
    type: "external",
    coverage: "41%",
    freshness: "Hourly",
    qualityScore: 58,
    predictiveLift: "Pending",
    financialUtility: "Pending",
    redundancyScore: 61,
    uniquenessScore: 49,
    dataValueScore: 0,
    recommendedWeight: "—",
    bestUseCase: "Identity & APP fraud",
  },
];

// ── Data Valuation Ablation ────────────────────────────────────────────────────
// ⚠️  All values are [DEMO] illustrative placeholders.
// Formula: Value(source) = Utility(model with source) − Utility(model without source)

export const dataValuationData: DataValuationEntry[] = [
  { source: "Government Registry",         utilityWith: 0.847, utilityWithout: 0.753, marginalLift: 0.094, shapleyScore: 0.091, dataValueScore: 88 },
  { source: "Internal Transaction History", utilityWith: 0.847, utilityWithout: 0.769, marginalLift: 0.078, shapleyScore: 0.076, dataValueScore: 84 },
  { source: "Bureau van Dijk / Orbis",     utilityWith: 0.847, utilityWithout: 0.786, marginalLift: 0.061, shapleyScore: 0.058, dataValueScore: 72 },
  { source: "Sanctions / PEP DB",          utilityWith: 0.847, utilityWithout: 0.800, marginalLift: 0.047, shapleyScore: 0.044, dataValueScore: 77 },
  { source: "Internal Entity Graph",       utilityWith: 0.847, utilityWithout: 0.788, marginalLift: 0.059, shapleyScore: 0.054, dataValueScore: 63 },
  { source: "Credit Bureau",               utilityWith: 0.847, utilityWithout: 0.815, marginalLift: 0.032, shapleyScore: 0.029, dataValueScore: 51 },
];

// ── Timeline Events ────────────────────────────────────────────────────────────
// ⚠️  Timestamps are [DEMO] illustrative placeholders.

export const timelineEvents: TimelineEvent[] = [
  { time: "09:08", agent: "Data Intake Agent",           event: "Received 7 provider datasets (2.85M records)",          type: "info" },
  { time: "09:10", agent: "Data Intake Agent",           event: "Source G feed delayed — retrying in 5 min",             type: "warning" },
  { time: "09:12", agent: "Data Intake Agent",           event: "All 7 provider datasets ingested successfully",          type: "success" },
  { time: "09:13", agent: "Data Quality Agent",          event: "Schema validation passed for 6 / 7 sources",            type: "info" },
  { time: "09:14", agent: "Data Quality Agent",          event: "Flagged 18% missingness on `director_dob` (Source D)",  type: "warning" },
  { time: "09:14", agent: "Data Quality Agent",          event: "Quality profiling complete — 94.2% usable records",     type: "success" },
  { time: "09:16", agent: "Entity Resolution Agent",     event: "Canonical entity registry loaded (182K entities)",      type: "info" },
  { time: "09:17", agent: "Entity Resolution Agent",     event: "Resolved 18,420 cross-source entity matches",           type: "success" },
  { time: "09:17", agent: "Entity Resolution Agent",     event: "412 ambiguous matches queued for human review",         type: "warning" },
  { time: "09:19", agent: "Feature Engineering Agent",   event: "Feature pipeline started — 312 features configured",    type: "info" },
  { time: "09:21", agent: "Feature Engineering Agent",   event: "Feature matrix generated (312 features × 18,420 ent.)", type: "success" },
  { time: "09:22", agent: "Feature Engineering Agent",   event: "Source attribution map written to feature store",       type: "info" },
  { time: "09:24", agent: "Fraud Modelling Agent",       event: "Model retraining started (v3.4.1)",                     type: "info" },
  { time: "09:28", agent: "Fraud Modelling Agent",       event: "Training complete — PR-AUC 0.847 on validation set",    type: "success" },
  { time: "09:29", agent: "Model Evaluation Agent",      event: "Hold-out evaluation started",                           type: "info" },
  { time: "09:31", agent: "Model Evaluation Agent",      event: "A/B comparison: v3.4.1 +2.1 pp over v3.4.0",           type: "info" },
  { time: "09:33", agent: "Data Valuation Agent",        event: "Leave-one-source-out ablation started (6 sources)",     type: "info" },
  { time: "09:34", agent: "Data Valuation Agent",        event: "Ablation complete — top source: Gov Registry +9.4 pp",  type: "success" },
  { time: "09:34", agent: "Data Valuation Agent",        event: "Source G valuation skipped — quality gate not met",     type: "warning" },
  { time: "09:35", agent: "Source Weighting Agent",      event: "Provider rankings updated — 6 sources re-weighted",     type: "success" },
  { time: "09:36", agent: "Source Weighting Agent",      event: "Source E weight reduced (high redundancy with Source C)",type: "warning" },
  { time: "09:36", agent: "Monitoring / Governance Agent","event": "Governance check passed — all 14,203 events logged",  type: "success" },
  { time: "09:38", agent: "Monitoring / Governance Agent","event": "Continuous drift monitoring active (PSI baseline set)",type: "info" },
];

// ── Case Example ───────────────────────────────────────────────────────────────
// ⚠️  All values are [DEMO] illustrative placeholders.

export interface CaseExample {
  id: string;
  entityName: string;
  fraudProbability: number;
  riskBand: "Low" | "Medium" | "High" | "Critical";
  reviewStatus: string;
  signals: FraudSignal[];
}

export const caseExample: CaseExample = {
  id: "ENT-00824",
  entityName: "Horizon Capital Solutions Ltd",
  fraudProbability: 0.86,
  riskBand: "High",
  reviewStatus: "Under Investigation",
  signals: [
    {
      signal: "Government registry: director mismatch vs submission",
      source: "Government Registry",
      sourceType: "government",
      confidence: 0.94,
      featureWeight: 0.31,
    },
    {
      signal: "Shared registered address with 4 known fraud entities",
      source: "Internal Entity Graph",
      sourceType: "graph",
      confidence: 0.91,
      featureWeight: 0.24,
    },
    {
      signal: "Transaction velocity +340% above sector baseline (7 days)",
      source: "Internal Transaction History",
      sourceType: "behavioural",
      confidence: 0.88,
      featureWeight: 0.19,
    },
    {
      signal: "Director linked to dissolved shell company cluster (3 entities)",
      source: "Bureau van Dijk / Orbis",
      sourceType: "company",
      confidence: 0.82,
      featureWeight: 0.15,
    },
    {
      signal: "Adverse media hit — director named in HMRC enquiry",
      source: "Sanctions / PEP DB",
      sourceType: "government",
      confidence: 0.77,
      featureWeight: 0.11,
    },
  ],
};
