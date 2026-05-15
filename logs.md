# Quorum — Build Log

All significant decisions, changes, and milestones with timestamps.

---

## 2026-05-15

### 15:22 — Dependency fix: `next@9.3.3 → 16.2.6`
**Issue:** `npm ci` failed with ERESOLVE — `next@9.3.3` requires `react@^16.6.0` but project uses `react@19.2.4`.  
**Root cause:** `package.json` had a mistyped Next.js version (`^9.3.3` instead of `^16`).  
**Evidence:** `eslint-config-next@16.2.6` in devDependencies — version must match Next.js.  
**Fix:** Updated `package.json` `next` field to `16.2.6`. Ran `npm install` to regenerate lock file.

### 15:24 — Lock file regenerated via `npm install`
`npm ci` requires lock file to match `package.json` exactly. Since the Next.js version changed, had to run `npm install` to update `package-lock.json` before `npm ci` would succeed. `npm install` completed: 406 packages, 2 moderate advisories (non-blocking).

### 15:35 — Working sheet read and product requirements understood
**Core concept:** Polycentric threat detection model for fraud signal harmonisation across domains and jurisdictions.  
**Actors:** Telegram, Instagram/Meta, PayPal, banks (Lloyds), governments (UK NFIB, US FinCEN, Brazil COAF), INTERPOL, GSE coordination layer.  
**Key problem:** "Information cloistering" — each actor has fraud signals but no financial incentive to share. Quorum solves this by enforcing reciprocity and distributing liability proportionally.  
**Demo requirement:** Show all actors talking to each other in a live animated scenario.

### 15:36 — Decision: Build `/live-demo` page
**What:** New page showing a real-time animated scenario where all actors exchange fraud signals, culminating in the Universal Quorum Matrix weighted score and a fraud verdict.  
**Why:** The working sheet demo objective — "create the pipeline live" — requires a visual, interactive narrative showing harmonisation in action.  
**Scenario chosen:** "Operation PHANTOM" — SIM swap + APP fraud detected across Telegram, Instagram, UK Bank, INTERPOL, and FinCEN simultaneously.

### 15:36 — Decision: Universal Quorum Matrix implementation
**Formula:** `WEIGHTED_SUM = Σ(score_i × weight_i)` across all contributing actors.  
**Weights (sum = 1.0):**
- Lloyds Bank (UK): 0.25 — highest weight, direct financial transaction data
- UK NFIB (Gov): 0.20 — law enforcement, SIM swap confirmation
- INTERPOL: 0.18 — cross-jurisdictional intelligence
- Telegram: 0.15 — platform signal, account behaviour
- Instagram: 0.12 — platform signal, linked account
- US FinCEN: 0.10 — SAR filing match

**Expected score:** 0.896 (CRITICAL threshold: >0.85)  
**Why these weights:** Reflect evidentiary strength and data freshness as discussed in working sheet (Value(s) = U(model trained with source s) − U(model trained without source s)).

### 15:37 — Decision: Add Live Demo to sidebar as top-level nav item in "Sentinel Mesh" section
**Why:** Live Demo is the primary demo artefact — it should be immediately accessible at the top of the Sentinel Mesh section.

### 15:38 — Live Demo page built
File: `frontend/src/app/(dashboard)/live-demo/page.tsx`  
Features: animated 10-step scenario, network SVG with 8 actor nodes + GSE hub, Quorum Matrix (builds dynamically), fraud verdict callout, Play/Pause/Reset controls.

### 15:38 — Sidebar updated
Added `Live Demo` nav item (Zap icon) to "Sentinel Mesh" section as first item.  
File: `frontend/src/components/Sidebar.tsx`

### 15:39 — Build verification
- `npx tsc --noEmit`: clean (0 errors)
- HTTP 200 on `/live-demo` route
- Pre-existing issue noted: `ThemeToggle` hydration mismatch (SSR returns Moon, CSR returns Sun when stored theme = dark). Not blocking. Fix: wrap initial state in `useEffect` — out of scope for this session.
- Pre-existing browser errors from Chrome extension (`egjidjbpglichdcondbcbdnbeeppgdph`) injecting scripts — not relevant to app.

### 15:40 — logs.md created
This file. Location: `/Users/viktoriiaastafieva/hack26/quorum/logs.md`

---

## Outstanding / Next Steps

- Python backend (venv activated): could serve a real fraud-scoring API to replace mock data
- ThemeToggle hydration fix: add `suppressHydrationWarning` or use `useEffect` for theme init
- Live backend signals: wire the GSE Live Feed to a real WebSocket or SSE stream from the Python backend
- Telegram scammer-agent demo (from working sheet line 103–106): GPT-4o-mini agent playing fraudster on Telegram, feeding signals into the matrix in real-time

---
