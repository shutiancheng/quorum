import type { CountryFraud } from "@/components/WorldMapView";

/* Fallback data used when Supabase tables are not yet seeded */

export const FALLBACK_COUNTRY_FRAUD: Record<string, CountryFraud> = {
  "840": { name: "United States", iso2: "US", lossM: 612, rate: 0.060, app: 35, unauth: 25, fp: 25, ato: 15 },
  "826": { name: "United Kingdom", iso2: "GB", lossM: 136, rate: 0.110, app: 40, unauth: 20, fp: 25, ato: 15 },
  "276": { name: "Germany", iso2: "DE", lossM: 102, rate: 0.075, app: 25, unauth: 30, fp: 25, ato: 20 },
  "250": { name: "France", iso2: "FR", lossM: 68, rate: 0.080, app: 28, unauth: 27, fp: 28, ato: 17 },
  "036": { name: "Australia", iso2: "AU", lossM: 51, rate: 0.095, app: 38, unauth: 22, fp: 25, ato: 15 },
  "076": { name: "Brazil", iso2: "BR", lossM: 51, rate: 0.120, app: 20, unauth: 35, fp: 20, ato: 25 },
  "380": { name: "Italy", iso2: "IT", lossM: 42.5, rate: 0.085, app: 24, unauth: 30, fp: 26, ato: 20 },
  "156": { name: "China", iso2: "CN", lossM: 42.5, rate: 0.070, app: 18, unauth: 35, fp: 20, ato: 27 },
  "356": { name: "India", iso2: "IN", lossM: 42.5, rate: 0.120, app: 20, unauth: 32, fp: 22, ato: 26 },
  "124": { name: "Canada", iso2: "CA", lossM: 42.5, rate: 0.055, app: 30, unauth: 28, fp: 27, ato: 15 },
  "724": { name: "Spain", iso2: "ES", lossM: 34, rate: 0.078, app: 26, unauth: 28, fp: 28, ato: 18 },
  "484": { name: "Mexico", iso2: "MX", lossM: 34, rate: 0.090, app: 22, unauth: 35, fp: 18, ato: 25 },
  "566": { name: "Nigeria", iso2: "NG", lossM: 25.5, rate: 0.180, app: 12, unauth: 45, fp: 10, ato: 33 },
  "643": { name: "Russia", iso2: "RU", lossM: 25.5, rate: 0.130, app: 15, unauth: 40, fp: 15, ato: 30 },
  "392": { name: "Japan", iso2: "JP", lossM: 25.5, rate: 0.050, app: 22, unauth: 28, fp: 32, ato: 18 },
  "528": { name: "Netherlands", iso2: "NL", lossM: 25.5, rate: 0.065, app: 30, unauth: 25, fp: 30, ato: 15 },
};

export const FALLBACK_ALERT_TRENDS = [
  { date: "Mon", alerts: 320, blocked: 280 },
  { date: "Tue", alerts: 410, blocked: 350 },
  { date: "Wed", alerts: 380, blocked: 340 },
  { date: "Thu", alerts: 520, blocked: 460 },
  { date: "Fri", alerts: 490, blocked: 430 },
  { date: "Sat", alerts: 280, blocked: 250 },
  { date: "Sun", alerts: 240, blocked: 210 },
];

export const FALLBACK_FRAUD_BY_TYPE = [
  { type: "APP", count: 1247 },
  { type: "Unauth", count: 892 },
  { type: "1st Party", count: 634 },
  { type: "Collusion", count: 421 },
];
