"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShieldAlert,
  CreditCard,
  Users,
  GitBranch,

  Settings,
  BarChart3,
  Swords,
  Radio,


  Zap,
  Network,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

const sections = [
  [
    { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
    { href: "/app-fraud", icon: ShieldAlert, label: "APP Fraud" },
    { href: "/unauthorised", icon: CreditCard, label: "Unauthorised" },
    { href: "/first-party", icon: Users, label: "First-Party" },
    { href: "/collusion", icon: GitBranch, label: "Collusion" },
  ],
  [
    { href: "/live-demo", icon: Zap, label: "Live Demo" },
    { href: "/signal-exchange", icon: Radio, label: "Signal Exchange" },
    { href: "/orchestration", icon: Network, label: "Orchestration" },
  ],
  [
    { href: "/attack-simulation", icon: Swords, label: "Attack Simulation" },
    { href: "/analytics", icon: BarChart3, label: "Analytics" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ],
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(true);

  return (
    <aside
      className="shrink-0 flex flex-col bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)] h-screen transition-[width] duration-200 ease-in-out overflow-hidden"
      style={{ width: collapsed ? 56 : 200 }}
    >
      {/* Logo */}
      <div className="h-14 flex items-center gap-2.5 border-b border-[var(--sidebar-border)] shrink-0 px-[14px]">
        <div className="relative flex items-center justify-center shrink-0" style={{ width: 28, height: 28 }}>
          {/* Orbital ring */}
          <div className="absolute rounded-full pointer-events-none" style={{
            width: 40, height: 40, left: "50%", top: "50%",
            border: "1px solid rgba(249,115,22,0.35)",
            animation: "ag-spin 8s linear infinite",
          }} />
          {/* Orbiting dot */}
          <div className="absolute rounded-full pointer-events-none" style={{
            width: 5, height: 5, left: "50%", top: "50%",
            backgroundColor: "#F97316",
            boxShadow: "0 0 6px 2px rgba(249,115,22,0.7)",
            animation: "ag-orbit-dot 8s linear infinite",
          }} />
          <div className="w-7 h-7 rounded-lg bg-[var(--brand-primary)] flex items-center justify-center">
            <span
              className="text-black text-sm font-bold leading-none"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Q
            </span>
          </div>
        </div>
        {!collapsed && (
          <span className="text-[var(--text-primary)] text-sm font-semibold whitespace-nowrap">
            Quorum
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col py-3 overflow-y-auto">
        {sections.map((section, si) => (
          <div
            key={si}
            className={`flex flex-col gap-0.5 px-2 ${
              si > 0 ? "mt-2 pt-2 border-t border-[var(--sidebar-border)]" : ""
            }`}
          >
            {section.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={`relative flex items-center h-9 rounded-lg transition-colors ${
                    collapsed ? "justify-center w-9 mx-auto" : "gap-2.5 px-2.5"
                  } ${
                    isActive
                      ? "bg-[var(--sidebar-item-active)] text-[var(--sidebar-item-active-text)]"
                      : "text-[var(--text-tertiary)] hover:bg-[var(--sidebar-item-hover)] hover:text-[var(--text-secondary)]"
                  }`}
                >
                  {isActive && (
                    <span className="absolute -left-2 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[var(--brand-primary)] rounded-r-full" />
                  )}
                  <item.icon className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                  {!collapsed && (
                    <span className="text-[13px] whitespace-nowrap">
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Toggle */}
      <div className="shrink-0 border-t border-[var(--sidebar-border)] p-2">
        <button
          onClick={() => setCollapsed((c) => !c)}
          className={`flex items-center h-9 rounded-lg transition-colors text-[var(--text-tertiary)] hover:bg-[var(--sidebar-item-hover)] hover:text-[var(--text-secondary)] ${
            collapsed ? "justify-center w-9 mx-auto" : "gap-2.5 px-2.5 w-full"
          }`}
        >
          {collapsed ? (
            <PanelLeftOpen className="w-4 h-4 shrink-0" strokeWidth={1.5} />
          ) : (
            <PanelLeftClose className="w-4 h-4 shrink-0" strokeWidth={1.5} />
          )}
          {!collapsed && (
            <span className="text-[13px] whitespace-nowrap">Collapse</span>
          )}
        </button>
      </div>
    </aside>
  );
}
