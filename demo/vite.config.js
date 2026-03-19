const path = require('path');
const { defineConfig } = require('vite');

const packageDist = path.resolve(__dirname, '..', 'dist', 'esm');

module.exports = defineConfig({
  root: __dirname,
  resolve: {
    alias: {
      famous: packageDist
    }
  },
  server: {
    port: 5173,
    open: false
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
});
