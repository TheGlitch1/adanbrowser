import { defineConfig } from 'vite';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, rmSync } from 'fs';

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

  plugins: [
    {
      name: 'move-html-files',
      closeBundle() {
        // Move HTML files to match manifest.json paths
        const distDir = resolve(__dirname, 'dist');
        
        // Create target directories
        mkdirSync(resolve(distDir, 'popup'), { recursive: true });
        mkdirSync(resolve(distDir, 'options'), { recursive: true });
        
        // Move HTML files from nested structure to correct locations
        copyFileSync(
          resolve(distDir, 'extension/src/popup/index.html'),
          resolve(distDir, 'popup/index.html')
        );
        copyFileSync(
          resolve(distDir, 'extension/src/options/index.html'),
          resolve(distDir, 'options/index.html')
        );
        
        // Clean up the nested extension/src directory
        rmSync(resolve(distDir, 'extension'), { recursive: true, force: true });
      },
    },
  ],

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
