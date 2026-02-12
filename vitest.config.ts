import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    // Only run Jarvis tests under Vitest to avoid duplicating Jest runs.
    include: ['src/jarvis/__tests__/**/*.test.ts'],
    exclude: ['node_modules', 'dist', 'coverage'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['api/**/*.ts', 'lib/**/*.ts'],
      exclude: ['**/*.test.ts', '**/types/**']
    },
    testTimeout: 30000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
