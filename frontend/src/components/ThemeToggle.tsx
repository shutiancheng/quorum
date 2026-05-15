"use client";

import { Moon } from "lucide-react";

export default function ThemeToggle() {
  return (
    <div className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-tertiary)]">
      <Moon className="w-4 h-4 shrink-0" strokeWidth={1.5} />
      Dark Mode
    </div>
  );
}
