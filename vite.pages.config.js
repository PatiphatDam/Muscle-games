// Static build for GitHub Pages. Relative base so it works under /<repo-name>/.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: 'dist-pages',
    emptyOutDir: true,
    rollupOptions: { input: 'pages.html' },
  },
});
