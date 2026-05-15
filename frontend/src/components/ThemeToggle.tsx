"use client";

import { useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    if (typeof document === "undefined") return false;
    return document.documentElement.getAttribute("data-theme") === "dark";
  });

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute(
      "data-theme",
      next ? "dark" : "light"
    );
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-[var(--text-secondary)] hover:bg-[var(--sidebar-item-hover)] transition-colors w-full"
    >
      {dark ? (
        <Sun className="w-4 h-4 shrink-0" strokeWidth={1.5} />
      ) : (
        <Moon className="w-4 h-4 shrink-0" strokeWidth={1.5} />
      )}
      {dark ? "Light Mode" : "Dark Mode"}
    </button>
  );
}
