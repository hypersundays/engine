const path = require('path');
const { defineConfig } = require('vite');
const commonjs = require('@rollup/plugin-commonjs');

module.exports = defineConfig({
  root: __dirname,
  plugins: [
    commonjs({
      include: [/engine/],
      transformMixedEsModules: true
    })
  ],
  resolve: {
    alias: {
      famous: path.resolve(__dirname, '..')
    }
  },
  server: {
    port: 5173,
    open: true
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
});
