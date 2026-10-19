import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    include: ['tests/unit/**/*.test.ts', 'tests/integration/**/*.test.ts'],
    exclude: ['tests/e2e/**', 'node_modules/**'],
    environment: 'node',
    testTimeout: 30_000,
    hookTimeout: 60_000,
    pool: 'forks',
  },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
    /**
     * The `server-only` marker package resolves to an empty module under the
     * `react-server` condition and throws otherwise. The data-access layer
     * imports it so that it can never reach a browser bundle; the same
     * condition is needed here so the tests can import it.
     */
    conditions: ['react-server', 'node', 'import', 'default'],
  },
  ssr: {
    resolve: {
      conditions: ['react-server', 'node', 'import', 'default'],
    },
  },
});
