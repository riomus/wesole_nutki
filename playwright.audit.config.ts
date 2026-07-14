import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/audits',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  outputDir: 'test-results/wcag',
  reporter: [['html', { outputFolder: 'test-results/wcag-report', open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:1313',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'node scripts/serve-audit.mjs',
    url: 'http://127.0.0.1:1313/pl/',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
