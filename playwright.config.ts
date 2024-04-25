import { defineConfig, devices } from '@playwright/test'
require('dotenv').config()

const ZONE = (process.env.ZONE)?.toString || 'local'
const RETRIES = Number(process.env.RETRIES) || 0

export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Retry on FAIL only */
  retries: RETRIES,
  /* Reporter type to use */
  reporter: 'html',
  /* Shared settings for all the projects below */
  use: {
    /* headless mode */
    headless: true,

    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: ZONE === 'prod' ? 'https://www.DefaultBaseUrl/' : 'http://localhost:3000',

    /* Collect trace when retrying the failed test */
    trace: 'on-first-retry',

    /* Record a video for each test */
    video: 'on',

    screenshot: 'on'
  },

  /* Configure projects for major test suites */
  projects: [
    {
      name: 'setup',
      testMatch: /global.setup\.ts/,
      teardown: 'teardown',
    },
    {
      name: 'teardown',
      testMatch: /global.teardown\.ts/,
    },
    {
      name: 'unitySanity',
      use: devices['Desktop Chrome'],
      dependencies: ['setup']
    },
    {
      name: 'chromium',
      use: devices['Desktop Chrome'],
      dependencies: ['setup']
    },
    {
      name: 'firefox',
      use: devices['Desktop Firefox'],
      dependencies: ['setup']
    },
    {
      name: 'Safari',
      use: devices['Desktop Safari'],
      dependencies: ['setup']
    },
    {
      name: 'Google Chrome',
      use: devices['Desktop Chrome'],
      dependencies: ['setup']
    },
    {
      name: 'Google Chrome Beta',
      use: { ...devices['Desktop Chrome'], channel: 'chrome-beta' },
      dependencies: ['setup']
    },
    {
      name: 'Microsoft Edge',
      use: devices['Desktop Edge'],
      dependencies: ['setup']
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] }
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] }
    }
  ]
})
