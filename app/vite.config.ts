import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Relative base so the build works at any URL path (GitHub Pages serves it under /Sidekick-Admin-repo/).
  base: './',
  plugins: [react()],
});
