# Quorum — Dependency & Environment Reference

Use this document to ensure your local environment matches the project requirements.
If you're experiencing crashes (especially with animations), follow the clean install steps at the bottom.

---

## Runtime Requirements

| Requirement | Version   | Notes                              |
|-------------|-----------|------------------------------------|
| Node.js     | >= 22.x   | Tested on `22.17.1`                |
| npm         | >= 10.x   | Tested on `10.9.2`                 |

---

## Production Dependencies

| Package               | Version   | Purpose                                       |
|-----------------------|-----------|-----------------------------------------------|
| `next`                | 16.2.6    | React framework (App Router)                  |
| `react`               | 19.2.4    | UI library                                    |
| `react-dom`           | 19.2.4    | React DOM bindings                            |
| `framer-motion`       | 12.38.0   | Animation library (installed, not yet in use) |
| `recharts`            | 3.8.1     | SVG charting / data visualization             |
| `react-hook-form`     | 7.75.0    | Form state management                         |
| `@hookform/resolvers` | 5.2.2     | Validation resolvers for react-hook-form      |
| `zod`                 | 4.4.3     | Schema validation                             |
| `lucide-react`        | 1.16.0    | Icon library                                  |
| `clsx`                | 2.1.1     | Conditional className utility                 |
| `sonner`              | 2.0.7     | Toast notifications                           |

## Dev Dependencies

| Package               | Version   | Purpose                         |
|-----------------------|-----------|---------------------------------|
| `typescript`          | 5.9.3     | Language                        |
| `tailwindcss`         | 4.3.0     | Utility-first CSS framework     |
| `@tailwindcss/postcss`| 4.3.0     | PostCSS plugin for Tailwind v4  |
| `eslint`              | 9.39.4    | Linting                         |
| `eslint-config-next`  | 16.2.6    | Next.js ESLint rules            |
| `@types/node`         | 20.19.41  | Node.js type definitions        |
| `@types/react`        | 19.2.14   | React type definitions          |
| `@types/react-dom`    | 19.2.3    | React DOM type definitions      |

---

## Font

The app loads **Space Grotesk** from Google Fonts at runtime via `next/font`. No local font install is required.

---

## Animations in the Project

The dashboard uses **CSS keyframe animations** defined in `frontend/src/app/globals.css`:

- `animate-card-in` — card entrance (opacity + translateY, 0.35s)
- `animate-shimmer` — skeleton loading pulse (2.5s loop)
- `animate-dropdown-in` — dropdown scale-in (0.15s)
- `animate-alert-pulse` — red glow pulse for live alerts (1.5s loop)
- Tailwind utility classes: `animate-spin`, `transition-colors`, `transition-transform`

**Recharts** renders animated SVG charts on the Analytics page.

**Framer Motion** (`framer-motion@12.38.0`) is installed but not yet imported in any component. It may still contribute to bundle size and `node_modules` weight.

---

## Known Crash Scenarios & Fixes

### Symptom: Localhost crashes or freezes during animations

**Root cause is almost never RAM.** Likely culprits:

1. **Stale or corrupted `node_modules`** — Extraneous native-binding packages (`@emnapi/*`, `@napi-rs/*`) can appear from prior installs and cause runtime issues. A clean install fixes this.

2. **Recharts SVG re-renders** — The Analytics page renders full SVG chart trees. On lower-end CPUs this can spike the main thread. Navigating away from `/analytics` and back is a quick test.

3. **GPU compositing issues** — CSS animations using `transform` and `opacity` are GPU-accelerated. Outdated GPU drivers or browser versions can cause rendering glitches or crashes.

4. **Browser DevTools overhead** — Having the Elements panel or Performance monitor open while animations play can amplify jank into actual freezes.

---

## Clean Install Steps

Run these from the repo root:

```bash
cd frontend
rm -rf node_modules .next
npm ci
npm run dev
```

`npm ci` installs from `package-lock.json` exactly, removing extraneous packages. `rm -rf .next` clears the build cache.

If crashes persist after a clean install:
- Try a different browser (Chrome vs Firefox vs Safari)
- Disable hardware acceleration in browser settings temporarily
- Check `chrome://gpu` (Chrome) for driver issues
- Ensure Node.js version is 22.x (`node -v`)
