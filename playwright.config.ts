import { defineConfig, devices } from '@playwright/test';

/**
 * The end-to-end suite drives the real application: a real server, a real
 * PostgreSQL, and a real browser.
 *
 * The browser is the system Chromium rather than a Playwright download, so the
 * suite runs without fetching anything.
 */
const PORT = Number(process.env.E2E_PORT ?? 3100);
const baseURL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 60_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list']],

  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    launchOptions: {
      executablePath: process.env.CHROMIUM_PATH ?? '/usr/bin/chromium',
      args: ['--no-sandbox', '--disable-dev-shm-usage'],
    },
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    // `npm run dev` starts the local database and the application together.
    command: 'npm run dev',
    url: baseURL,
    reuseExistingServer: false,
    timeout: 180_000,
    stdout: 'pipe',
    stderr: 'pipe',
    env: {
      PORT: String(PORT),
      PGLITE_PORT: process.env.PGLITE_PORT ?? '5433',
      PGLITE_PATH: process.env.PGLITE_PATH ?? './.data/pglite',
    },
  },
});
