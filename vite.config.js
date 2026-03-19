'use strict';

var path = require('path');
var commonjs = require('@rollup/plugin-commonjs');
var defineConfig = require('vite').defineConfig;
var glslify = require('vite-plugin-glslify').glslify;
var getBuildEntries = require('./scripts/build-entries').getBuildEntries;

var ROOT_DIR = __dirname;

module.exports = defineConfig({
    plugins: glslify().concat(
        commonjs({
            transformMixedEsModules: true
        })
    ),
    resolve: {
        alias: {
            famous: ROOT_DIR
        }
    },
    build: {
        emptyOutDir: false,
        sourcemap: true,
        target: 'es2020',
        rollupOptions: {
            preserveEntrySignatures: 'exports-only',
            input: getBuildEntries(ROOT_DIR),
            output: [
                {
                    dir: path.join(ROOT_DIR, 'dist/esm'),
                    format: 'es',
                    preserveModules: true,
                    preserveModulesRoot: ROOT_DIR,
                    entryFileNames: '[name].js',
                    assetFileNames: 'assets/[name]-[hash][extname]'
                },
                {
                    dir: path.join(ROOT_DIR, 'dist/cjs'),
                    format: 'cjs',
                    exports: 'named',
                    interop: 'auto',
                    preserveModules: true,
                    preserveModulesRoot: ROOT_DIR,
                    entryFileNames: '[name].cjs',
                    assetFileNames: 'assets/[name]-[hash][extname]'
                }
            ]
        }
    }
});
