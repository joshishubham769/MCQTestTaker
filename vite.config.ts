import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  base: './', // Ensures relative assets loading on GitHub Pages or any subpath
  plugins: [
    react(),
    tailwindcss(),
  ],
});
