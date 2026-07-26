# AmpdFrac Field Calculator

Hydraulic fracturing field calculator — **React + Vite** app with a full suite of Math, Sand, Chem, Hydration, Blender, LIME, Wellbore, and Horsepower tools.

## Stack

| Layer | Tech |
|--------|------|
| UI framework | **React 19** |
| Build | **Vite 6** |
| Language | **TypeScript** |
| Motion (ready) | **framer-motion** |
| Deploy | Vercel (`npm run build` → `dist/`) |

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run preview
```

## Project layout

```
src/
  main.tsx                 # React entry
  App.tsx                  # Shell + all calculator sections
  styles/                  # Global CSS
  lib/formulas.ts          # Pure field-math helpers
  context/                 # Theme, Favorites, Navigation, CalcState
  components/              # Shell UI, ToolCard, NumField
  features/
    math/                  # Fundamental Math
    sand/                  # Sand
    chem/                  # Chemicals
    hydration/             # Hydration / gel
    blender/               # Blender
    lime/                  # LIME calibration
    wellbore/              # Wellbore
    hp/                    # Horsepower / pumps
    shared/fieldData.ts    # Shared tables (proppant, totes, tubulars…)
  legacy/                  # Unused engine HTML (kept for reference)
public/                    # Logos & dashboard icons
```

## Architecture

1. **Done — React host** — React owns the app root.
2. **Done — shell (Phase 2)** — Header, Sidebar, Settings, Dashboard + favorites.
3. **Done — section rewrites (Phase 3)** — All calculator tabs are pure React pages. No runtime dependency on `legacy/engine.js`.
4. **Next — mobile**
   - **PWA** (quick): installable mobile web
   - **Capacitor** (native store): wrap this Vite build for iOS/Android
   - **React Native** (later): reuse formula modules and design tokens

## Company profiles & favorites

Available in **Settings (⚙)** and **Home → Favorites**. Preferences stay in `localStorage` on the device.

Profiles: **Default**, **Amped**, **Liberty** (A/B color variants).

## Vercel

| Setting | Value |
|--------|--------|
| Framework | **Vite** |
| Build | `npm run build` |
| Output | `dist` |
| Install | `npm install` |
