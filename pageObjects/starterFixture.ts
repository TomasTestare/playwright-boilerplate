import { test as base, expect } from "@playwright/test";
import ExamplePage from "./pages/example.page";
import { NetworkThrottler } from "../utils/networkProfiles";

export interface StarterFixtures {
  examplePage: ExamplePage;
  slowNetwork: NetworkThrottler;
}

/** Generic fixture. Register adapted pages and components here as the project grows. */
export const test = base.extend<StarterFixtures>({
  examplePage: async ({ page }, use) => {
    await use(new ExamplePage(page));
  },

  slowNetwork: async ({ page }, use) => {
    const throttler = new NetworkThrottler(page);
    await use(throttler);
    await throttler.close();
  },
});

export { expect };
