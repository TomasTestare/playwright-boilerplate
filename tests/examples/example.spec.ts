import { test, expect } from "../../pageObjects/starterFixture";

test.describe("Example application workflow", () => {
  test.skip("Adapt the route, data, and oracle after completing PROJECT-TEST-CONFIG", async ({ examplePage }) => {
    await examplePage.open(process.env.EXAMPLE_PATH || "/");

    await expect(examplePage.heading).toBeVisible();
  });
});
