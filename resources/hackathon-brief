# PayPal Policy Hackathon — Brief

## PayPal: Connecting People and Businesses Globally

For over 25 years, PayPal's two-sided network has connected consumers and businesses through secure, seamless digital commerce. Powering connections between merchants and consumers using proprietary data responsibly and securely.

**Key stats (Year End 2025):**

- 439M+ Active Consumer and Merchant Accounts
- $1.79T Total Payment Volume
- 25.4B Payment Transactions
- $466B P2P payment volume
- 223M Monthly active accounts
- 200+ Global Markets

## PayPal UK: Global Scale, Local Presence

- £150M UK Investment in 2026
- £83BN Enabled in UK commerce in 2025
- 24M Active UK accounts
- 1M Small business accounts
- 2.7M+ PayPal+ Enrolments (since Nov '25)
- 41M+ Global consumers shopped from UK businesses via PayPal
- New UK HQ in 2026

UK product portfolio: PayPal, PayPal+, PayPal Working Capital, PayPal Zettle, PayPal Braintree, PayPal Credit, PYUSD, Xoom, Honey, PayPal World.

---

## Definitions

| Fraud type | Definition |
|---|---|
| **Authorised Push Payment (APP) Fraud** | The victim authorises the payment themselves, believing the recipient is legitimate. Commonly caused by social engineering and impersonation. |
| **Unauthorised Fraud** | Fraudsters access and misuse a victim's account without their knowledge or consent. |
| **First-Party Fraud** | The customer themselves provides false information or fakes their identity to obtain goods, credit or refunds — through bogus non-delivery claims, "friendly fraud" chargebacks or synthetic identities. |
| **Collusion Fraud** | Two or more parties cooperate to game payment or commercial systems — fake transactions, manipulated disputes, fabricated refunds, inflated sales. Traditional monitoring misses it; behavioural analysis and cross-platform intelligence are needed. |

---

## Global Trends

**Fraud-as-a-service.** Dark-web marketplaces sell ready-made fake IDs, stolen credentials and fraud playbooks. Social media is increasingly used to find victims and recruit money mules.

**Gen AI is industrialising fraud.** 85% of identity fraud cases now involve generative AI. AI-forged ID documents featured in 57% of attacks in 2024, up from virtually 0% in 2021.

**Cross-channel sequence.** Modern fraud unfolds across platforms: discovery (social) → engagement (messaging) → persuasion (spoofed calls) → execution (transfer) → laundering (mule chains).

**Expanding attack surface.** Digital wallets will be 61% of e-commerce by 2027. BNPL has grown from 4% to 49% of UK consumers in five years. Instant payments are hard to reverse.

**Mule networks.** Average network spans 15 individuals and 3.4 banks. One UK case involved 543 mules moving £130M. Mule networks launder over £10B annually in the UK.

**Fragmented prevention.** Banks see only their own accounts; social media platforms have no payment view; telcos have no transaction view.

---

## Part A — Policy Brief

> Fraud is coordinated across borders; the response must be too. But effective collaboration is harder than it sounds — organisations have different rules, competing incentives, and limited trust.

### Core Challenge

Develop a cross-border policy and intelligence-sharing framework that disrupts the global fraud ecosystem, addressing both APP and unauthorised fraud across sectors and jurisdictions.

**Consider:**

- What information should be shared across borders — and what shouldn't?
- Who owns the framework, and who holds them accountable?
- Who reimburses the customer when a scam succeeds — and does that create the right incentives?
- What's the one change — regulatory, technical, or structural?

---

## Parts A & B — Policy Brief AND Technical Assessment

> Payment service providers, banks, platforms, and telecommunications providers across at least three jurisdictions (e.g. UK, US, Brazil) have a shared interest in exchanging fraud signals to disrupt cross-border scam networks, but no such consortium yet exists.

### Core Technical Challenge

Design and, optionally, build a proof of concept for a cross-border fraud signal exchange that operates in a privacy-preserving manner and is consistent with the policy and governance framework you proposed in Part A.

**The proof of concept should:**

- **Enable fraud signals to be shared** across participants while withholding personal data
- **Apply privacy-preserving techniques** appropriate to the trust model
- **Enforce reciprocity** to prevent free-riding and overcome the cold-start problem
- **Integrate non-payments / banking participants** such as social media platforms and telecommunication providers
- **Prevent the exchange itself from becoming a vector** for surveillance and reputational targeting

---

## Deliverables & Evaluation Criteria

### Option 1: Part A

Provide the global payments company with a concise document to inform their approach, outlining your proposals for:

- A cross-border intelligence-sharing framework
- Global policy and governance recommendations
- Tactical approach and implementation (i.e. how the payments company will go about implementing your advice)
- The main challenges and trade-offs

### Option 2: Parts A & B

- **A Technical Proof of Concept** that demonstrates signal publication, query and consumption across participants.
- **A Top-Line Policy Brief** that covers your proposed cross-border intelligence-sharing framework (Part A: same or streamlined version), and up to 2 pages of additional materials to justify your design choices and a path to production.

> **All teams will deliver a 5-minute presentation that focuses on their deliverable's core concepts, strategic choices, and implementation realism.**

### Evaluation Criteria

- Strategic Coherence and Originality
- Operational Realism
- Technical Feasibility
- Treatment of Privacy, Incentives and Interoperability
- Clarity and Quality of Communication

---

## Initial Ideas / Scratchpad

*To fill in:*

### Part A — Framework sketch
- What gets shared: fraud signal taxonomy (account indicators, behavioural patterns, mule-chain hops, device/IP risk markers, scam narrative fingerprints) — exclude PII by default
- Governance: which body owns it? Options include an industry consortium (analogue: FS-ISAC), a public-private partnership (analogue: JMLIT in UK), or a treaty-based body
- Accountability: independent audit, transparency reports, redress mechanism for false positives
- Reimbursement: who pays the victim? UK PSR model (50/50 sending/receiving bank) vs sender-only liability — knock-on incentive effects
- The "one change": ?

### Part B — Technical PoC sketch
- Signal exchange architecture: publish/subscribe vs query model
- Privacy-preserving tech options:
  - Private Set Intersection (PSI) for matching account/identity hashes without revealing the full set
  - Differential Privacy on aggregate statistics
  - Homomorphic Encryption / PIR for query-side privacy (cf P79 SimplePIR)
  - Trusted Execution Environments (TEEs) for joint analytics
  - Federated learning for cross-org model training without raw data
- Trust model: semi-honest? malicious? collusion-resistant?
- Reciprocity / anti-free-riding: contribution-weighted access, tokenised credits, threshold rules
- Cold-start: bootstrapping with a seed consortium, public-good signals
- Non-payments participants (telcos, social media): different signal types (spoofed-call patterns, scam-narrative posts) — schema design
- Anti-abuse: audit logs, rate limiting, signal-provenance, recourse for flagged entities

### Open questions
- Jurisdictional scope: UK / US / Brazil — what are the GDPR / UK DPA / LGPD / state-level US blockers?
- Is there an existing analogue we extend (e.g. Stop Scams UK, GASA, GCFFC)?
- Operational realism: who'd actually sign up and why?
