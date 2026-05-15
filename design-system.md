# Quorum Design System

> A reference for building consistent UI across the Quorum fraud intelligence dashboard.

---

## Tech Stack

| Layer            | Tool                          |
| ---------------- | ----------------------------- |
| Framework        | Next.js 16 + React 19        |
| CSS              | Tailwind CSS v4 (utility-first) |
| Charts           | Recharts                      |
| Icons            | Lucide React                  |
| Animation        | Framer Motion + CSS keyframes |
| Toasts           | Sonner                        |
| Forms            | React Hook Form + Zod         |
| Classnames       | clsx                          |

---

## Color Tokens

All colors are CSS custom properties defined in `globals.css`. Reference them with `var(--token-name)` in Tailwind arbitrary values: `bg-[var(--bg-primary)]`.

### Brand

| Token                    | Light        | Dark         | Usage                    |
| ------------------------ | ------------ | ------------ | ------------------------ |
| `--brand-primary`        | `#171717`    | `#fafafa`    | Primary CTA, buttons     |
| `--brand-primary-hover`  | `#262626`    | `#e5e5e5`    | Hover state for primary  |
| `--brand-primary-fg`     | `#ffffff`    | `#171717`    | Text on primary buttons  |

### Backgrounds

| Token              | Light      | Dark       | Usage                        |
| ------------------ | ---------- | ---------- | ---------------------------- |
| `--bg-primary`     | `#ffffff`  | `#141414`  | Cards, surfaces              |
| `--bg-secondary`   | `#fafafa`  | `#000000`  | Page background              |
| `--bg-tertiary`    | `#f5f5f4`  | `#1e1e1e`  | Tertiary surfaces, tab bars  |
| `--bg-elevated`    | `#ffffff`  | `#141414`  | Tooltips, elevated surfaces  |

### Text

| Token              | Light      | Dark       | Usage                 |
| ------------------ | ---------- | ---------- | --------------------- |
| `--text-primary`   | `#1c1917`  | `#fafaf9`  | Headings, body text   |
| `--text-secondary` | `#57534e`  | `#a8a29e`  | Descriptions, labels  |
| `--text-tertiary`  | `#a8a29e`  | `#78716c`  | Hints, muted text     |

### Borders

| Token                | Light      | Dark       |
| -------------------- | ---------- | ---------- |
| `--border-primary`   | `#e7e5e4`  | `#1e1e1e`  |
| `--border-secondary` | `#d6d3d1`  | `#2a2a2a`  |

### Semantic (Status)

| Token                  | Light      | Dark       | Usage                    |
| ---------------------- | ---------- | ---------- | ------------------------ |
| `--fraud-critical`     | `#dc2626`  | `#ef4444`  | Critical / danger text   |
| `--fraud-critical-bg`  | `#fef2f2`  | `#1c1111`  | Critical badge bg        |
| `--fraud-warning`      | `#f59e0b`  | `#fbbf24`  | Warning text             |
| `--fraud-warning-bg`   | `#fffbeb`  | `#1c1a0e`  | Warning badge bg         |
| `--fraud-cleared`      | `#16a34a`  | `#22c55e`  | Success / cleared text   |
| `--fraud-cleared-bg`   | `#f0fdf4`  | `#0e1c14`  | Success badge bg         |
| `--fraud-review`       | `#6366f1`  | `#818cf8`  | Under-review / info text |
| `--fraud-review-bg`    | `#eef2ff`  | `#121320`  | Under-review badge bg    |

### Accent

| Token              | Value      | Usage                            |
| ------------------ | ---------- | -------------------------------- |
| `--accent-color`   | `#7884a7`  | Charts, secondary accents        |
| `--accent-hover`   | `#6b7a9e`  | Hover on accent elements         |

### Sidebar

| Token                        | Light                     | Dark                        |
| ---------------------------- | ------------------------- | --------------------------- |
| `--sidebar-bg`               | `#f5f5f4`                 | `#111111`                   |
| `--sidebar-border`           | `#e7e5e4`                 | `#232323`                   |
| `--sidebar-item-hover`       | `rgba(0, 0, 0, 0.04)`    | `rgba(255, 255, 255, 0.05)` |
| `--sidebar-item-active`      | `rgba(0, 0, 0, 0.06)`    | `rgba(255, 255, 255, 0.08)` |
| `--sidebar-item-active-text` | `#1c1917`                 | `#fafafa`                   |

