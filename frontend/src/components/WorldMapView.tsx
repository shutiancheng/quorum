"use client";

import { useState } from "react";

const regionData: Record<
  string,
  { name: string; cases: number; blocked: number; risk: number }
> = {
  na: { name: "North America", cases: 3420, blocked: 2980, risk: 0.82 },
  sa: { name: "South America", cases: 1280, blocked: 1050, risk: 0.45 },
  eu: { name: "Europe", cases: 4100, blocked: 3650, risk: 0.91 },
  af: { name: "Africa", cases: 890, blocked: 710, risk: 0.32 },
  ru: { name: "Russia & Central Asia", cases: 1840, blocked: 1520, risk: 0.65 },
  me: { name: "Middle East", cases: 1560, blocked: 1280, risk: 0.58 },
  sa_asia: { name: "South Asia", cases: 2340, blocked: 1980, risk: 0.71 },
  ea: { name: "East Asia", cases: 3890, blocked: 3420, risk: 0.87 },
  sea: { name: "Southeast Asia", cases: 1780, blocked: 1450, risk: 0.62 },
  oc: { name: "Oceania", cases: 720, blocked: 640, risk: 0.28 },
};

/* Simplified region outlines — viewBox 0 0 1000 500, equirectangular style */
const regions = [
  {
    id: "na",
    path: "M 80 55 L 120 42 L 155 45 L 200 50 L 250 60 L 290 75 L 320 100 L 310 120 L 300 140 L 285 160 L 275 178 L 255 195 L 240 200 L 220 198 L 210 195 L 190 185 L 175 160 L 160 135 L 155 115 L 130 95 L 100 82 L 80 75 Z",
  },
  {
    id: "gl",
    path: "M 340 35 L 365 25 L 385 30 L 395 45 L 390 60 L 378 70 L 358 72 L 345 62 L 340 48 Z",
  },
  {
    id: "sa",
    path: "M 290 235 L 310 228 L 330 225 L 355 232 L 380 248 L 395 265 L 392 290 L 385 310 L 370 330 L 355 348 L 340 368 L 325 385 L 315 390 L 305 382 L 298 365 L 295 340 L 290 310 L 285 285 L 280 265 L 278 250 Z",
  },
  {
    id: "eu",
    path: "M 465 85 L 478 78 L 495 72 L 510 68 L 530 62 L 545 58 L 555 60 L 568 65 L 575 72 L 572 82 L 570 95 L 565 108 L 558 118 L 550 128 L 540 135 L 530 140 L 518 138 L 508 140 L 500 138 L 492 142 L 485 140 L 478 132 L 470 120 L 465 108 L 463 95 Z",
  },
  {
    id: "af",
    path: "M 460 172 L 478 165 L 498 160 L 518 158 L 538 160 L 558 165 L 575 172 L 590 185 L 600 200 L 608 220 L 610 242 L 608 265 L 600 288 L 588 308 L 575 325 L 560 338 L 545 342 L 530 335 L 518 322 L 508 305 L 498 285 L 488 265 L 478 245 L 468 225 L 460 205 L 458 188 Z",
  },
  {
    id: "ru",
    path: "M 575 72 L 600 60 L 640 52 L 700 48 L 760 46 L 820 48 L 870 52 L 910 58 L 940 68 L 950 78 L 942 88 L 930 95 L 900 102 L 865 108 L 820 112 L 770 115 L 720 116 L 680 118 L 645 120 L 615 115 L 595 108 L 580 98 L 575 85 Z",
  },
  {
    id: "me",
    path: "M 590 140 L 610 132 L 632 135 L 650 142 L 658 155 L 655 170 L 645 180 L 628 185 L 612 182 L 598 175 L 590 162 L 588 150 Z",
  },
  {
    id: "sa_asia",
    path: "M 668 148 L 690 142 L 712 145 L 728 155 L 730 170 L 725 188 L 715 205 L 700 215 L 688 218 L 678 210 L 670 195 L 665 178 L 665 162 Z",
  },
  {
    id: "ea",
    path: "M 730 102 L 758 95 L 790 98 L 820 105 L 845 112 L 862 122 L 868 138 L 862 152 L 848 162 L 830 172 L 808 178 L 788 178 L 768 172 L 750 162 L 738 148 L 732 132 L 730 118 Z",
  },
  {
    id: "jp",
    path: "M 878 118 L 886 112 L 892 118 L 894 132 L 890 148 L 884 156 L 876 150 L 874 138 L 876 128 Z",
  },
  {
    id: "sea",
    path: "M 758 192 L 778 185 L 798 188 L 818 195 L 828 208 L 825 222 L 815 232 L 798 235 L 778 232 L 762 222 L 755 210 Z",
  },
  {
    id: "idn",
    path: "M 785 242 L 810 238 L 840 240 L 862 244 L 870 252 L 865 260 L 845 262 L 820 260 L 798 258 L 782 254 L 780 248 Z",
  },
  {
    id: "oc",
    path: "M 838 292 L 862 282 L 888 280 L 908 288 L 918 302 L 920 320 L 912 338 L 898 348 L 880 352 L 862 348 L 848 338 L 840 322 L 836 308 Z",
  },
  {
    id: "nz",
    path: "M 938 335 L 944 328 L 948 338 L 946 352 L 940 360 L 934 354 L 936 342 Z",
  },
];

