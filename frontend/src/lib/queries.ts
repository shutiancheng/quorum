import { createServerSupabase } from "./supabase";
import type { CountryFraud } from "@/components/WorldMapView";
import type { FraudCase, AttackAgent, SimulatedSystem } from "./types";
import type { Participant } from "./network-data";

/* ── Fallback static data (used when Supabase tables are not yet seeded) ── */
import { mockCases, mockAttackAgents, mockSystems } from "./mock-data";
import { initialParticipants } from "./network-data";
import { FALLBACK_COUNTRY_FRAUD, FALLBACK_ALERT_TRENDS, FALLBACK_FRAUD_BY_TYPE } from "./fallbacks";

/* ── Country fraud data (map + threat activity) ── */
export async function getCountryFraudData(): Promise<Record<string, CountryFraud>> {
  try {
    const sb = createServerSupabase();
    const { data, error } = await sb.from("country_fraud_data").select("*");
    if (error || !data || data.length === 0) return FALLBACK_COUNTRY_FRAUD;
    const map: Record<string, CountryFraud> = {};
    for (const row of data) {
      map[row.id] = {
        name: row.name, iso2: row.iso2, lossM: Number(row.loss_m),
        rate: Number(row.fraud_rate), app: row.app_pct, unauth: row.unauth_pct,
        fp: row.fp_pct, ato: row.ato_pct,
      };
    }
    return map;
  } catch { return FALLBACK_COUNTRY_FRAUD; }
}

/* ── Alert trends (analytics overview chart) ── */
export async function getAlertTrends(): Promise<{ date: string; alerts: number; blocked: number }[]> {
  try {
    const sb = createServerSupabase();
    const { data } = await sb.from("alert_trends").select("*").order("id");
    if (!data || data.length === 0) return FALLBACK_ALERT_TRENDS;
    return data.map((r) => ({ date: r.day_label, alerts: r.alerts, blocked: r.blocked }));
  } catch { return FALLBACK_ALERT_TRENDS; }
}

/* ── Fraud by type (analytics overview chart) ── */
export async function getFraudByType(): Promise<{ type: string; count: number }[]> {
  try {
    const sb = createServerSupabase();
    const { data } = await sb.from("fraud_by_type").select("*").order("id");
    if (!data || data.length === 0) return FALLBACK_FRAUD_BY_TYPE;
    return data.map((r) => ({ type: r.type_name, count: r.count }));
  } catch { return FALLBACK_FRAUD_BY_TYPE; }
}

/* ── Fraud cases (investigations, dashboard, fraud pages) ── */
export async function getFraudCases(): Promise<FraudCase[]> {
  try {
    const sb = createServerSupabase();
    const { data } = await sb.from("fraud_cases").select("*");
    if (!data || data.length === 0) return mockCases;
    return data.map((r) => ({
      id: r.id, type: r.type as FraudCase["type"], amount: Number(r.amount),
      riskScore: r.risk_score, status: r.status as FraudCase["status"],
      account: r.account, timestamp: r.timestamp, region: r.region,
    }));
  } catch { return mockCases; }
}

/* ── Attack agents (attack simulation) ── */
export async function getAttackAgents(): Promise<AttackAgent[]> {
  try {
    const sb = createServerSupabase();
    const { data } = await sb.from("attack_agents").select("*");
    if (!data || data.length === 0) return mockAttackAgents;
    return data.map((r) => ({
      id: r.id, name: r.name, vector: r.vector as AttackAgent["vector"],
      status: r.status as AttackAgent["status"], targetRegion: r.target_region,
      intensity: r.intensity as AttackAgent["intensity"], progress: r.progress,
      findings: r.findings, startedAt: r.started_at,
    }));
  } catch { return mockAttackAgents; }
}

/* ── Simulated systems (attack simulation) ── */
export async function getSimulatedSystems(): Promise<SimulatedSystem[]> {
  try {
    const sb = createServerSupabase();
    const { data } = await sb.from("simulated_systems").select("*");
    if (!data || data.length === 0) return mockSystems;
    return data.map((r) => ({
      id: r.id, name: r.name, region: r.region,
      fraudWeaknesses: r.fraud_weaknesses as SimulatedSystem["fraudWeaknesses"],
      firewallStrength: r.firewall_strength, isOnline: r.is_online,
    }));
  } catch { return mockSystems; }
}

/* ── Network participants (signal exchange, governance) ── */
export async function getNetworkParticipants(): Promise<Participant[]> {
  try {
    const sb = createServerSupabase();
    const { data } = await sb.from("network_participants").select("*");
    if (!data || data.length === 0) return initialParticipants;
    return data.map((r) => ({
      id: r.id, name: r.name, type: r.type as Participant["type"],
      jurisdiction: r.jurisdiction as Participant["jurisdiction"],
      contributedSignals: r.contributed_signals, queriesUsed: r.queries_used,
      credits: r.credits, tier: r.tier as Participant["tier"],
    }));
  } catch { return initialParticipants; }
}
