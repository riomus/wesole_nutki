import { defineConfig, devices } from '@playwright/test';

// Support testing with base path (e.g., /wesole_nutki/) for production-like testing
const useBasePath = process.env.BASEPATH === 'true';
const baseURL = useBasePath
  ? 'http://localhost:1313/wesole_nutki/'
  : 'http://localhost:1313';
const serverCommand = useBasePath
  ? 'hugo server --port 1313 --baseURL http://localhost:1313/wesole_nutki/ --appendPort=false'
  : 'hugo server --port 1313';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: serverCommand,
    port: 1313,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
