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

/* Data is now fetched from Supabase and passed via props */

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

function lossFill(lossM: number, alpha = 0.5): string {
  if (lossM >= 200) return `rgba(220,38,38,${alpha})`;
  if (lossM >= 100) return `rgba(239,68,68,${alpha * 0.92})`;
  if (lossM >= 50)  return `rgba(249,115,22,${alpha * 0.85})`;
  if (lossM >= 20)  return `rgba(245,158,11,${alpha * 0.78})`;
  if (lossM >= 10)  return `rgba(234,179,8,${alpha * 0.68})`;
  if (lossM >= 5)   return `rgba(132,204,22,${alpha * 0.58})`;
  if (lossM > 0)    return `rgba(74,222,128,${alpha * 0.48})`;
  return `rgba(100,116,139,${alpha * 0.25})`;
}

function lossStroke(lossM: number): string {
  if (lossM >= 200) return "var(--fraud-critical)";
  if (lossM >= 100) return "#ef4444";
  if (lossM >= 50)  return "#f97316";
  if (lossM >= 20)  return "var(--fraud-warning)";
  if (lossM >= 10)  return "#eab308";
  if (lossM >= 5)   return "#84cc16";
  if (lossM > 0)    return "var(--fraud-cleared)";
  return "var(--border-primary)";
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
  countryFraud,
}: {
  fullscreen?: boolean;
  countryFraud: Record<string, CountryFraud>;
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

      <rect width={WIDTH} height={HEIGHT} fill="var(--bg-secondary)" />

      {/* Grid */}
      <g opacity="0.10" stroke="var(--border-secondary)" strokeWidth="0.4">
        {Array.from({ length: 9 }, (_, i) => {
          const y = ((i + 1) / 10) * HEIGHT;
          return <line key={`h${i}`} x1="0" y1={y} x2={WIDTH} y2={y} />;
        })}
        {Array.from({ length: 19 }, (_, i) => {
          const x = ((i + 1) / 20) * WIDTH;
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
                ? lossFill(loss, isHovered ? 0.78 : isFlashing ? 0.65 : 0.45)
                : "var(--bg-tertiary)"
            }
            stroke={
              (isHovered || isFlashing) && data
                ? lossStroke(loss)
                : "var(--border-primary)"
            }
            strokeWidth={isHovered ? 1.6 : isFlashing ? 1.2 : 0.4}
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
        { label: "\u2265 $200M",   color: "var(--fraud-critical)" },
        { label: "$100\u2013200M", color: "#ef4444" },
        { label: "$50\u2013100M",  color: "#f97316" },
        { label: "$20\u201350M",   color: "var(--fraud-warning)" },
        { label: "$10\u201320M",   color: "#eab308" },
        { label: "$5\u201310M",    color: "#84cc16" },
        { label: "< $5M",          color: "var(--fraud-cleared)" },
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
        {countryPanel}
        {legendPanel}
        {activityFeed}
        <div className="absolute bottom-14 right-3 text-[10px] text-[var(--text-tertiary)] bg-[var(--bg-elevated)]/70 backdrop-blur-sm rounded-md px-2 py-1 pointer-events-none">
          Pinch to zoom &middot; Drag to pan
        </div>
      </div>
    );
  }

  /* ═══ Normal layout ═══ */
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Projected Losses (2026)", value: `$${(TOTAL_ANNUAL_LOSS_M * YOY_GROWTH / 1000).toFixed(2)}B`, color: "var(--fraud-critical)" },
          { label: "Today\u2019s Losses", value: `$${Math.round(displayTotal).toLocaleString()}`, color: "var(--fraud-warning)" },
          { label: "Countries Monitored", value: String(Object.keys(countryFraud).length), color: "var(--accent-color)" },
          { label: "Avg Block Rate", value: "82.3%", color: "var(--fraud-cleared)" },
        ].map((s) => (
          <div key={s.label} className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-primary)] p-3">
            <p className="text-xs text-[var(--text-tertiary)]">{s.label}</p>
            <p className="text-lg font-semibold mt-0.5" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="relative bg-[var(--bg-primary)] rounded-xl border border-[var(--border-primary)] shadow-[var(--card-shadow)] overflow-hidden">
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-auto block">
          {mapSvg()}
        </svg>
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-[var(--bg-elevated)]/85 backdrop-blur-sm border border-[var(--border-primary)] rounded-lg px-2.5 py-1.5 pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-[var(--fraud-critical)] animate-alert-pulse shrink-0" />
          <span className="text-[10px] font-semibold text-[var(--fraud-critical)]">LIVE</span>
        </div>
        {countryPanel}
        {legendPanel}
        {activityFeed}
      </div>
    </div>
  );
}
