"use client";

import { useState } from "react";
import { Shield, Bell, Globe, Key } from "lucide-react";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [autoBlock, setAutoBlock] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
          Settings
        </h1>
        <p className="text-sm text-[var(--text-tertiary)] mt-1">
          Configure fraud detection rules and platform preferences
        </p>
      </div>

      <div className="space-y-4 max-w-2xl">
        {/* Notifications */}
        <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-primary)] shadow-[var(--card-shadow)] p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center">
                <Bell
                  className="w-5 h-5 text-[var(--text-secondary)] shrink-0"
                  strokeWidth={1.5}
                />
              </div>
              <div>
                <div className="font-semibold text-[var(--text-primary)]">
                  Real-time Alerts
                </div>
                <div className="text-xs text-[var(--text-tertiary)]">
                  Get notified when critical fraud cases are detected
                </div>
              </div>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`relative shrink-0 w-11 h-6 rounded-full transition-colors duration-200 ${
                notifications
                  ? "bg-[var(--toggle-active)]"
                  : "bg-[var(--toggle-track)]"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
                  notifications ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Auto-block */}
        <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-primary)] shadow-[var(--card-shadow)] p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center">
                <Shield
                  className="w-5 h-5 text-[var(--text-secondary)] shrink-0"
                  strokeWidth={1.5}
                />
              </div>
              <div>
                <div className="font-semibold text-[var(--text-primary)]">
                  Auto-Block High Risk
                </div>
                <div className="text-xs text-[var(--text-tertiary)]">
                  Automatically block transactions with risk score above 90
                </div>
              </div>
            </div>
            <button
              onClick={() => setAutoBlock(!autoBlock)}
              className={`relative shrink-0 w-11 h-6 rounded-full transition-colors duration-200 ${
                autoBlock
                  ? "bg-[var(--toggle-active)]"
                  : "bg-[var(--toggle-track)]"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
                  autoBlock ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Region */}
        <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-primary)] shadow-[var(--card-shadow)] p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center">
              <Globe
                className="w-5 h-5 text-[var(--text-secondary)] shrink-0"
                strokeWidth={1.5}
              />
            </div>
            <div>
              <div className="font-semibold text-[var(--text-primary)]">
                Default Region
              </div>
              <div className="text-xs text-[var(--text-tertiary)]">
                Primary geographic region for fraud monitoring
              </div>
            </div>
          </div>
          <select className="w-full px-3 py-2 text-sm rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent transition-colors">
            <option>UK</option>
            <option>US East</option>
            <option>US West</option>
            <option>EU West</option>
            <option>APAC</option>
            <option>LATAM</option>
          </select>
        </div>

        {/* API Key */}
        <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-primary)] shadow-[var(--card-shadow)] p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center">
              <Key
                className="w-5 h-5 text-[var(--text-secondary)] shrink-0"
                strokeWidth={1.5}
              />
            </div>
            <div>
              <div className="font-semibold text-[var(--text-primary)]">
                API Key
              </div>
              <div className="text-xs text-[var(--text-tertiary)]">
                Connect external fraud detection services
              </div>
            </div>
          </div>
          <input
            type="password"
            defaultValue="sk-••••••••••••••••"
            className="w-full px-3 py-2 text-sm rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent transition-colors font-mono"
          />
        </div>
      </div>
    </div>
  );
}