const regionParent: Record<string, string> = {
  gl: "na",
  jp: "ea",
  idn: "sea",
  nz: "oc",
  na: "na",
  sa: "sa",
  eu: "eu",
  af: "af",
  ru: "ru",
  me: "me",
  sa_asia: "sa_asia",
  ea: "ea",
  sea: "sea",
  oc: "oc",
};

const hotspots = [
  { name: "New York", x: 290, y: 130, region: "na" },
  { name: "London", x: 490, y: 95, region: "eu" },
  { name: "Frankfurt", x: 520, y: 100, region: "eu" },
  { name: "Lagos", x: 510, y: 235, region: "af" },
  { name: "Dubai", x: 635, y: 158, region: "me" },
  { name: "Mumbai", x: 695, y: 195, region: "sa_asia" },
  { name: "Shanghai", x: 820, y: 140, region: "ea" },
  { name: "Tokyo", x: 885, y: 130, region: "ea" },
  { name: "Singapore", x: 798, y: 245, region: "sea" },
  { name: "São Paulo", x: 350, y: 320, region: "sa" },
  { name: "Sydney", x: 900, y: 330, region: "oc" },
  { name: "Moscow", x: 600, y: 78, region: "ru" },
];

const connections = [
  { from: "London", to: "New York" },
  { from: "London", to: "Frankfurt" },
  { from: "London", to: "Dubai" },
  { from: "Dubai", to: "Mumbai" },
  { from: "Shanghai", to: "Tokyo" },
  { from: "Shanghai", to: "Singapore" },
  { from: "New York", to: "São Paulo" },
  { from: "Moscow", to: "Shanghai" },
  { from: "Lagos", to: "London" },
];

function getRiskColor(risk: number): string {
  if (risk >= 0.8) return "var(--fraud-critical)";
  if (risk >= 0.6) return "var(--fraud-warning)";
  if (risk >= 0.4) return "var(--accent-color)";
  return "var(--fraud-cleared)";
}

