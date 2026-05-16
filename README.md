# Quorum — Cross-Border Fraud Intelligence Platform

**Cambridge Judge Business School · DPI Network · CPH**  
PayPal Policy Hackathon, May 2026

---

## Primary Deliverables

| Deliverable | Link |
|---|---|
| **Technical Policy Brief** | [`FINAL Technical Policy Brief.pdf`](./FINAL%20Technical%20Policy%20Brief.pdf) |
| **Live Platform** | [https://quorum-hq.vercel.app/orchestration](https://quorum-hq.vercel.app/orchestration) |
| **Hackathon Brief** | [`docs/paypal_hackathon_brief.md`](./docs/paypal_hackathon_brief.md) |

---

## Overview

Quorum is a proof-of-concept fraud intelligence platform submitted in response to PayPal's challenge to design a cross-border, privacy-preserving fraud signal exchange. The project addresses both Part A (Policy Framework) and Part B (Technical Proof of Concept) of the brief.

The core argument of the policy brief is that the current regulatory structure places reimbursement liability almost exclusively on Payment Service Providers (PSPs), leaving every other actor in the "fraud chain" — social media platforms, telecommunications providers, payment processors — with no financial incentive to share fraud-relevant information. Quorum proposes a three-part remedy:

1. **A real-time aggregate signal-sharing framework** that enables participants to exchange privacy-preserving fraud signals without transmitting Personally Identifiable Information (PII), consistent with GDPR and equivalent data protection regimes.
2. **A Global Fraud Regulation Fund (GFRF)**, modelled on cybersecurity bug-bounty programmes, which distributes reimbursement liability proportionally across the fraud chain and rewards proactive fraud prevention with publicly-issued security certifications.
3. **Collective risk-sharing mechanisms** that align incentives across governments, PSPs, platforms, and telcos to support cross-border fraud disruption.

---

## Policy Brief

**"Collective Risk-Sharing: Exploring Real Time Signal Sharing Frameworks in Tandem with a Global Fraud Regulation Fund (GFRF)"**

The brief is structured around four sections:

**Background.** Financial and governmental institutions increasingly recognise fraud as a collective global problem requiring a coordinated response. Current frameworks are insufficient: in the UK and EU, the bank used in a scam bears primary liability, creating perverse incentives throughout the fraud chain. Each actor holds a unique subset of information — but no regulatory or financial mechanism compels them to share it.

**Proposal.** A polycentric threat detection model in which participants share not raw data, but only a binary *match signal* — whether a given PII element appears in their fraud-associated dataset. Reliability is graded by a trustworthiness algorithm trained on a fraud-prevention model; PII is shared only when "necessary and sufficient" under GDPR. The GFRF imposes proportional fines on all firms in the fraud chain and redistributes funds as bounties to those who successfully prevented the fraud upstream.

**Analysis.** The key technical achievement is the "match-only" architecture, which bypasses the principal critique of cross-institutional data sharing: no PII whatsoever passes between partners. The key political achievement is that the GFRF's "carrot and stick" structure makes opt-in rational for firms that currently have no financial reason to participate. Trade-offs include infrastructural onboarding costs and the risk that actors may not find the fund favourable if their individual loss exposure exceeds their fund contribution.

**Jurisdictional scope:** UK, US, Germany. Applicable data protection regimes: UK GDPR / DPA 2018, EU GDPR, LGPD (Brazil), US state-level frameworks.

---

## Technical Platform

The platform demonstrates the signal-sharing framework in a simulated PayPal operational context. It is deployed at:

**[https://quorum-hq.vercel.app/orchestration](https://quorum-hq.vercel.app/orchestration)**

### Architecture

The platform is a Next.js 16 application (App Router, Turbopack) with TypeScript and Tailwind CSS, deployed on Vercel. All data shown is simulated for demonstration purposes.

```
frontend/
├── src/app/(dashboard)/
│   ├── dashboard/          # Fraud case overview & live monitoring
│   ├── orchestration/      # Multi-agent pipeline & data valuation
│   ├── analytics/          # Loss comparison, block rate trend, radar analysis
│   ├── attack-simulation/  # Cross-channel attack scenario modelling
│   ├── app-fraud/          # Authorised Push Payment fraud cases
│   ├── unauthorised/       # Unauthorised account access cases
│   ├── first-party/        # First-party fraud cases
│   └── collusion/          # Collusion fraud network cases
└── src/components/         # Shared UI components
```

### Platform Pages

**Dashboard** — Real-time fraud monitoring overview. Displays $1.2M blocked in the last 24 hours across 3,847 alerts, 421 flagged accounts, and 1,893 resolved cases. Tabbed case table filterable by fraud type (APP, Unauthorised, First-Party, Collusion).

**Agentic Orchestration** — The core technical demonstration. A nine-agent pipeline ingests data from seven providers, resolves 18,420 cross-source entity matches, generates 312 fraud signals, and produces an ensemble fraud model with PR-AUC of 0.847 (vs. a baseline of 0.721 without external sources — a +12.6 pp improvement). Five views:

| Tab | Description |
|---|---|
| Pipeline | Per-agent status, inputs, outputs, key checks, and next recommended actions |
| Data Valuation | Shapley value decomposition and leave-one-out ablation by data source |
| Source Rankings | Ranked table of data providers by coverage, freshness, quality, predictive lift, and composite value score |
| Case Explorer | Signal attribution for a single fraud case showing which data source powered each detection |
| Timeline | Orchestration activity log for the current pipeline run |

**Analytics** — Cross-participant loss comparison, spider/radar chart of detection capability across fraud types, grouped bar charts by jurisdiction, and block rate trend over time.

**Attack Simulation** — Illustrates the cross-channel fraud sequence: discovery (social media) → engagement (messaging) → persuasion (spoofed call) → execution (payment transfer) → laundering (mule chain).

**Fraud Type Pages** — Dedicated drill-down views for each of the four fraud categories defined in the brief: APP fraud, unauthorised access, first-party fraud, and collusion networks.

### Data Valuation Methodology

The value of each external data source is computed as:

```
Value(source) = Utility(model with source) − Utility(model without source)
```

Utility is measured as PR-AUC on a hold-out fraud label set. Additional dimensions tracked include recall at a fixed false-positive rate, fraud loss prevented (£), false-positive cost reduction (£), and investigation cost reduction (£). Shapley values are used to attribute credit fairly across sources in the ensemble.

---

## Local Development

```bash
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

Requires Node.js 18+. No environment variables are required for the demonstration build; all data is client-side mock data.

---

## Repository Structure

```
quorum/
├── FINAL Technical Policy Brief.pdf   # Primary policy deliverable
├── Presentation PayPal.pdf            # Hackathon presentation slides
├── frontend/                          # Next.js platform source
├── docs/
│   └── paypal_hackathon_brief.md      # Original challenge brief
└── resources/
    └── working_sheet.md               # Research and design notes
```

---

## Team

Quorum — Cambridge Judge Business School, DPI Network, CPH  
Submitted: May 2026
