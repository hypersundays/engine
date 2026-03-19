'use strict';

var js = require('@eslint/js');
var globals = require('globals');

module.exports = [
    {
        ignores: [
            'node_modules/**',
            'dist/**',
            'coverage/**',
            'playwright-report/**',
            'test-results/**',
            'demo/dist/**',
            'components/test/**',
            'core/test/**',
            'dom-renderables/test/**',
            'dom-renderers/test/**',
            'math/test/**',
            'physics/test/**',
            'polyfills/test/**',
            'renderers/test/**',
            'render-loops/test/**',
            'transitions/test/**',
            'transitions/perf/**',
            'utilities/test/**',
            'webgl-geometries/test/**',
            'webgl-materials/test/**',
            'webgl-renderables/test/**',
            'webgl-renderers/test/**'
        ]
    },
    js.configs.recommended,
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'script',
            globals: Object.assign(
                {},
                globals.browser,
                globals.node,
                globals.worker
            )
        },
        rules: {
            'no-console': 'off',
            'no-prototype-builtins': 'off',
            'no-redeclare': 'off',
            'no-useless-assignment': 'off',
            'no-unused-vars': ['warn', { args: 'none', caughtErrors: 'none' }]
        }
    },
    {
        files: ['demo/src/**/*.js'],
        languageOptions: {
            sourceType: 'module'
        }
    },
    {
        files: ['test/**/*.js'],
        languageOptions: {
            globals: {
                describe: 'readonly',
                expect: 'readonly',
                it: 'readonly',
                vi: 'readonly'
            }
        }
    }
];
