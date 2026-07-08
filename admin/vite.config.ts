import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  base: '/admin/',
  plugins: [react()],
  resolve: { alias: { '@shared': fileURLToPath(new URL('../src/shared', import.meta.url)) } },
  server: { fs: { allow: ['..'] } },
  build: { outDir: '../dist/admin', emptyOutDir: true },
});
