import { test as base, type Page } from "@playwright/test";
import ExamplePage from "./pages/example.page";
import LoginPage from "./pages/LoginPage";
import SharedHeaderComponent from "./components/SharedHeaderComponent";
import SharedNavComponent from "./components/SharedNavComponent";
import SharedTableComponent from "./components/SharedTableComponent";
import SharedFormComponent from "./components/SharedFormComponent";
import SharedModalComponent from "./components/SharedModalComponent";
import FakeLoginComponent from "./components/FakeLoginComponent";
import { NetworkThrottler } from "../utils/networkProfiles";
import { Logger } from "../utils/logger";

/**
 * GVR User info returned from /api/webb/me endpoint or mock data.
 */
export interface GvrUser {
  userId: string;
  role: "Visa" | "Admin" | "Utdrag" | "Uppdatera";
  environment: "local" | "test" | "prod";
}

/**
 * Custom fixtures for GVR UI tests.
 * Extends base Playwright test with GVR page objects, components, and test helpers.
 */
export interface GvrFixtures {
  examplePage: ExamplePage;
  loginPage: LoginPage;
  fakeLoginComponent: FakeLoginComponent;
  sharedHeader: SharedHeaderComponent;
  sharedNav: SharedNavComponent;
  sharedTable: SharedTableComponent;
  sharedForm: SharedFormComponent;
  sharedModal: SharedModalComponent;
  slowNetwork: NetworkThrottler;
  gvrHelper: GvrTestHelper;
}

/**
 * GVR test helper class for common test operations.
 * Provides login, logout, user info, and environment helpers.
 */
export class GvrTestHelper {
  private currentUser: GvrUser | null = null;

  constructor(private page: Page) {}

  /**
   * Login as a specific user with role.
   * Supports both fake login (local) and SAML flows (test/prod).
   *
   * @param userId - The HSA ID (e.g., "HSA-ID-12345")
   * @param role - User role: "Visa", "Admin", "Utdrag", or "Uppdatera"
   * @example
   * await gvrHelper.loginAsUser("HSA-ID-12345", "Visa");
   */
  async loginAsUser(userId: string, role: "Visa" | "Admin" | "Utdrag" | "Uppdatera"): Promise<void> {
    Logger.debug(`GvrTestHelper: Logging in as ${userId} with role ${role}`);

    // Detect environment by checking if fake login is available
    const isFakeLoginAvailable = await this.checkFakeLoginAvailability();

    if (isFakeLoginAvailable) {
      // Local development: use fake login endpoint
      await this.loginViaFakeLogin(userId, role);
    } else {
      // Test/Prod: use SAML (header-based authentication simulation)
      // In real SAML, the header is set by Apache/Shibboleth, not by tests
      // For testing, we simulate by calling the /api/webb/me endpoint directly
      // or by setting a session cookie if SAML is configured
      Logger.warn(
        "Fake login not available. Using SAML simulation. " +
          "In real test/prod environments, SAML is handled by Apache/Shibboleth.",
      );
      await this.loginViaSamlSimulation(userId, role);
    }

    // Store current user for later reference
    this.currentUser = {
      userId,
      role,
      environment: isFakeLoginAvailable ? "local" : "test",
    };
  }

  /**
   * Login via fake login endpoint (local development).
   * Calls POST /api/webb/fake/login?hsaId={userId}
   *
   * @param userId - HSA ID
   * @param role - User role
   */
  private async loginViaFakeLogin(userId: string, role: string): Promise<void> {
    Logger.debug(`GvrTestHelper: Using fake login endpoint for ${userId}`);

    const response = await this.page.request.post(
      `/api/webb/fake/login?hsaId=${encodeURIComponent(userId)}`,
    );

    if (!response.ok()) {
      Logger.error(`Fake login failed: ${response.status()} ${response.statusText()}`);
      throw new Error(`Fake login failed: ${response.status()}`);
    }

    // Navigate to app root to establish session
    await this.navigateToApp();
    Logger.info(`Logged in via fake login: ${userId} (${role})`);
  }

  /**
   * Simulate SAML login by adding the header normally set by Apache/Shibboleth.
   * In real test/prod environments, SAML is handled by Apache/Shibboleth proxy.
   * This is primarily for test automation fallback.
   *
   * @param userId - HSA ID
   * @param role - User role
   */
  private async loginViaSamlSimulation(userId: string, role: string): Promise<void> {
    Logger.debug(`GvrTestHelper: Simulating SAML login for ${userId}`);

    await this.page.setExtraHTTPHeaders({ employeeHsaId: userId });

    await this.navigateToApp();
    Logger.info(`Logged in via SAML simulation: ${userId} (${role})`);
  }