export default function WorldMapView() {
  const [hovered, setHovered] = useState<string | null>(null);

  const totalCases = Object.values(regionData).reduce(
    (s, r) => s + r.cases,
    0
  );
  const totalBlocked = Object.values(regionData).reduce(
    (s, r) => s + r.blocked,
    0
  );

  const hoveredData = hovered ? regionData[hovered] : null;

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
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
        ].map((stat) => (
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

      {/* Map card */}
      <div className="relative bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-primary)] shadow-[var(--card-shadow)] overflow-hidden">
        <svg viewBox="0 0 1000 500" className="w-full h-auto block">
          <defs>
            {/* Flowing gradient across the whole map */}
            <linearGradient
              id="mapFlow"
              x1="0%"
              y1="20%"
              x2="100%"
              y2="80%"
            >
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.12" />
              <stop offset="25%" stopColor="#818cf8" stopOpacity="0.16" />
              <stop offset="50%" stopColor="#f87171" stopOpacity="0.18" />
              <stop offset="75%" stopColor="#fbbf24" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0.1" />
            </linearGradient>

            {/* Per-region radial glows */}
            {Object.entries(regionData).map(([id, data]) => (
              <radialGradient
                key={id}
                id={`rg-${id}`}
                cx="50%"
                cy="50%"
                r="65%"
              >
                <stop
                  offset="0%"
                  stopColor={getRiskColor(data.risk)}
                  stopOpacity="0.45"
                />
                <stop
                  offset="100%"
                  stopColor={getRiskColor(data.risk)}
                  stopOpacity="0.06"
                />
              </radialGradient>
            ))}

            <filter id="dotGlow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="4" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter
              id="areaGlow"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feGaussianBlur stdDeviation="6" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Base gradient wash */}
          <rect width="1000" height="500" fill="url(#mapFlow)" />

          {/* Graticule grid */}
          <g opacity="0.18">
            {Array.from({ length: 10 }, (_, i) => (
              <line
                key={`h${i}`}
                x1="0"
                y1={(i + 1) * 50}
                x2="1000"
                y2={(i + 1) * 50}
                stroke="var(--border-secondary)"
                strokeWidth="0.5"
              />
            ))}
            {Array.from({ length: 20 }, (_, i) => (
              <line
                key={`v${i}`}
                x1={(i + 1) * 50}
                y1="0"
                x2={(i + 1) * 50}
                y2="500"
                stroke="var(--border-secondary)"
                strokeWidth="0.5"
              />
            ))}
          </g>

          {/* Region fills */}
          {regions.map((region) => {
            const parentId = regionParent[region.id];
            const data = regionData[parentId];
            if (!data) return null;
            const active = hovered === parentId;

            return (
              <path
                key={region.id}
                d={region.path}
                fill={`url(#rg-${parentId})`}
                stroke={getRiskColor(data.risk)}
                strokeWidth={active ? 1.8 : 0.8}
                strokeOpacity={active ? 0.9 : 0.35}
                fillOpacity={active ? 1 : 0.75}
                filter={active ? "url(#areaGlow)" : undefined}
                className="cursor-pointer"
                style={{ transition: "all 0.3s ease" }}
                onMouseEnter={() => setHovered(parentId)}
                onMouseLeave={() => setHovered(null)}
              />
            );
          })}

          {/* Connection arcs */}
          {connections.map(({ from, to }, i) => {
            const a = hotspots.find((h) => h.name === from);
            const b = hotspots.find((h) => h.name === to);
            if (!a || !b) return null;
            const mx = (a.x + b.x) / 2;
            const my = Math.min(a.y, b.y) - 25;
            return (
              <path
                key={i}
                d={`M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`}
                fill="none"
                stroke="var(--accent-color)"
                strokeWidth="0.7"
                strokeOpacity="0.2"
                strokeDasharray="4 3"
              />
            );
          })}

          {/* Hotspot dots */}
          {hotspots.map((spot) => {
            const data = regionData[spot.region];
            if (!data) return null;
            const active = hovered === spot.region;
            const color = getRiskColor(data.risk);

            return (
              <g key={spot.name}>
                {/* Animated pulse ring */}
                <circle
                  cx={spot.x}
                  cy={spot.y}
                  r="5"
                  fill="none"
                  stroke={color}
                  strokeWidth="0.6"
                >
                  <animate
                    attributeName="r"
                    values="4;14;4"
                    dur="3.5s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="stroke-opacity"
                    values="0.5;0;0.5"
                    dur="3.5s"
                    repeatCount="indefinite"
                  />
                </circle>

                {/* Outer soft glow */}
                <circle
                  cx={spot.x}
                  cy={spot.y}
                  r={active ? 10 : 7}
                  fill={color}
                  fillOpacity={0.12}
                  filter="url(#dotGlow)"
                  style={{ transition: "r 0.3s ease" }}
                />

                {/* Core dot */}
                <circle
                  cx={spot.x}
                  cy={spot.y}
                  r={active ? 3.5 : 2.5}
                  fill={color}
                  fillOpacity={0.9}
                  className="cursor-pointer"
                  style={{ transition: "r 0.3s ease" }}
                  onMouseEnter={() => setHovered(spot.region)}
                  onMouseLeave={() => setHovered(null)}
                />

                {/* City label on hover */}
                {active && (
                  <text
                    x={spot.x}
                    y={spot.y - 15}
                    textAnchor="middle"
                    fill="var(--text-primary)"
                    fontSize="9"
                    fontWeight="600"
                  >
                    {spot.name}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Tooltip */}
        {hoveredData && (
          <div className="absolute bottom-3 left-3 bg-[var(--bg-elevated)] border border-[var(--border-primary)] rounded-xl px-3.5 py-2.5 shadow-lg text-xs pointer-events-none animate-card-in">
            <p className="font-semibold text-[var(--text-primary)] mb-1">
              {hoveredData.name}
            </p>
            <div className="flex gap-4">
              <span className="text-[var(--text-tertiary)]">
                Cases{" "}
                <span className="text-[var(--fraud-critical)] font-medium">
                  {hoveredData.cases.toLocaleString()}
                </span>
              </span>
              <span className="text-[var(--text-tertiary)]">
                Blocked{" "}
                <span className="text-[var(--fraud-cleared)] font-medium">
                  {hoveredData.blocked.toLocaleString()}
                </span>
              </span>
              <span className="text-[var(--text-tertiary)]">
                Risk{" "}
                <span
                  className="font-medium"
                  style={{ color: getRiskColor(hoveredData.risk) }}
                >
                  {(hoveredData.risk * 100).toFixed(0)}%
                </span>
              </span>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="absolute top-3 right-3 bg-[var(--bg-elevated)]/80 backdrop-blur-sm border border-[var(--border-primary)] rounded-lg px-2.5 py-2 text-[10px]">
          <p className="font-medium text-[var(--text-secondary)] mb-1.5">
            Risk Level
          </p>
          {[
            { label: "Critical  ≥ 80%", color: "var(--fraud-critical)" },
            { label: "High  60–80%", color: "var(--fraud-warning)" },
            { label: "Medium  40–60%", color: "var(--accent-color)" },
            { label: "Low  < 40%", color: "var(--fraud-cleared)" },
          ].map(({ label, color }) => (
            <div key={label} className="flex items-center gap-1.5 mb-0.5">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: color }}
              />
              <span className="text-[var(--text-tertiary)]">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
