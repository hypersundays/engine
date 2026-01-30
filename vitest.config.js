import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['modern-tests/**/*.test.js']
  }
});