  /**
   * Navigate to app root (/).
   * Waits for page to load and verifies successful navigation.
   *
   * @example
   * await gvrHelper.navigateToApp();
   */
  async navigateToApp(): Promise<void> {
    Logger.debug("GvrTestHelper: Navigating to app root");
    await this.page.goto("/");
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Logout the current user.
   * Calls logout endpoint or clears session state.
   *
   * @example
   * await gvrHelper.logoutCurrentUser();
   */
  async logoutCurrentUser(): Promise<void> {
    Logger.debug("GvrTestHelper: Logging out");

    // Try to call logout endpoint
    const response = await this.page.request.post("/api/webb/logout", {
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok()) {
      Logger.info("Logged out successfully");
    } else {
      Logger.warn(`Logout returned ${response.status()}, clearing session manually`);
      // Clear cookies/session storage
      await this.page.context().clearCookies();
    }

    // Clear local current user
    this.currentUser = null;

    // Navigate to login page
    await this.page.goto("/fake-login");
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Get the current authenticated user info.
   * Returns the cached user info or fetches from /api/webb/me endpoint.
   *
   * @returns Current user info or null if not logged in
   * @example
   * const user = await gvrHelper.getCurrentUser();
   * console.log(user?.userId);
   */
  async getCurrentUser(): Promise<GvrUser | null> {
    Logger.debug("GvrTestHelper: Getting current user");

    if (this.currentUser) {
      return this.currentUser;
    }

    try {
      const response = await this.page.request.get("/api/webb/me");
      if (response.ok()) {
        this.currentUser = await response.json();
        return this.currentUser;
      }
    } catch (error) {
      Logger.debug("Failed to fetch current user from API");
    }

    return null;
  }

  /**
   * Get the application environment (local | test | prod).
   * Detected by checking if fake login is available.
   *
   * @returns Environment: "local" | "test" | "prod"
   * @example
   * const env = await gvrHelper.getEnvironment();
   * if (env === "local") {
   *   // use fake login
   * }
   */
  async getEnvironment(): Promise<"local" | "test" | "prod"> {
    Logger.debug("GvrTestHelper: Detecting environment");

    if (this.currentUser) {
      return this.currentUser.environment;
    }

    const isFakeLoginAvailable = await this.checkFakeLoginAvailability();
    return isFakeLoginAvailable ? "local" : "test";
  }

  /**
   * Check if fake login is available (local environment indicator).
   * Tries to fetch /api/webb/fake/options.
   *
   * @returns true if fake login is available, false otherwise
   */
  private async checkFakeLoginAvailability(): Promise<boolean> {
    try {
      const response = await this.page.request.get("/api/webb/fake/options", { timeout: 2000 });
      return response.ok();
    } catch {
      return false;
    }
  }

  /**
   * Get available test users from fake login endpoint (local only).
   *
   * @returns Array of available user IDs
   * @example
   * const users = await gvrHelper.getTestUsers();
   */
  async getTestUsers(): Promise<string[]> {
    Logger.debug("GvrTestHelper: Fetching test users");

    try {
      const response = await this.page.request.get("/api/webb/fake/options");
      if (response.ok()) {
        const data = await response.json();
        return Array.isArray(data) ? data : data.users || [];
      }
    } catch (error) {
      Logger.debug("Failed to fetch test users");
    }

    return [];
  }

  /**
   * Wait for the user to be authenticated.
   * Polls /api/webb/me until a valid response is returned.
   *
   * @param timeoutMs - Max wait time in milliseconds (default: 10000)
   * @example
   * await gvrHelper.waitForAuthentication();
   */
  async waitForAuthentication(timeoutMs: number = 10000): Promise<void> {
    Logger.debug(`GvrTestHelper: Waiting for authentication (timeout: ${timeoutMs}ms)`);

    const startTime = Date.now();
    while (Date.now() - startTime < timeoutMs) {
      try {
        const response = await this.page.request.get("/api/webb/me");
        if (response.ok()) {
          this.currentUser = await response.json();
          Logger.info("Authentication verified");
          return;
        }
      } catch {
        // Not authenticated yet, continue polling
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    throw new Error(`Timeout waiting for authentication after ${timeoutMs}ms`);
  }
}

/**
 * Extends Playwright `test` with GVR page objects, components, and custom helpers.
 * All fixtures are automatically initialized and available in test functions.
 *
 * @example
 * import { test, expect } from './pageObjects/gvrPageFixture';
 *
 * test('login and verify dashboard', async ({ loginPage, gvrHelper }) => {
 *   await loginPage.open();
 *   await gvrHelper.loginAsUser('HSA-ID-12345', 'Visa');
 *   const user = await gvrHelper.getCurrentUser();
 *   expect(user?.userId).toBe('HSA-ID-12345');
 * });
 */
export const test = base.extend<GvrFixtures>({
  examplePage: async ({ page }, use) => {
    await use(new ExamplePage(page));
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  fakeLoginComponent: async ({ page }, use) => {
    const mainContent = page.locator("div").filter({ has: page.locator("select") });
    const component = new FakeLoginComponent(mainContent);
    await use(component);
  },

  sharedHeader: async ({ page }, use) => {
    const header = new SharedHeaderComponent(page.locator("ids-wc-header-inera-general"));
    await use(header);
  },

  sharedNav: async ({ page }, use) => {
    const nav = new SharedNavComponent(page.locator("header"));
    await use(nav);
  },

  sharedTable: async ({ page }, use) => {
    const table = new SharedTableComponent(page.locator("div").filter({ has: page.locator("table") }));
    await use(table);
  },

  sharedForm: async ({ page }, use) => {
    const form = new SharedFormComponent(
      page.locator("form").or(page.locator("div").filter({ has: page.locator("form") })),
    );
    await use(form);
  },

  sharedModal: async ({ page }, use) => {
    const modal = new SharedModalComponent(page.locator('[role="dialog"]'));
    await use(modal);
  },

  slowNetwork: async ({ page }, use) => {
    const throttler = new NetworkThrottler(page);
    await use(throttler);
    await throttler.close();
  },

  gvrHelper: async ({ page }, use) => {
    const helper = new GvrTestHelper(page);
    await use(helper);
  },
});

// Re-export common Playwright objects for convenience.
export { expect } from "@playwright/test";
export type { Page, Locator, Response } from "@playwright/test";
