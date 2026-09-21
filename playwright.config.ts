import { defineConfig, devices } from "@playwright/test";
import "dotenv/config";

const slowMo = Number.parseInt(process.env.PW_SLOW_MO || "0", 10);
const baseURL = process.env.BASE_URL || undefined;
const apiBaseURL = process.env.API_URL || undefined;

const browserUse = {
  ...devices["Desktop Chrome"],
  ...(baseURL ? { baseURL } : {}),
  viewport: { width: 1280, height: 720 },
  launchOptions: { slowMo },
  testIdAttribute: process.env.TEST_ID_ATTRIBUTE || "data-testid",
  trace: "retain-on-first-failure" as const,
  video: "retain-on-failure" as const,
};

const xrayOptions = {
  jira: {
    url: process.env.JIRA_URL || "",
    type: "cloud" as const,
    apiVersion: "1.0",
  },
  cloud: {
    client_id: process.env.XRAY_CLIENT_ID || "",
    client_secret: process.env.XRAY_CLIENT_SECRET || "",
    ...(process.env.XRAY_URL ? { xrayUrl: process.env.XRAY_URL } : {}),
  },
  projectKey: process.env.XRAY_PROJECT_KEY || "",
  testPlan: process.env.XRAY_TEST_PLAN || "",
  debug: process.env.XRAY_DEBUG === "true",
};

const config = defineConfig({
  // Authentication is project-specific and intentionally not performed here.
  // Configure a project-specific setup only after documenting its contract.
  globalSetup: require.resolve("./global-setup"),
  expect: { timeout: 5000 },
  timeout: 30_000,
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 3 : undefined,
  reporter: process.env.CI ? [["dot"], ["html", { open: "never" }]] : process.env.XRAY_CLIENT_ID ? [["line"], ["html", { open: "never" }], ["playwright-xray", xrayOptions]] : [["line"], ["html", { open: "never" }]],
  projects: [
    {
      name: "chromium",
      use: browserUse,
    },
    {
      name: "API",
      testMatch: /.*api.*\.spec\.ts/,
      use: {
        ...(apiBaseURL ? { baseURL: apiBaseURL } : {}),
        ignoreHTTPSErrors: true,
      },
    },
  ],
});

export default config;
