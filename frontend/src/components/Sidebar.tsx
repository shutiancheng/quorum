"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShieldAlert,
  CreditCard,
  Users,
  GitBranch,
  FileSearch,
  Settings,
  BarChart3,
  Swords,
  Radio,
  Search,
  Scale,
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const fraudSection = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "APP Fraud", href: "/app-fraud", icon: ShieldAlert },
  { label: "Unauthorised Fraud", href: "/unauthorised", icon: CreditCard },
  { label: "First-Party Fraud", href: "/first-party", icon: Users },
  { label: "Collusion Detection", href: "/collusion", icon: GitBranch },
];

const meshSection = [
  { label: "Signal Exchange", href: "/signal-exchange", icon: Radio },
  { label: "Query & Privacy", href: "/query-privacy", icon: Search },
  { label: "Governance", href: "/governance", icon: Scale },
];

const toolsSection = [
  { label: "Attack Simulation", href: "/attack-simulation", icon: Swords },
  { label: "Case Investigation", href: "/investigations", icon: FileSearch },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Settings", href: "/settings", icon: Settings },
];

function NavSection({
  label,
  items,
  pathname,
}: {
  label: string;
  items: typeof fraudSection;
  pathname: string;
}) {
  return (
    <div>
      <div className="px-3 pt-4 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--text-tertiary)]">
        {label}
      </div>
      <div className="space-y-0.5">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors ${
                isActive
                  ? "bg-[var(--sidebar-item-active)] text-[var(--sidebar-item-active-text)] font-medium"
                  : "text-[var(--text-secondary)] hover:bg-[var(--sidebar-item-hover)]"
              }`}
            >
              <item.icon className="w-4 h-4 shrink-0" strokeWidth={1.5} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 flex flex-col bg-[var(--sidebar-bg)]">
      {/* Logo */}
      <div className="px-4 py-5 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-[var(--brand-primary)] flex items-center justify-center">
          <span
            className="text-[var(--brand-primary-fg)] text-lg font-bold leading-none shrink-0"
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              marginTop: "-1px",
            }}
          >
            Q
          </span>
        </div>
        <span className="font-semibold text-[var(--text-primary)]">
          Quorum
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 overflow-y-auto">
        <NavSection
          label="Fraud Monitoring"
          items={fraudSection}
          pathname={pathname}
        />
        <NavSection
          label="Sentinel Mesh"
          items={meshSection}
          pathname={pathname}
        />
        <NavSection
          label="Tools"
          items={toolsSection}
          pathname={pathname}
        />
      </nav>

      {/* Theme toggle */}
      <div className="px-3 py-3 border-t border-[var(--sidebar-border)]">
        <ThemeToggle />
      </div>
    </aside>
  );
}
