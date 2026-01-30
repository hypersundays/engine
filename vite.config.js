import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'index.js',
      name: 'famous',
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'famous.mjs' : 'famous.cjs')
    },
    rollupOptions: {
      output: {
        exports: 'named'
      }
    }
  }
});
