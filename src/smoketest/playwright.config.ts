import { defineConfig, devices } from '@playwright/test';


// Load env only for local runs
if (!process.env.CI) {
  require('dotenv').config({ path: '.env.smoketest' });
}


/**
 * Fail fast if required variables are missing.
 * (Do not log secret values)
 */
const requiredEnvVars = [
  'LiveEasUser',
  'MailasourDeviceConfig'
];

for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}


/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testIgnore: '**/example.spec.ts',
  testDir: './tests',
  timeout: 120_000,
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 2 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html'],
    ['list'], 
    ['junit', { outputFile: 'results.xml' }],   
    ['allure-playwright']
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: 'https://pp-findapprenticeshiptraining.apprenticeships.education.gov.uk',

    actionTimeout: 45_000,
    navigationTimeout: 45_000,

    /* Ignore HTTPS certificate errors for internal or self-signed staging sites. */
    ignoreHTTPSErrors: true,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'retain-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'Google Chrome',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Safari',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Microsoft Edge',
      use: { ...devices['Desktop Edge'] },
    },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
