import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => ({
  // GitHub project Pages lives beneath /world-map/; local development stays at /.
  base: mode === 'github-pages' ? '/world-map/' : '/',
  plugins: [react(), tailwindcss()],
}));
