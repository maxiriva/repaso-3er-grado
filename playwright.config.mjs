import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests",
  timeout: 60_000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: { baseURL: "http://localhost:8807", ...devices["Pixel 7"], viewport: { width: 375, height: 812 } },
  webServer: { command: "node scripts/serve.mjs 8807", url: "http://localhost:8807", reuseExistingServer: !process.env.CI },
});
