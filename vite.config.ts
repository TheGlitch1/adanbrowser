import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // Copies everything in extension/public/ (including manifest.json) to dist/
  publicDir: 'extension/public',

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'extension/src/popup/index.html'),
        options: resolve(__dirname, 'extension/src/options/index.html'),
        background: resolve(__dirname, 'extension/src/background/index.ts'),
        content: resolve(__dirname, 'extension/src/content/index.ts'),
      },
      output: {
        // Keep background and content at predictable paths referenced by manifest.json
        entryFileNames: (chunk) => {
          if (chunk.name === 'background' || chunk.name === 'content') {
            return '[name]/index.js';
          }
          return 'assets/[name]-[hash].js';
        },
        chunkFileNames: 'shared/[name]-[hash].js',
        assetFileNames: 'assets/[name][extname]',
      },
    },
  },

  resolve: {
    alias: {
      '@lib': resolve(__dirname, 'extension/src/lib'),
      '@shared': resolve(__dirname, 'extension/src/shared'),
      '@domain': resolve(__dirname, 'extension/src/domain'),
      '@application': resolve(__dirname, 'extension/src/application'),
      '@infrastructure': resolve(__dirname, 'extension/src/infrastructure'),
    },
  },
});