### Other UI Tokens

| Token                | Light      | Dark       | Usage                    |
| -------------------- | ---------- | ---------- | ------------------------ |
| `--pill-active-bg`   | `#171717`  | `#fafafa`  | Active pill/filter bg    |
| `--pill-active-text`  | `#ffffff`  | `#0a0a0a`  | Active pill/filter text  |
| `--toggle-track`     | `#d6d3d1`  | `#404040`  | Toggle switch track      |
| `--toggle-active`    | `#22c55e`  | `#22c55e`  | Toggle switch active     |
| `--btn-bg`           | `#171717`  | `#27272a`  | Button background        |
| `--btn-fg`           | `#ffffff`  | `#ffffff`  | Button foreground        |

---

## Elevation (Shadows)

| Token                  | Light                                                                         | Dark (higher opacity)                                                         |
| ---------------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `--card-shadow`        | `0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.04)`          | `0 1px 3px 0 rgb(0 0 0 / 0.3), 0 1px 2px -1px rgb(0 0 0 / 0.3)`            |
| `--card-shadow-hover`  | `0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)`       | `0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.4)`         |

Usage:
- Default cards: `shadow-[var(--card-shadow)]`
- Modal dialogs: `shadow-xl`
- Main content area: `shadow-lg shadow-black/5`

---

## Border Radius

| Tailwind class  | Value  | Usage                                   |
| --------------- | ------ | --------------------------------------- |
| `rounded-2xl`   | 16px   | Cards, modals, main content area        |
| `rounded-xl`    | 12px   | Buttons, inputs, icon wrappers, nav items |
| `rounded-lg`    | 8px    | Small cards, pill buttons, inputs       |
| `rounded-full`  | 50%    | Toggles, progress bars, avatar badges   |

Also available as CSS tokens:
- `--card-radius: 16px`
- `--card-radius-sm: 12px`

---

## Typography

### Font

**Space Grotesk** is the sole typeface, loaded via Google Fonts.

```tsx
// Applied through CSS variable
fontFamily: "var(--font-space-grotesk), sans-serif"
```

Global font smoothing is enabled: `-webkit-font-smoothing: antialiased`.

### Scale

| Class       | Size   | Usage                                   |
| ----------- | ------ | --------------------------------------- |
| `text-3xl`  | 30px   | Large stat values                       |
| `text-2xl`  | 24px   | Page titles                             |
| `text-lg`   | 18px   | Section headings, secondary stats       |
| `text-sm`   | 14px   | Body text, buttons, form fields         |
| `text-xs`   | 12px   | Labels, hints, badges, table headers    |
| `text-[10px]` | 10px | Sidebar section labels                  |

### Weights

| Class           | Weight | Usage                                |
| --------------- | ------ | ------------------------------------ |
| (default)       | 400    | Body text                            |
| `font-medium`   | 500    | Form labels, nav items, buttons      |
| `font-semibold` | 600    | Card titles, section headings        |
| `font-bold`     | 700    | Stat values                          |

### Letter Spacing

| Class              | Usage                           |
| ------------------ | ------------------------------- |
| `tracking-tight`   | Stat values (tighter)           |
| `tracking-wider`   | Table headers (wider)           |
| `tracking-widest`  | Sidebar section labels          |

---

## Spacing

Tailwind's default scale. Common values used throughout:

| Tailwind | Pixels | Usage                                     |
| -------- | ------ | ----------------------------------------- |
| `1`      | 4px    | Tight gaps (pill padding, tab bar gaps)   |
| `2`      | 8px    | Icon gaps, small padding                  |
| `3`      | 12px   | Sidebar padding, medium gaps              |
| `4`      | 16px   | Card grid gaps, standard padding          |
| `5`      | 20px   | Card inner padding                        |
| `6`      | 24px   | Page padding, section spacing             |

### Section Spacing

