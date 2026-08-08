import {defineConfig, devices} from '@playwright/test';

const baseURL = 'http://localhost:3000';

export default defineConfig({
    testDir: './tests/e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: [
        ['list'],
        ['html', {outputFolder: 'output/playwright/report', open: 'never'}]
    ],
    outputDir: 'output/playwright/test-results',
    use: {
        baseURL,
        trace: 'on-first-retry',
        screenshot: 'only-on-failure'
    },
    projects: [
        {
            name: 'chromium',
            use: {...devices['Desktop Chrome']}
        }
    ],
    webServer: {
        command: 'corepack yarn dev',
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000
    }
});
