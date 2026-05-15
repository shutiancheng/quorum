"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { geoNaturalEarth1, geoPath, geoCentroid } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology } from "topojson-specification";
import type { FeatureCollection, Feature, Geometry } from "geojson";
import topology from "@/data/countries-110m.json";

/* ── Region fraud data (synthetic) ── */
const regionData: Record<
  string,
  { name: string; cases: number; blocked: number; risk: number }
> = {
  na: { name: "North America", cases: 3420, blocked: 2980, risk: 0.82 },
  sa: { name: "South America", cases: 1280, blocked: 1050, risk: 0.45 },
  eu: { name: "Europe", cases: 4100, blocked: 3650, risk: 0.91 },
  af: { name: "Africa", cases: 890, blocked: 710, risk: 0.32 },
  ru: {
    name: "Russia & Central Asia",
    cases: 1840,
    blocked: 1520,
    risk: 0.65,
  },
  me: { name: "Middle East", cases: 1560, blocked: 1280, risk: 0.58 },
  sa_asia: { name: "South Asia", cases: 2340, blocked: 1980, risk: 0.71 },
  ea: { name: "East Asia", cases: 3890, blocked: 3420, risk: 0.87 },
  sea: { name: "Southeast Asia", cases: 1780, blocked: 1450, risk: 0.62 },
  oc: { name: "Oceania", cases: 720, blocked: 640, risk: 0.28 },
};

/* ── ISO 3166-1 numeric → region ── */
const countryToRegion: Record<string, string> = {
  // North America
  "840": "na","124": "na","484": "na","044": "na","052": "na","084": "na",
  "188": "na","192": "na","212": "na","214": "na","222": "na","308": "na",
  "320": "na","332": "na","340": "na","388": "na","558": "na","591": "na",
  "659": "na","662": "na","670": "na","780": "na","304": "na","630": "na",
  // South America
  "032": "sa","068": "sa","076": "sa","152": "sa","170": "sa","218": "sa",
  "254": "sa","328": "sa","600": "sa","604": "sa","740": "sa","858": "sa",
  "862": "sa",
  // Europe
  "008": "eu","020": "eu","040": "eu","056": "eu","070": "eu","100": "eu",
  "191": "eu","196": "eu","203": "eu","208": "eu","233": "eu","246": "eu",
  "250": "eu","276": "eu","300": "eu","348": "eu","352": "eu","372": "eu",
  "380": "eu","428": "eu","440": "eu","442": "eu","807": "eu","470": "eu",
  "498": "eu","492": "eu","499": "eu","528": "eu","578": "eu","616": "eu",
  "620": "eu","642": "eu","688": "eu","703": "eu","705": "eu","724": "eu",
  "752": "eu","756": "eu","826": "eu","804": "eu","112": "eu",
  // Russia & Central Asia
  "643": "ru","398": "ru","860": "ru","795": "ru","417": "ru","762": "ru",
  "496": "ru","268": "ru","051": "ru","031": "ru",
  // Middle East
  "792": "me","682": "me","784": "me","634": "me","414": "me","048": "me",
  "512": "me","887": "me","368": "me","760": "me","400": "me","422": "me",
  "376": "me","275": "me","364": "me",
  // South Asia
  "356": "sa_asia","586": "sa_asia","050": "sa_asia","144": "sa_asia",
  "524": "sa_asia","064": "sa_asia","004": "sa_asia","462": "sa_asia",
  // East Asia
  "156": "ea","392": "ea","410": "ea","408": "ea","158": "ea",
  // Southeast Asia
  "764": "sea","704": "sea","458": "sea","360": "sea","608": "sea",
  "104": "sea","116": "sea","418": "sea","702": "sea","096": "sea",
  "626": "sea",
  // Oceania
  "036": "oc","554": "oc","598": "oc","242": "oc","090": "oc","548": "oc",
  "882": "oc","776": "oc","296": "oc","540": "oc",
  // Africa
  "012": "af","024": "af","204": "af","072": "af","854": "af","108": "af",
  "120": "af","132": "af","140": "af","148": "af","174": "af","178": "af",
  "180": "af","262": "af","818": "af","226": "af","232": "af","748": "af",
  "231": "af","266": "af","270": "af","288": "af","324": "af","624": "af",
  "384": "af","404": "af","426": "af","430": "af","434": "af","450": "af",
  "454": "af","466": "af","478": "af","480": "af","504": "af","508": "af",
  "516": "af","562": "af","566": "af","646": "af","678": "af","686": "af",
  "694": "af","706": "af","710": "af","728": "af","729": "af","834": "af",
  "768": "af","788": "af","800": "af","894": "af","716": "af","732": "af",
};

