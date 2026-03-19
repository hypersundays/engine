'use strict';

var defineConfig = require('@playwright/test').defineConfig;

module.exports = defineConfig({
    testDir: './test/browser',
    timeout: 30000,
    retries: process.env.CI ? 2 : 0,
    use: {
        baseURL: 'http://127.0.0.1:4178',
        trace: 'on-first-retry'
    },
    webServer: {
        command: 'npm run demo:build && npm run demo:preview -- --host 127.0.0.1 --port 4178',
        url: 'http://127.0.0.1:4178',
        reuseExistingServer: false,
        timeout: 120000
    }
});