- Between page sections: `space-y-6` (24px)
- Between cards in a grid: `gap-4` (16px)
- Between icon and label: `gap-2` (8px) or `gap-3` (12px)

---

## Layout

### Page Structure

```
┌─────────────────────────────────────────────┐
│ flex h-screen bg-[var(--sidebar-bg)]        │
│ ┌──────────┐ ┌────────────────────────────┐ │
│ │ Sidebar  │ │ Main content               │ │
│ │ w-60     │ │ flex-1 rounded-2xl         │ │
│ │ flex-col │ │ bg-[var(--bg-primary)]     │ │
│ │ h-screen │ │ m-2 p-6 overflow-y-auto   │ │
│ │          │ │                            │ │
│ └──────────┘ └────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

### Grid Patterns

| Pattern         | Class                    | Usage                         |
| --------------- | ------------------------ | ----------------------------- |
| 4-column        | `grid grid-cols-4 gap-4` | Stat card rows                |
| 3-column        | `grid grid-cols-3 gap-4` | System/config cards           |
| 2-column        | `grid grid-cols-2 gap-4` | Chart panels                  |

### Common Flex Patterns

```
Header row:     flex items-center justify-between
Icon + label:   flex items-center gap-2
Centered:       flex items-center justify-center
Vertical stack: flex flex-col gap-4
```

---

## Dark Mode

### How It Works

Theme is toggled by setting `data-theme="dark"` on `<html>`. An inline script in `<head>` reads localStorage (or system preference) before paint to avoid flash.

### Rules

1. **Never hard-code colors.** Always use `var(--token)` references.
2. All token values swap automatically when `data-theme` changes.
3. The toggle lives at the bottom of the sidebar.
4. Storage key: `localStorage.getItem('theme')` → `"dark"` | `"light"`.

---

## Component Patterns

### Card

```tsx
<div className="rounded-2xl border border-[var(--border-primary)] shadow-[var(--card-shadow)] bg-[var(--bg-primary)] p-5">
  {/* content */}
</div>
```

For hover lift effect, add the global `card-hover` class:
```tsx
<div className="rounded-2xl border border-[var(--border-primary)] shadow-[var(--card-shadow)] bg-[var(--bg-primary)] p-5 card-hover">
```

Card entrance animation: add `animate-card-in`.

### Stat Card

```
Container:   rounded-2xl, border, shadow, p-5, animate-card-in
Icon badge:  w-10 h-10, rounded-xl, bg-[var(--bg-tertiary)], flex items-center justify-center
Icon:        w-5 h-5, text-[var(--text-secondary)], shrink-0, strokeWidth={1.5}
Label:       text-xs, text-[var(--text-tertiary)], mb-3
Value:       text-3xl, font-bold, tracking-tight, text-[var(--text-primary)]
Change:      text-xs, mt-1 — green for positive, red for negative
```

### Status Badge

```tsx
<span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full"
  style={{
    backgroundColor: "var(--fraud-{status}-bg)",
    color: "var(--fraud-{status})"
  }}>
  {label}
</span>
```

Status mapping:

| Status    | Color token       | Background token       |
| --------- | ----------------- | ---------------------- |
| Critical  | `--fraud-critical` | `--fraud-critical-bg` |
| Warning   | `--fraud-warning`  | `--fraud-warning-bg`  |
| Cleared   | `--fraud-cleared`  | `--fraud-cleared-bg`  |
| Review    | `--fraud-review`   | `--fraud-review-bg`   |

### Button — Primary

```tsx
<button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl bg-[var(--brand-primary)] text-[var(--brand-primary-fg)] hover:bg-[var(--brand-primary-hover)] transition-colors">
  <Icon className="w-4 h-4 shrink-0" strokeWidth={1.5} />
  Label
</button>
```

### Button — Secondary

```tsx
<button className="px-4 py-2.5 text-sm font-medium rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-primary)] hover:bg-[var(--bg-tertiary)] transition-colors">
  Label
</button>
```

### Button — Pill / Filter

```tsx
// Active
<button className="px-2.5 py-1 text-xs font-medium rounded-lg bg-[var(--pill-active-bg)] text-[var(--pill-active-text)]">