/* ── Hotspot cities ── */
const hotspots = [
  { name: "New York", coords: [-74, 40.7] as [number, number], region: "na" },
  { name: "London", coords: [-0.1, 51.5] as [number, number], region: "eu" },
  { name: "Frankfurt", coords: [8.7, 50.1] as [number, number], region: "eu" },
  { name: "Lagos", coords: [3.4, 6.5] as [number, number], region: "af" },
  { name: "Dubai", coords: [55.3, 25.2] as [number, number], region: "me" },
  { name: "Mumbai", coords: [72.9, 19.0] as [number, number], region: "sa_asia" },
  { name: "Shanghai", coords: [121.5, 31.2] as [number, number], region: "ea" },
  { name: "Tokyo", coords: [139.7, 35.7] as [number, number], region: "ea" },
  { name: "Singapore", coords: [103.8, 1.35] as [number, number], region: "sea" },
  { name: "São Paulo", coords: [-46.6, -23.5] as [number, number], region: "sa" },
  { name: "Sydney", coords: [151.2, -33.9] as [number, number], region: "oc" },
  { name: "Moscow", coords: [37.6, 55.8] as [number, number], region: "ru" },
];

const connections: [string, string][] = [
  ["London", "New York"],
  ["London", "Frankfurt"],
  ["London", "Dubai"],
  ["Dubai", "Mumbai"],
  ["Shanghai", "Tokyo"],
  ["Shanghai", "Singapore"],
  ["New York", "São Paulo"],
  ["Moscow", "Shanghai"],
  ["Lagos", "London"],
];

