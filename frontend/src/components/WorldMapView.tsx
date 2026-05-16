"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology } from "topojson-specification";
import type { FeatureCollection, Feature, Geometry } from "geojson";
import topology from "@/data/countries-110m.json";

/* ═══════════════════════════════════════════════════════════════
   COUNTRY-LEVEL FRAUD LOSS DATA — 2025 ESTIMATES ($M)
   ───────────────────────────────────────────────────────────────
   PayPal reported $1.7B in transaction & credit losses (FY2025).
   Breakdown by country derived from: PayPal 10-K revenue splits,
   FICO European Fraud Map 2024, Sumsub Global Fraud Index 2025,
   ECB Payment Fraud Report, MRC Global Payments & Fraud Report,
   Visa PERC Biannual Report, and Nilson Report card fraud data.
   ═══════════════════════════════════════════════════════════════ */

export interface CountryFraud {
  name: string;
  iso2: string;
  lossM: number;   // annual fraud loss in $M
  rate: number;     // fraud rate as fraction of country TPV
  app: number;      // APP fraud %
  unauth: number;   // unauthorized fraud %
  fp: number;       // first-party/friendly fraud %
  ato: number;      // ATO/collusion fraud %
}

/* Static country fraud data — exported for use by ThreatActivityView */
export const COUNTRY_FRAUD: Record<string, CountryFraud> = {
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

export const TOTAL_ANNUAL_LOSS_M = Math.round(
  Object.values(COUNTRY_FRAUD).reduce((s, c) => s + c.lossM, 0) * 10
) / 10;

/* ═══ Helpers ═══ */
function isoToFlag(iso2: string): string {
  return String.fromCodePoint(
    ...iso2.split("").map((c) => 0x1f1e6 + c.charCodeAt(0) - 65)
  );
}

function fmtUSD(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${Math.round(n).toLocaleString()}`;
}

function fmtTime(d: Date): string {
  return d.toLocaleTimeString("en-US", {
    hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
}

// Green (low/safe) → Yellow → Orange → Red (high/critical)
function lossFill(lossM: number, alpha = 0.62): string {
  if (lossM >= 200) return `rgba(127,29,29,${alpha})`;
  if (lossM >= 100) return `rgba(185,28,28,${alpha})`;
  if (lossM >= 50)  return `rgba(220,38,38,${alpha})`;
  if (lossM >= 20)  return `rgba(234,88,12,${alpha})`;
  if (lossM >= 10)  return `rgba(202,138,4,${alpha})`;
  if (lossM >= 5)   return `rgba(101,163,13,${alpha})`;
  if (lossM > 0)    return `rgba(34,197,94,${alpha * 0.85})`;
  return `rgba(203,213,225,0.45)`;
}

function lossStroke(lossM: number): string {
  if (lossM >= 200) return "#7F1D1D";
  if (lossM >= 100) return "#991B1B";
  if (lossM >= 50)  return "#B91C1C";
  if (lossM >= 20)  return "#C2410C";
  if (lossM >= 10)  return "#D97706";
  if (lossM >= 5)   return "#4D7C0F";
  if (lossM > 0)    return "#16A34A";
  return "rgba(0,0,0,0.16)";
}

const FRAUD_LABELS = ["APP", "ATO", "CNP", "1st Party", "BNPL"] as const;
type FraudLabel = (typeof FRAUD_LABELS)[number];

function pickFraudType(d: CountryFraud): FraudLabel {
  const r = Math.random() * 100;
  if (r < d.app) return "APP";
  if (r < d.app + d.ato) return "ATO";
  if (r < d.app + d.ato + d.unauth) return "CNP";
  if (r < d.app + d.ato + d.unauth + d.fp) return "1st Party";
  return "BNPL";
}

function fraudColor(t: FraudLabel): string {
  switch (t) {
    case "APP":       return "var(--fraud-critical)";
    case "ATO":       return "#f97316";
    case "CNP":       return "var(--fraud-warning)";
    case "1st Party": return "var(--fraud-review)";
    case "BNPL":      return "var(--accent-color)";
  }
}

export interface SimEvent {
  id: number;
  countryId: string;
  countryName: string;
  iso2: string;
  type: FraudLabel;
  amount: number;
  time: Date;
  status: "blocked" | "flagged" | "loss";
}

/* ═══ Hotspot cities ═══ */
const hotspots = [
  { name: "New York",      coords: [-74, 40.7] as [number, number],     cid: "840" },
  { name: "London",        coords: [-0.1, 51.5] as [number, number],    cid: "826" },
  { name: "Frankfurt",     coords: [8.7, 50.1] as [number, number],     cid: "276" },
  { name: "Lagos",         coords: [3.4, 6.5] as [number, number],      cid: "566" },
  { name: "Dubai",         coords: [55.3, 25.2] as [number, number],    cid: "784" },
  { name: "Mumbai",        coords: [72.9, 19.0] as [number, number],    cid: "356" },
  { name: "Shanghai",      coords: [121.5, 31.2] as [number, number],   cid: "156" },
  { name: "Tokyo",         coords: [139.7, 35.7] as [number, number],   cid: "392" },
  { name: "Singapore",     coords: [103.8, 1.35] as [number, number],   cid: "702" },
  { name: "S\u00E3o Paulo", coords: [-46.6, -23.5] as [number, number], cid: "076" },
  { name: "Sydney",        coords: [151.2, -33.9] as [number, number],  cid: "036" },
  { name: "Moscow",        coords: [37.6, 55.8] as [number, number],    cid: "643" },
];

const connections: [string, string][] = [
  ["London", "New York"], ["London", "Frankfurt"], ["London", "Dubai"],
  ["Dubai", "Mumbai"], ["Shanghai", "Tokyo"], ["Shanghai", "Singapore"],
  ["New York", "S\u00E3o Paulo"], ["Moscow", "Shanghai"], ["Lagos", "London"],
  ["New York", "London"], ["Singapore", "Sydney"],
];

/* 8% YoY growth — 2025 baseline data → 2026 projection */
const YOY_GROWTH = 1.08;

const WIDTH = 960;
const HEIGHT = 500;

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */
export default function WorldMapView({
  fullscreen = false,
  countryFraud = COUNTRY_FRAUD,
}: {
  fullscreen?: boolean;
  countryFraud?: Record<string, CountryFraud>;
}) {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);

  /* ── Derived from props ── */
  const TOTAL_ANNUAL_LOSS_M = useMemo(
    () => Math.round(Object.values(countryFraud).reduce((s, c) => s + c.lossM, 0) * 10) / 10,
    [countryFraud]
  );
  const weightedPicker = useMemo(() => {
    const arr: string[] = [];
    Object.entries(countryFraud).forEach(([id, d]) => {
      const w = Math.max(1, Math.ceil(Math.sqrt(d.lossM)));
      for (let i = 0; i < w; i++) arr.push(id);
    });
    return arr;
  }, [countryFraud]);

  /* Pro-rata "today's losses" based on UK BST time of day (computed once on mount) */
  const proRata = useMemo(() => {
    const now = new Date();
    // Use Europe/London — automatically handles BST (UTC+1) vs GMT (UTC+0)
    const londonStr = now.toLocaleString("en-US", { timeZone: "Europe/London" });
    const london = new Date(londonStr);
    const dayFraction = (london.getHours() * 60 + london.getMinutes()) / (24 * 60);

    let total = 0;
    const perCountry: Record<string, number> = {};
    Object.entries(countryFraud).forEach(([id, d]) => {
      const countryDailyAvg = (d.lossM * YOY_GROWTH * 1_000_000) / 365;
      const countryToday = Math.round(countryDailyAvg * dayFraction);
      perCountry[id] = countryToday;
      total += countryToday;
    });

    return { total, perCountry };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally [] — seed once on mount, simulation adds on top

  /* ── Simulation state ── */
  const [simEvents, setSimEvents] = useState<SimEvent[]>([]);
  const [dailyTotals, setDailyTotals] = useState<Record<string, number>>(proRata.perCountry);
  const [totalToday, setTotalToday] = useState(proRata.total);
  const [flashId, setFlashId] = useState<string | null>(null);
  const eventIdRef = useRef(0);

  /* Smooth counter */
  const targetTotalRef = useRef(proRata.total);
  const [displayTotal, setDisplayTotal] = useState(proRata.total);

  /* ── D3 projection + path + GeoJSON ── */
  const { pathGen, countries } = useMemo(() => {
    const topo = topology as unknown as Topology;
    const geo = feature(topo, topo.objects.countries) as unknown as FeatureCollection;
    const proj = geoNaturalEarth1()
      .fitSize([WIDTH, HEIGHT], geo)
      .translate([WIDTH / 2, HEIGHT / 2 + 10]);
    return {
      pathGen: geoPath().projection(proj),
      countries: geo.features as Feature<Geometry, { name?: string }>[],
    };
  }, []);

  const projectedHotspots = useMemo(() => {
    const proj = geoNaturalEarth1()
      .fitSize([WIDTH, HEIGHT], { type: "FeatureCollection", features: countries })
      .translate([WIDTH / 2, HEIGHT / 2 + 10]);
    return hotspots.map((h) => {
      const pt = proj(h.coords);
      return { ...h, x: pt?.[0] ?? 0, y: pt?.[1] ?? 0 };
    });
  }, [countries]);

  /* ── Simulation interval ── */
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;
    const startTimer = setTimeout(() => {
      intervalId = setInterval(() => {
        const n = Math.random() > 0.55 ? 2 : 1;
        const batch: SimEvent[] = [];
        let batchTotal = 0;
        const totalsUpd: Record<string, number> = {};

        for (let i = 0; i < n; i++) {
          const cid = weightedPicker[Math.floor(Math.random() * weightedPicker.length)];
          const cd = countryFraud[cid];
          const daily = (cd.lossM * YOY_GROWTH * 1_000_000) / 365;
          const amount = Math.round(daily * (0.0008 + Math.random() * 0.004));
          const status: SimEvent["status"] =
            Math.random() > 0.18 ? "blocked" : Math.random() > 0.5 ? "flagged" : "loss";
          eventIdRef.current++;
          batch.push({
            id: eventIdRef.current, countryId: cid, countryName: cd.name,
            iso2: cd.iso2, type: pickFraudType(cd), amount, time: new Date(), status,
          });
          totalsUpd[cid] = (totalsUpd[cid] || 0) + amount;
          batchTotal += amount;
        }

        setSimEvents((prev) => [...batch, ...prev].slice(0, 50));
        setDailyTotals((prev) => {
          const next = { ...prev };
          for (const [k, v] of Object.entries(totalsUpd)) next[k] = (next[k] || 0) + v;
          return next;
        });
        setTotalToday((prev) => prev + batchTotal);
        targetTotalRef.current += batchTotal;
        setFlashId(batch[batch.length - 1].countryId);
      }, 2800);
    }, 600);

    return () => { clearTimeout(startTimer); clearInterval(intervalId); };
  }, [weightedPicker, countryFraud]);

  /* Smooth counter animation */
  useEffect(() => {
    const tick = setInterval(() => {
      setDisplayTotal((prev) => {
        const target = targetTotalRef.current;
        const diff = target - prev;
        if (Math.abs(diff) < 50) return target;
        return Math.round(prev + diff * 0.12);
      });
    }, 60);
    return () => clearInterval(tick);
  }, []);

  /* ── Hover data ── */
  const hoveredData = hoveredCountry ? countryFraud[hoveredCountry] ?? null : null;

  /* ── Zoom / pan (fullscreen) ── */
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const mapRef = useRef<HTMLDivElement>(null);

  /* Clamp pan so the map always covers the full viewport */
  const clampPan = useCallback(
    (px: number, py: number, z: number) => {
      const el = mapRef.current;
      if (!el) return { x: px, y: py };
      const cw = el.clientWidth;
      const ch = el.clientHeight;
      // With slice + scale(z), the rendered map is cw*z × ch*z centered in the viewport.
      // Max pan = half the overflow in each axis.
      const maxPanX = Math.max(0, cw * (z - 1) / 2);
      const maxPanY = Math.max(0, ch * (z - 1) / 2);
      return {
        x: Math.max(-maxPanX, Math.min(maxPanX, px)),
        y: Math.max(-maxPanY, Math.min(maxPanY, py)),
      };
    },
    []
  );

  useEffect(() => {
    if (!fullscreen) return;
    const el = mapRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      setZoom((z) => {
        const newZ = Math.min(Math.max(z + (e.deltaY > 0 ? -0.08 : 0.08), 1), 5);
        // When zooming out, shrink the allowed pan range
        setPan((p) => clampPan(p.x, p.y, newZ));
        return newZ;
      });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [fullscreen, clampPan]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!fullscreen) return;
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      (e.target as Element).setPointerCapture(e.pointerId);
    },
    [fullscreen, pan]
  );
  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isPanning) return;
      const rawX = e.clientX - panStart.x;
      const rawY = e.clientY - panStart.y;
      setPan(clampPan(rawX, rawY, zoom));
    },
    [isPanning, panStart, zoom, clampPan]
  );
  const onPointerUp = useCallback(() => setIsPanning(false), []);

  /* ═══ SVG contents ═══ */
  const mapSvg = () => (
    <>
      <defs>
        <linearGradient id="flowGrad" x1="0%" y1="20%" x2="100%" y2="80%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.08" />
          <stop offset="50%" stopColor="#f472b6" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#34d399" stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id="scanGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0" />
          <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
        </linearGradient>
        <filter id="dotGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="3.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width={WIDTH} height={HEIGHT} fill="#F8F9FB" />

      {/* Grid — denser at higher zoom */}
      <g opacity="0.28" stroke="rgba(0,0,0,0.2)" strokeWidth={0.3 / zoom}>
        {Array.from({ length: zoom >= 3 ? 17 : 9 }, (_, i) => {
          const n = zoom >= 3 ? 18 : 10;
          const y = ((i + 1) / n) * HEIGHT;
          return <line key={`h${i}`} x1="0" y1={y} x2={WIDTH} y2={y} />;
        })}
        {Array.from({ length: zoom >= 3 ? 35 : 19 }, (_, i) => {
          const n = zoom >= 3 ? 36 : 20;
          const x = ((i + 1) / n) * WIDTH;
          return <line key={`v${i}`} x1={x} y1="0" x2={x} y2={HEIGHT} />;
        })}
      </g>

      {/* Country paths */}
      {countries.map((geo, i) => {
        const id = String((geo as any).id ?? i);
        const data = countryFraud[id];
        const d = pathGen(geo) ?? "";
        const isHovered = hoveredCountry === id;
        const isFlashing = flashId === id;
        const loss = data?.lossM ?? 0;

        return (
          <path
            key={id}
            d={d}
            fill={
              data
                ? lossFill(loss, isHovered ? 0.90 : isFlashing ? 0.78 : 0.62)
                : "#DDE1E8"
            }
            stroke={
              data
                ? (isHovered || isFlashing ? lossStroke(loss) : `${lossStroke(loss)}88`)
                : "rgba(0,0,0,0.14)"
            }
            strokeWidth={(isHovered ? 1.6 : isFlashing ? 1.2 : 0.5) / zoom}
            className="cursor-pointer"
            style={{
              transition:
                "fill 0.6s ease, stroke 0.5s ease, stroke-width 0.3s ease",
            }}
            onMouseEnter={() => setHoveredCountry(id)}
            onMouseLeave={() => setHoveredCountry(null)}
          />
        );
      })}

      {/* Country name labels — revealed progressively as zoom increases */}
      {zoom >= 2 && countries.map((geo, i) => {
        const id = String((geo as any).id ?? i);
        const data = countryFraud[id];
        if (!data) return null;
        const centroid = pathGen.centroid(geo as any);
        if (!centroid || isNaN(centroid[0]) || isNaN(centroid[1])) return null;
        const [cx, cy] = centroid;
        const fs = 7 / zoom;
        const showLoss = zoom >= 3;
        return (
          <g key={`label-${id}`} pointerEvents="none">
            <text x={cx} y={cy - (showLoss ? fs * 0.7 : 0)} textAnchor="middle"
                  fontSize={fs} fontWeight="600"
                  style={{ paintOrder: "stroke", stroke: "#F8F9FB", strokeWidth: 2.5 / zoom, strokeLinejoin: "round" as const }}
                  fill="#111111" opacity={0.85}>
              {data.iso2}
            </text>
            {showLoss && (
              <text x={cx} y={cy + fs * 1.1} textAnchor="middle"
                    fontSize={fs * 0.85} fontWeight="500"
                    style={{ paintOrder: "stroke", stroke: "#F8F9FB", strokeWidth: 2 / zoom, strokeLinejoin: "round" as const }}
                    fill={lossStroke(data.lossM)} opacity={0.9}>
                ${data.lossM}M
              </text>
            )}
          </g>
        );
      })}

      <rect width={WIDTH} height={HEIGHT} fill="url(#flowGrad)" pointerEvents="none" />

      {/* Scan line */}
      <rect x="0" width={WIDTH} height="6" fill="url(#scanGrad)" pointerEvents="none">
        <animate attributeName="y" from="-10" to={String(HEIGHT + 10)} dur="7s" repeatCount="indefinite" />
      </rect>

      {/* Connection arcs — glowing with flowing dashes */}
      {connections.map(([fromName, toName], i) => {
        const a = projectedHotspots.find((h) => h.name === fromName);
        const b = projectedHotspots.find((h) => h.name === toName);
        if (!a || !b) return null;
        const mx = (a.x + b.x) / 2;
        const my = Math.min(a.y, b.y) - 30;
        const d = `M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`;
        const dur = `${1.8 + (i % 4) * 0.4}s`;
        return (
          <g key={i} pointerEvents="none">
            {/* Wide glow halo */}
            <path
              d={d}
              fill="none"
              stroke="var(--accent-color)"
              strokeWidth="4"
              strokeOpacity="0.08"
              filter="url(#dotGlow)"
            />
            {/* Animated dashed core */}
            <path
              d={d}
              fill="none"
              stroke="var(--accent-color)"
              strokeWidth="1"
              strokeOpacity="0.5"
              strokeDasharray="4 6"
              filter="url(#dotGlow)"
            >
              <animate attributeName="stroke-dashoffset" from="0" to="-10" dur={dur} repeatCount="indefinite" />
              <animate attributeName="stroke-opacity" values="0.3;0.7;0.3" dur={dur} repeatCount="indefinite" />
            </path>
          </g>
        );
      })}

      {/* Hotspot dots */}
      {projectedHotspots.map((spot) => {
        const data = countryFraud[spot.cid];
        if (!data) return null;
        const active = hoveredHotspot === spot.name || hoveredCountry === spot.cid;
        const color = lossStroke(data.lossM);
        return (
          <g key={spot.name}>
            <circle cx={spot.x} cy={spot.y} r="5" fill="none" stroke={color} strokeWidth="0.6">
              <animate attributeName="r" values="4;13;4" dur="3.5s" repeatCount="indefinite" />
              <animate attributeName="stroke-opacity" values="0.5;0;0.5" dur="3.5s" repeatCount="indefinite" />
            </circle>
            <circle
              cx={spot.x} cy={spot.y} r={active ? 10 : 7}
              fill={color} fillOpacity={0.12} filter="url(#dotGlow)"
              style={{ transition: "r 0.3s ease" }} pointerEvents="none"
            />
            <circle
              cx={spot.x} cy={spot.y} r={active ? 3.5 : 2.5}
              fill={color} fillOpacity={0.9} className="cursor-pointer"
              style={{ transition: "r 0.3s ease" }}
              onMouseEnter={() => { setHoveredHotspot(spot.name); setHoveredCountry(spot.cid); }}
              onMouseLeave={() => { setHoveredHotspot(null); setHoveredCountry(null); }}
            />
            {active && (
              <>
                <text x={spot.x} y={spot.y - 18} textAnchor="middle" fill="var(--text-primary)"
                  fontSize="9" fontWeight="600" pointerEvents="none">{spot.name}</text>
                <text x={spot.x} y={spot.y - 9} textAnchor="middle" fill={color}
                  fontSize="7.5" fontWeight="500" pointerEvents="none">
                  ${data.lossM.toFixed(0)}M/yr
                </text>
              </>
            )}
          </g>
        );
      })}
    </>
  );

  /* ═══ Overlay panels ═══ */
  const liveStats = (
    <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
      <div className="flex items-center gap-1.5 bg-[var(--bg-elevated)]/85 backdrop-blur-sm border border-[var(--border-primary)] rounded-lg px-2.5 py-1.5">
        <span className="w-2 h-2 rounded-full bg-[var(--fraud-critical)] animate-alert-pulse shrink-0" />
        <span className="text-[10px] font-semibold text-[var(--fraud-critical)]">LIVE</span>
      </div>
      <div className="bg-[var(--bg-elevated)]/85 backdrop-blur-sm border border-[var(--border-primary)] rounded-lg px-2.5 py-1.5">
        <p className="text-[9px] text-[var(--text-tertiary)]">Projected Losses (2026)</p>
        <p className="text-sm font-semibold text-[var(--fraud-critical)]">
          ${(TOTAL_ANNUAL_LOSS_M * YOY_GROWTH / 1000).toFixed(2)}B
        </p>
      </div>
      <div className="bg-[var(--bg-elevated)]/85 backdrop-blur-sm border border-[var(--border-primary)] rounded-lg px-2.5 py-1.5">
        <p className="text-[9px] text-[var(--text-tertiary)]">Today&apos;s Losses</p>
        <p className="text-sm font-semibold text-[var(--fraud-warning)] tabular-nums">${Math.round(displayTotal).toLocaleString()}</p>
      </div>
      <div className="bg-[var(--bg-elevated)]/85 backdrop-blur-sm border border-[var(--border-primary)] rounded-lg px-2.5 py-1.5">
        <p className="text-[9px] text-[var(--text-tertiary)]">Countries Monitored</p>
        <p className="text-sm font-semibold text-[var(--accent-color)]">
          {Object.keys(countryFraud).length}
        </p>
      </div>
    </div>
  );

  const legendPanel = (
    <div className="absolute top-14 right-3 bg-[var(--bg-elevated)]/80 backdrop-blur-sm border border-[var(--border-primary)] rounded-lg px-2.5 py-2 text-[10px]">
      <p className="font-medium text-[var(--text-secondary)] mb-1.5">Annual Fraud Loss</p>
      {[
        { label: "\u2265 $200M",   color: "#7F1D1D" },
        { label: "$100\u2013200M", color: "#991B1B" },
        { label: "$50\u2013100M",  color: "#B91C1C" },
        { label: "$20\u201350M",   color: "#C2410C" },
        { label: "$10\u201320M",   color: "#D97706" },
        { label: "$5\u201310M",    color: "#4D7C0F" },
        { label: "< $5M",     color: "#16A34A" },
        { label: "No data",   color: "#94A3B8" },
      ].map(({ label, color }) => (
        <div key={label} className="flex items-center gap-1.5 mb-0.5">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
          <span className="text-[var(--text-tertiary)]">{label}</span>
        </div>
      ))}
    </div>
  );

  const countryPanel = hoveredData && (
    <div className="absolute bottom-3 left-3 bg-[var(--bg-elevated)]/92 backdrop-blur-sm border border-[var(--border-primary)] rounded-xl px-4 py-3 shadow-lg text-xs pointer-events-none animate-card-in min-w-[240px]">
      <div className="flex items-center gap-2">
        <span className="text-base">{isoToFlag(hoveredData.iso2)}</span>
        <div>
          <p className="font-semibold text-[var(--text-primary)] text-sm">{hoveredData.name}</p>
          <p className="text-[10px] text-[var(--text-tertiary)]">ISO {hoveredData.iso2}</p>
        </div>
      </div>

      <div className="mt-2 mb-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[var(--text-tertiary)]">Est. Loss (2026)</span>
          <span className="font-semibold" style={{ color: lossStroke(hoveredData.lossM) }}>
            ${(hoveredData.lossM * YOY_GROWTH).toFixed(1)}M
          </span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${Math.min(100, (hoveredData.lossM * YOY_GROWTH / 661) * 100)}%`,
              backgroundColor: lossStroke(hoveredData.lossM),
            }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between mb-2">
        <span className="text-[var(--text-tertiary)]">Fraud Rate (% TPV)</span>
        <span className="font-medium text-[var(--accent-color)]">
          {(hoveredData.rate * 100).toFixed(3)}%
        </span>
      </div>

      <p className="text-[10px] text-[var(--text-tertiary)] mb-1.5 font-medium uppercase tracking-wider">
        Fraud Breakdown
      </p>
      <div className="space-y-1">
        {([
          { label: "APP",          pct: hoveredData.app,    color: "var(--fraud-critical)" },
          { label: "Unauthorized", pct: hoveredData.unauth, color: "#f97316" },
          { label: "First Party",  pct: hoveredData.fp,     color: "var(--fraud-review)" },
          { label: "ATO",          pct: hoveredData.ato,    color: "var(--accent-color)" },
        ] as const).map(({ label, pct, color }) => (
          <div key={label} className="flex items-center gap-2">
            <span className="text-[var(--text-tertiary)] w-[60px] text-[10px]">{label}</span>
            <div className="flex-1 h-1 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
            </div>
            <span className="text-[10px] text-[var(--text-secondary)] w-7 text-right">{pct}%</span>
          </div>
        ))}
      </div>

      <div className="mt-2 pt-2 border-t border-[var(--border-primary)] flex items-center justify-between">
        <span className="text-[var(--text-tertiary)]">Today&apos;s Losses</span>
        <span className="font-semibold text-[var(--fraud-warning)]">
          {fmtUSD(dailyTotals[hoveredCountry!] || 0)}
        </span>
      </div>
    </div>
  );

  const activityFeed = (
    <div className="absolute bottom-3 right-3 bg-[var(--bg-elevated)]/85 backdrop-blur-sm border border-[var(--border-primary)] rounded-xl p-2.5 w-[255px] pointer-events-none">
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--fraud-critical)] animate-alert-pulse shrink-0" />
        <span className="text-[10px] font-medium text-[var(--text-secondary)]">Live Activity</span>
      </div>
      <div className="space-y-0.5">
        {simEvents.slice(0, 5).map((ev) => (
          <div key={ev.id} className="flex items-center gap-1.5 text-[10px] py-0.5 animate-card-in">
            <span className="text-[var(--text-tertiary)] w-[52px] font-mono text-[9px]">
              {fmtTime(ev.time)}
            </span>
            <span className="w-[42px] font-medium truncate" style={{ color: fraudColor(ev.type) }}>
              {ev.type}
            </span>
            <span className="text-[var(--text-secondary)] w-5">{ev.iso2}</span>
            <span className="ml-auto font-medium text-[var(--fraud-critical)]">
              +{fmtUSD(ev.amount)}
            </span>
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                ev.status === "blocked"
                  ? "bg-[var(--fraud-cleared)]"
                  : ev.status === "flagged"
                  ? "bg-[var(--fraud-warning)]"
                  : "bg-[var(--fraud-critical)]"
              }`}
            />
          </div>
        ))}
        {simEvents.length === 0 && (
          <p className="text-[10px] text-[var(--text-tertiary)] italic">Initializing feed...</p>
        )}
      </div>
    </div>
  );

  /* ── Zoom controls (shared) ── */
  const zoomControls = (
    <div className="absolute top-3 right-3 flex flex-col gap-1 z-10">
      <button
        onClick={() => setZoom((z) => { const nz = Math.min(z + 0.6, 7); setPan((p) => clampPan(p.x, p.y, nz)); return nz; })}
        className="w-7 h-7 rounded-md bg-white/90 backdrop-blur-sm flex items-center justify-center text-sm font-bold text-[var(--text-primary)] hover:bg-white transition-colors"
        style={{ boxShadow: "var(--card-shadow)" }}
      >+</button>
      <button
        onClick={() => setZoom((z) => { const nz = Math.max(z - 0.6, 1); setPan((p) => clampPan(p.x, p.y, nz)); return nz; })}
        className="w-7 h-7 rounded-md bg-white/90 backdrop-blur-sm flex items-center justify-center text-sm font-bold text-[var(--text-primary)] hover:bg-white transition-colors"
        style={{ boxShadow: "var(--card-shadow)" }}
      >−</button>
      {zoom > 1.05 && (
        <button
          onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
          className="w-7 h-7 rounded-md flex items-center justify-center hover:opacity-90 transition-opacity text-white text-[10px] font-bold"
          style={{ backgroundColor: "#F97316", boxShadow: "var(--card-shadow)" }}
          title="Reset zoom"
        >1×</button>
      )}
    </div>
  );

  const zoomIndicator = (
    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none">
      {zoom > 1.05 ? (
        <span className="inline-block bg-white/80 backdrop-blur-sm rounded-md px-2 py-0.5 text-[10px] font-mono font-semibold text-[var(--text-secondary)]">{zoom.toFixed(1)}×</span>
      ) : (
        <span className="inline-block bg-white/70 backdrop-blur-sm rounded-md px-2 py-0.5 text-[9px] text-[var(--text-tertiary)]">Scroll to zoom · drag to pan</span>
      )}
    </div>
  );

  /* ═══ Fullscreen ═══ */
  if (fullscreen) {
    return (
      <div
        ref={mapRef}
        className="absolute inset-0 overflow-hidden bg-[var(--bg-secondary)]"
        style={{ cursor: isPanning ? "grabbing" : "grab" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="xMidYMid slice"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "center center",
          }}
        >
          {mapSvg()}
        </svg>
        {liveStats}
        {zoomControls}
        {zoomIndicator}
        {countryPanel}
        {legendPanel}
        {activityFeed}
      </div>
    );
  }

  /* ═══ Normal layout ═══ */
  return (
    <div
      ref={mapRef}
      className="relative bg-[var(--bg-primary)] rounded-xl overflow-hidden select-none"
      style={{
        height: "calc(100vh - 200px)",
        minHeight: 420,
        boxShadow: "var(--card-shadow)",
        cursor: isPanning ? "grabbing" : zoom > 1 ? "grab" : "default",
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: "center center",
          transition: isPanning ? "none" : "transform 0.08s ease-out",
        }}
      >
        {mapSvg()}
      </svg>
      {liveStats}
      {zoomControls}
      {zoomIndicator}
      {countryPanel}
      {legendPanel}
      {activityFeed}
    </div>
  );
}