// Inactive
<button className="px-2.5 py-1 text-xs font-medium rounded-lg text-[var(--text-tertiary)] hover:bg-[var(--bg-tertiary)] transition-colors">
```

### Button — Icon Only

```tsx
<button className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors">
  <Icon className="w-4 h-4 shrink-0" strokeWidth={1.5} />
</button>
```

### Input / Select

```tsx
<input className="w-full px-3 py-2 text-sm rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent transition-colors" />
```

### Tab Bar

```tsx
<div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--bg-tertiary)]">
  {/* Active tab */}
  <button className="px-3 py-1.5 text-sm font-medium rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm">
  {/* Inactive tab */}
  <button className="px-3 py-1.5 text-sm font-medium rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors">
</div>
```

### Toggle Switch

```tsx
<button
  className={`relative shrink-0 w-11 h-6 rounded-full transition-colors duration-200 ${
    active ? "bg-[var(--toggle-active)]" : "bg-[var(--toggle-track)]"
  }`}>
  <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
    active ? "translate-x-5" : "translate-x-0"
  }`} />
</button>
```

### Modal

```tsx
<div className="fixed inset-0 z-50 flex items-center justify-center">
  {/* Overlay */}
  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
  {/* Dialog */}
  <div className="relative w-full max-w-md mx-4 bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-primary)] shadow-xl animate-card-in">
    {/* Header */}
    <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-primary)]">
    {/* Body */}
    <div className="p-5 space-y-3">
    {/* Footer */}
    <div className="flex justify-end gap-2 px-5 py-4 border-t border-[var(--border-primary)]">
  </div>
</div>
```

### Data Table

```
Container:    w-full text-sm
Header row:   border-b, py-3 px-4, text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider
Body row:     border-b border-[var(--border-primary)], hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer
Cell:         py-3 px-4
```

### Risk Score Bar (inline progress)

```tsx
<div className="w-16 h-1.5 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
  <div className="h-full rounded-full" style={{ width: `${score}%`, backgroundColor: getRiskColor(score) }} />
</div>
```

Risk color logic:
```
score >= 80  → var(--fraud-critical)
score >= 60  → var(--fraud-warning)
score >= 40  → var(--accent-color)
score < 40   → var(--fraud-cleared)
```

---

## Icons

### Library

**Lucide React** — lightweight, consistent stroke icons.

```tsx
import { ShieldAlert } from "lucide-react";
<ShieldAlert className="w-4 h-4 shrink-0" strokeWidth={1.5} />
```

### Sizing

| Context            | Size         |
| ------------------ | ------------ |
| Stat card badge    | `w-5 h-5` inside `w-10 h-10` wrapper |
| Sidebar nav        | `w-4 h-4`   |
| Buttons            | `w-4 h-4`   |
| Table cells        | `w-4 h-4`   |

### Rules

1. Always use `strokeWidth={1.5}` for a consistent lightweight look.
2. Always add `shrink-0` in flex containers to prevent icon resizing.
3. Default color: `text-[var(--text-secondary)]`.
4. **Never use `hover:opacity-*`** on buttons containing icons (causes GPU wiggle). Use `hover:bg-*` instead.

---

## Animation

### CSS Keyframe Classes

| Class                  | Effect                         | Duration | Usage                   |
| ---------------------- | ------------------------------ | -------- | ----------------------- |
| `animate-card-in`      | Fade up from 8px below         | 350ms    | Card entrance           |
| `animate-dropdown-in`  | Scale + fade from top-right    | 150ms    | Dropdown menus          |
| `animate-shimmer`      | Horizontal shimmer pulse       | 2.5s ∞   | Loading skeletons       |
| `animate-alert-pulse`  | Red box-shadow pulse           | 1.5s ∞   | Live alert indicators   |

### Transition Rules

| Scenario              | Class                   | Notes                          |
| --------------------- | ----------------------- | ------------------------------ |
| Button hover          | `transition-colors`     | **Never** `transition-all`     |
| Card hover            | `.card-hover` class     | box-shadow + transform 200ms   |
| Toggle switch         | `transition-colors duration-200` + `transition-transform duration-200` | |
| Progress bars         | `transition-all duration-500` | Width animations             |
| Nav items             | `transition-colors`     |                                |