/* ── Deterministic per-country data from region totals ── */
function seededRand(seed: number) {
  let x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

type CountryStats = {
  name: string;
  region: string;
  cases: number;
  blocked: number;
  risk: number;
  blockRate: number;
};

function getCountryStats(
  isoId: string,
  countryName: string
): CountryStats | null {
  const regionId = countryToRegion[isoId];
  if (!regionId) return null;
  const region = regionData[regionId];
  // Count how many countries share this region
  const siblings = Object.values(countryToRegion).filter(
    (r) => r === regionId
  ).length;
  const seed = parseInt(isoId, 10);
  const weight = 0.3 + seededRand(seed) * 1.4; // 0.3–1.7x
  const baseCases = Math.round((region.cases / siblings) * weight);
  const riskVariance = (seededRand(seed + 99) - 0.5) * 0.2;
  const countryRisk = Math.min(1, Math.max(0.05, region.risk + riskVariance));
  const countryBlocked = Math.round(baseCases * (0.7 + seededRand(seed + 50) * 0.25));
  return {
    name: countryName,
    region: region.name,
    cases: Math.max(1, baseCases),
    blocked: Math.min(countryBlocked, baseCases),
    risk: countryRisk,
    blockRate: baseCases > 0 ? countryBlocked / baseCases : 0,
  };
}

/* ── Colour helpers ── */
function riskColor(risk: number) {
  if (risk >= 0.8) return "var(--fraud-critical)";
  if (risk >= 0.6) return "var(--fraud-warning)";
  if (risk >= 0.4) return "var(--accent-color)";
  return "var(--fraud-cleared)";
}

function riskFill(risk: number, opacity = 0.55) {
  // Inline rgba so SVG fills work without CSS var interpolation issues
  if (risk >= 0.8) return `rgba(220,38,38,${opacity})`;
  if (risk >= 0.6) return `rgba(245,158,11,${opacity})`;
  if (risk >= 0.4) return `rgba(120,132,167,${opacity})`;
  return `rgba(22,163,74,${opacity})`;
}

/* ── Map dimensions ── */
const WIDTH = 960;
const HEIGHT = 500;

export default function WorldMapView({ fullscreen = false }: { fullscreen?: boolean }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  /* Build projection + path generator + GeoJSON features once */
  const { pathGen, countries } = useMemo(() => {
    const topo = topology as unknown as Topology;
    const geo = feature(
      topo,
      topo.objects.countries
    ) as unknown as FeatureCollection;

    const proj = geoNaturalEarth1()
      .fitSize([WIDTH, HEIGHT], geo)
      .translate([WIDTH / 2, HEIGHT / 2 + 10]);

    const pg = geoPath().projection(proj);

    return {
      pathGen: pg,
      countries: geo.features as Feature<Geometry, { name?: string }>[],
      projection: proj,
    };
  }, []);

  /* Project hotspot coordinates to SVG pixels */
  const projectedHotspots = useMemo(() => {
    const proj = geoNaturalEarth1()
      .fitSize([WIDTH, HEIGHT], {
        type: "FeatureCollection",
        features: countries,
      })
      .translate([WIDTH / 2, HEIGHT / 2 + 10]);

    return hotspots.map((h) => {
      const pt = proj(h.coords);
      return { ...h, x: pt?.[0] ?? 0, y: pt?.[1] ?? 0 };
    });
  }, [countries]);

  const totalCases = Object.values(regionData).reduce(
    (s, r) => s + r.cases,
    0
  );
  const totalBlocked = Object.values(regionData).reduce(
    (s, r) => s + r.blocked,
    0
  );
  /* Per-country stats for hovered country */
  const hoveredCountryStats = useMemo(() => {
    if (!hoveredCountry) return null;
    const feat = countries.find(
      (g) => String((g as any).id) === hoveredCountry
    );
    const name = (feat as any)?.properties?.name ?? "Unknown";
    return getCountryStats(hoveredCountry, name);
  }, [hoveredCountry, countries]);

  /* ── zoom / pan state (fullscreen only) ── */
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const mapContainerRef = useRef<HTMLDivElement>(null);

  /* Native wheel listener with { passive: false } so preventDefault works for pinch */
  useEffect(() => {
    if (!fullscreen) return;
    const el = mapContainerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.08 : 0.08;
      setZoom((z) => Math.min(Math.max(z + delta, 0.5), 5));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [fullscreen]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!fullscreen) return;
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      (e.target as Element).setPointerCapture(e.pointerId);
    },
    [fullscreen, pan]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isPanning) return;
      setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
    },
    [isPanning, panStart]
  );

  const handlePointerUp = useCallback(() => setIsPanning(false), []);

  const stats = [
    {
      label: "Global Cases",
      value: totalCases.toLocaleString(),
      color: "var(--fraud-critical)",
    },
    {
      label: "Blocked",
      value: totalBlocked.toLocaleString(),
      color: "var(--fraud-cleared)",
    },
    {
      label: "Block Rate",
      value: `${((totalBlocked / totalCases) * 100).toFixed(1)}%`,
      color: "var(--accent-color)",
    },
    {
      label: "Active Regions",
      value: Object.keys(regionData).length.toString(),
      color: "var(--fraud-review)",
    },
  ];

  /* ── Shared SVG internals ── */
  const mapSvgContents = () => (
    <>
      <defs>
        <linearGradient id="flowGrad" x1="0%" y1="20%" x2="100%" y2="80%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.10" />
          <stop offset="25%" stopColor="#818cf8" stopOpacity="0.14" />
          <stop offset="50%" stopColor="#f472b6" stopOpacity="0.12" />
          <stop offset="75%" stopColor="#fbbf24" stopOpacity="0.10" />
          <stop offset="100%" stopColor="#34d399" stopOpacity="0.08" />
        </linearGradient>
        <filter id="dotGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="3.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width={WIDTH} height={HEIGHT} fill="var(--bg-secondary)" rx="0" />

      <g opacity="0.12" stroke="var(--border-secondary)" strokeWidth="0.4">
        {Array.from({ length: 9 }, (_, i) => {
          const y = ((i + 1) / 10) * HEIGHT;
          return <line key={`h${i}`} x1="0" y1={y} x2={WIDTH} y2={y} />;
        })}
        {Array.from({ length: 19 }, (_, i) => {
          const x = ((i + 1) / 20) * WIDTH;
          return <line key={`v${i}`} x1={x} y1="0" x2={x} y2={HEIGHT} />;
        })}
      </g>

      {countries.map((geo, i) => {
        const id = String((geo as any).id ?? i);
        const regionId = countryToRegion[id];
        const data = regionId ? regionData[regionId] : null;
        const d = pathGen(geo) ?? "";
        const isCountryHovered = hoveredCountry === id;
        return (
          <path
            key={id}
            d={d}
            fill={data ? riskFill(data.risk, isCountryHovered ? 0.75 : 0.4) : "var(--bg-tertiary)"}
            stroke={isCountryHovered ? riskColor(data?.risk ?? 0) : "var(--border-primary)"}
            strokeWidth={isCountryHovered ? 1.4 : 0.4}
            className="cursor-pointer"
            style={{ transition: "fill 0.25s ease, stroke-width 0.25s ease" }}
            onMouseEnter={() => {
              if (regionId) setHovered(regionId);
              setHoveredCountry(id);
            }}
            onMouseLeave={() => {
              setHovered(null);
              setHoveredCountry(null);
            }}
          />
        );
      })}

      <rect width={WIDTH} height={HEIGHT} fill="url(#flowGrad)" pointerEvents="none" />

      {connections.map(([fromName, toName], i) => {
        const a = projectedHotspots.find((h) => h.name === fromName);
        const b = projectedHotspots.find((h) => h.name === toName);
        if (!a || !b) return null;
        const mx = (a.x + b.x) / 2;
        const my = Math.min(a.y, b.y) - 30;
        return (
          <path
            key={i}
            d={`M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`}
            fill="none"
            stroke="var(--accent-color)"
            strokeWidth="0.8"
            strokeOpacity="0.22"
            strokeDasharray="5 3"
            pointerEvents="none"
          />
        );
      })}

      {projectedHotspots.map((spot) => {
        const data = regionData[spot.region];
        if (!data) return null;
        const active = hovered === spot.region;
        const color = riskColor(data.risk);
        return (
          <g key={spot.name}>
            <circle cx={spot.x} cy={spot.y} r="5" fill="none" stroke={color} strokeWidth="0.6">
              <animate attributeName="r" values="4;13;4" dur="3.5s" repeatCount="indefinite" />
              <animate attributeName="stroke-opacity" values="0.5;0;0.5" dur="3.5s" repeatCount="indefinite" />
            </circle>
            <circle cx={spot.x} cy={spot.y} r={active ? 10 : 7} fill={color} fillOpacity={0.12} filter="url(#dotGlow)" style={{ transition: "r 0.3s ease" }} pointerEvents="none" />
            <circle cx={spot.x} cy={spot.y} r={active ? 3.5 : 2.5} fill={color} fillOpacity={0.9} className="cursor-pointer" style={{ transition: "r 0.3s ease" }} onMouseEnter={() => setHovered(spot.region)} onMouseLeave={() => setHovered(null)} />
            {active && (
              <text x={spot.x} y={spot.y - 14} textAnchor="middle" fill="var(--text-primary)" fontSize="9" fontWeight="600" pointerEvents="none">
                {spot.name}
              </text>
            )}
          </g>
        );
      })}
    </>
  );

  /* ── Shared overlays ── */
  const countryPanel = hoveredCountryStats && (
    <div className="absolute bottom-3 left-3 bg-[var(--bg-elevated)]/90 backdrop-blur-sm border border-[var(--border-primary)] rounded-xl px-4 py-3 shadow-lg text-xs pointer-events-none animate-card-in min-w-[200px]">
      <p className="font-semibold text-[var(--text-primary)] text-sm">
        {hoveredCountryStats.name}
      </p>
      <p className="text-[10px] text-[var(--text-tertiary)] mb-2">
        {hoveredCountryStats.region}
      </p>

      {/* Risk bar */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[var(--text-tertiary)]">Risk Score</span>
          <span className="font-semibold" style={{ color: riskColor(hoveredCountryStats.risk) }}>
            {(hoveredCountryStats.risk * 100).toFixed(0)}%
          </span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${hoveredCountryStats.risk * 100}%`,
              backgroundColor: riskColor(hoveredCountryStats.risk),
            }}
          />
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        <div>
          <span className="text-[var(--text-tertiary)]">Cases</span>
          <p className="text-[var(--fraud-critical)] font-medium">
            {hoveredCountryStats.cases.toLocaleString()}
          </p>
        </div>
        <div>
          <span className="text-[var(--text-tertiary)]">Blocked</span>
          <p className="text-[var(--fraud-cleared)] font-medium">
            {hoveredCountryStats.blocked.toLocaleString()}
          </p>
        </div>
        <div>
          <span className="text-[var(--text-tertiary)]">Block Rate</span>
          <p className="text-[var(--accent-color)] font-medium">
            {(hoveredCountryStats.blockRate * 100).toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  );

  const legendOverlay = (
    <div className="absolute top-3 right-3 bg-[var(--bg-elevated)]/80 backdrop-blur-sm border border-[var(--border-primary)] rounded-lg px-2.5 py-2 text-[10px]">
      <p className="font-medium text-[var(--text-secondary)] mb-1.5">Risk Level</p>
      {[
        { label: "Critical  ≥ 80%", color: "var(--fraud-critical)" },
        { label: "High  60–80%", color: "var(--fraud-warning)" },
        { label: "Medium  40–60%", color: "var(--accent-color)" },
        { label: "Low  < 40%", color: "var(--fraud-cleared)" },
      ].map(({ label, color }) => (
        <div key={label} className="flex items-center gap-1.5 mb-0.5">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
          <span className="text-[var(--text-tertiary)]">{label}</span>
        </div>
      ))}
    </div>
  );

  /* ── Immersive fullscreen layout ── */
  if (fullscreen) {
    return (
      <div
        ref={mapContainerRef}
        className="flex-1 relative overflow-hidden bg-[var(--bg-secondary)]"
        style={{ cursor: isPanning ? "grabbing" : "grab" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
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
          {mapSvgContents()}
        </svg>

        {/* Overlay stats */}
        <div className="absolute top-3 left-3 flex gap-2 pointer-events-none">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-[var(--bg-elevated)]/80 backdrop-blur-sm border border-[var(--border-primary)] rounded-lg px-2.5 py-1.5"
            >
              <p className="text-[10px] text-[var(--text-tertiary)]">{stat.label}</p>
              <p className="text-sm font-semibold" style={{ color: stat.color }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {countryPanel}
        {legendOverlay}

        {/* Zoom hint */}
        <div className="absolute bottom-3 right-3 text-[10px] text-[var(--text-tertiary)] bg-[var(--bg-elevated)]/70 backdrop-blur-sm rounded-md px-2 py-1 pointer-events-none">
          Pinch to zoom · Drag to pan
        </div>
      </div>
    );
  }

  /* ── Normal (non-fullscreen) layout ── */
  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-primary)] p-3"
          >
            <p className="text-xs text-[var(--text-tertiary)]">{stat.label}</p>
            <p
              className="text-lg font-semibold mt-0.5"
              style={{ color: stat.color }}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Map */}
      <div className="relative bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-primary)] shadow-[var(--card-shadow)] overflow-hidden">
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-auto block">
          {mapSvgContents()}
        </svg>
        {countryPanel}
        {legendOverlay}
      </div>
    </div>
  );
}
