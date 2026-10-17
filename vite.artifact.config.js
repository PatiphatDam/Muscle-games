// Builds one self-contained HTML file (all JS/CSS inlined) for sharing.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  plugins: [react(), viteSingleFile()],
  build: {
    outDir: 'dist-artifact',
    emptyOutDir: true,
    rollupOptions: { input: 'artifact.html' },
  },
});
