# AmpdFrac Field Calculator

Hydraulic Fracturing Field Calculator web app.

## Stack

- Vanilla HTML/CSS/JS
- [Vite](https://vitejs.dev/) for local dev and production build
- Deployed on [Vercel](https://vercel.com/) with the **Vite** framework preset

## Local development

**Prerequisites:** Node.js 18+

```bash
npm install
npm run dev
```

App runs at `http://localhost:3000`.

## Build

```bash
npm run build
npm run preview   # optional: preview production build locally
```

Output goes to `dist/` (images from `public/` are copied to the dist root).

## Vercel

| Setting | Value |
|--------|--------|
| Framework Preset | **Vite** |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |
| Root Directory | `.` (repo root) |

Static images live in `public/` and are available at:

- `/new-amped-logo.png`
- `/Blender-icon.jpg`
- `/icon-hydraulic-frac.png`
