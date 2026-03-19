'use strict';

var path = require('path');
var defineConfig = require('vitest/config').defineConfig;

module.exports = defineConfig({
    resolve: {
        alias: {
            famous: path.resolve(__dirname)
        }
    },
    test: {
        include: ['test/unit/**/*.test.js'],
        environment: 'node',
        globals: true
    }
});
