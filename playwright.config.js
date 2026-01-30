import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'modern-tests/browser',
  use: {
    headless: true
  }
});
