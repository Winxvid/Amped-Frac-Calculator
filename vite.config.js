import { defineConfig } from 'vite';

// Vanilla HTML calculator. Files in public/ are served at the site root
// (e.g. /new-amped-logo.png) and copied into dist/ on build.
export default defineConfig({
  publicDir: 'public',
  server: {
    port: 3000,
    open: false,
  },
  preview: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'assets',
  },
});