### Anti-patterns (do NOT use)

- `transition-all` on buttons — causes layout jitter
- `hover:opacity-*` on icon buttons — causes sub-pixel wiggle
- Direct transforms on interactive elements without `will-change`

---

## Chart Styling (Recharts)

### Colors

| Element              | Token / Value                  |
| -------------------- | ------------------------------ |
| Alert line + fill    | `var(--fraud-critical)` / `var(--fraud-critical-bg)` |
| Blocked line + fill  | `var(--fraud-cleared)` / `var(--fraud-cleared-bg)` |
| Bar fill             | `var(--accent-color)` (`#7884a7`) |
| Bar corner radius    | `radius={[6, 6, 0, 0]}`       |

### Tooltip

```tsx
contentStyle={{
  backgroundColor: "var(--bg-elevated)",
  border: "1px solid var(--border-primary)",
  borderRadius: 12,
  fontSize: 13,
}}
```

### Axes & Grid

```tsx
tick={{ fontSize: 12, fill: "var(--text-tertiary)" }}
strokeDasharray="3 3"
stroke="var(--border-primary)"
```

---

## Scrollbar

Custom styled for WebKit:

```css
::-webkit-scrollbar          { width: 6px; height: 6px; }
::-webkit-scrollbar-track    { background: transparent; }
::-webkit-scrollbar-thumb    { background: var(--border-secondary); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--text-tertiary); }
```

---

## Sidebar Navigation

```
Width:          w-60 (240px) fixed
Background:     var(--sidebar-bg)
Border:         Right border via var(--sidebar-border)

Logo area:      px-4 py-5, icon in w-8 h-8 rounded-lg
Section label:  text-[10px] font-semibold uppercase tracking-widest text-[var(--text-tertiary)]
Nav items:      space-y-0.5
  - Default:    px-3 py-2 rounded-xl text-sm text-[var(--text-secondary)]
  - Hover:      bg-[var(--sidebar-item-hover)]
  - Active:     bg-[var(--sidebar-item-active)] text-[var(--sidebar-item-active-text)] font-medium
Footer:         border-t border-[var(--sidebar-border)], contains theme toggle
```

---

## Backdrop & Overlay Effects

| Effect              | Classes                              | Usage           |
| ------------------- | ------------------------------------ | --------------- |
| Modal overlay       | `bg-black/50 backdrop-blur-sm`       | Modal backdrop  |
| Floating legend     | `bg-[var(--bg-elevated)]/80 backdrop-blur-sm` | Map legend |

---

## Quick Reference: Building a New Page

```tsx
export default function NewPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
          Page Title
        </h1>
        <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl bg-[var(--brand-primary)] text-[var(--brand-primary-fg)] hover:bg-[var(--brand-primary-hover)] transition-colors">
          <Plus className="w-4 h-4 shrink-0" strokeWidth={1.5} />
          Action
        </button>
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-4 gap-4">
        {/* StatCard components */}
      </div>

      {/* Content cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-[var(--border-primary)] shadow-[var(--card-shadow)] bg-[var(--bg-primary)] p-5">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
            Section Title
          </h2>
          {/* content */}
        </div>
      </div>
    </div>
  );
}
```

---

## Checklist: Before Shipping UI

- [ ] All colors use `var(--token)` — no hard-coded hex values
- [ ] Dark mode works (toggle theme and verify)
- [ ] Cards use `rounded-2xl` + `border` + `shadow-[var(--card-shadow)]`
- [ ] Buttons use `transition-colors`, **not** `transition-all`
- [ ] Icons use `w-4 h-4 shrink-0 strokeWidth={1.5}`
- [ ] No `hover:opacity-*` on buttons with icons
- [ ] Text hierarchy follows the type scale (xs → sm → lg → 2xl → 3xl)
- [ ] Interactive elements have visible hover/focus states
- [ ] Entrance animations use `animate-card-in` where appropriate
- [ ] Spacing is consistent with the scale (gap-2/3/4, p-5/6)
