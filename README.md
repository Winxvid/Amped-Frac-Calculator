# AmpdFrac Field Calculator

Hydraulic fracturing field calculator — **React + Vite** app with a full suite of Math, Sand, Chem, Hydration, Blender, LIME, Wellbore, and Horsepower tools.

## Stack

| Layer | Tech |
|--------|------|
| UI framework | **React 19** |
| Build | **Vite 6** |
| Language | **TypeScript** (shell) + migrated calculator engine |
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
  main.tsx              # React entry
  App.tsx               # App root (mounts UI + boots engine)
  styles/               # Global CSS (migrated + mobile shell)
  legacy/
    content.html        # Full app markup (tools, nav, settings)
    engine.js           # Calculator engine, favorites, profiles
  lib/formulas.ts       # Pure formula helpers for React rewrites
  context/              # React providers (expand over time)
  components/           # Pure React UI (add as you rewrite)
public/                 # Logos & dashboard icons
```

## Architecture (migration phases)

1. **Done — React host**  
   React owns the app root; calculator engine boots under it.

2. **Done — shell in React (Phase 2)**  
   Pure React: `Header`, `Sidebar`, `SettingsPanel`, `Dashboard` (favorites + nav cards).  
   Contexts: `ThemeProvider`, `FavoritesProvider`, `NavigationProvider`.  
   Calculator tool pages still run via `legacy/engine.js` + `legacy/tools.html`.

3. **Next — section rewrites**  
   Move Math / Sand / Chem / … into React feature modules that call `lib/formulas.ts`.

4. **Mobile**  
   - **PWA** (quick): installable mobile web  
   - **Capacitor** (native store): wrap this Vite build for iOS/Android  
   - **React Native** (later): reuse formula modules and design tokens  

## Company profiles & favorites

Still available in **Settings (⚙)** and **Home → Favorites**. Preferences stay in `localStorage` on the device.

## Vercel

| Setting | Value |
|--------|--------|
| Framework | **Vite** |
| Build | `npm run build` |
| Output | `dist` |
| Install | `npm install` |
