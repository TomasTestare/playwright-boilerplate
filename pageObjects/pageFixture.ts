import { test as base } from "@playwright/test";
import ExamplePage from "./pages/example.page";
import LoginPage from "./pages/LoginPage";
import VardperiodPage from "./pages/VardperiodPage";
import VardperiodDetailPage from "./pages/VardperiodDetailPage";
import VantandePage from "./pages/VantandePage";
import { AdministrationPage } from "./pages/AdministrationPage";
import { KlientPage } from "./pages/KlientPage";
import { KlientDetailPage } from "./pages/KlientDetailPage";
import { InfotextPage } from "./pages/InfotextPage";
import { BlacklistPage } from "./pages/BlacklistPage";
import { RetfilPage } from "./pages/RetfilPage";
import { TjansteRapportPage } from "./pages/TjansteRapportPage";
import SharedHeaderComponent from "./components/SharedHeaderComponent";
import SharedNavComponent from "./components/SharedNavComponent";
import SharedTableComponent from "./components/SharedTableComponent";
import SharedFormComponent from "./components/SharedFormComponent";
import SharedModalComponent from "./components/SharedModalComponent";
import FakeLoginComponent from "./components/FakeLoginComponent";
import VardperiodSearchComponent from "./components/VardperiodSearchComponent";
import VardperiodTableComponent from "./components/VardperiodTableComponent";
import VantandeTableComponent from "./components/VantandeTableComponent";
import VardhandelsePage from "./pages/VardhandelsePage";
import VardhandelseDetailPage from "./pages/VardhandelseDetailPage";
import OversiktsloggPage from "./pages/OversiktsloggPage";
import VardhandelseSearchComponent from "./components/VardhandelseSearchComponent";
import VardhandelseTableComponent from "./components/VardhandelseTableComponent";
import { NetworkThrottler } from "../utils/networkProfiles";

/**
 * Custom fixtures for UI tests. Add one entry per page object.
 */
export interface MyFixtures {
  examplePage: ExamplePage;
  loginPage: LoginPage;
  vardperiodPage: VardperiodPage;
  vardperiodDetailPage: VardperiodDetailPage;
  vantandePage: VantandePage;
  vardhandelsePage: VardhandelsePage;
  vardhandelseDetailPage: VardhandelseDetailPage;
  oversiktsloggPage: OversiktsloggPage;
  administrationPage: AdministrationPage;
  klientPage: KlientPage;
  klientDetailPage: KlientDetailPage;
  infotextPage: InfotextPage;
  blacklistPage: BlacklistPage;
  retfilPage: RetfilPage;
  tjansteRapportPage: TjansteRapportPage;
  fakeLoginComponent: FakeLoginComponent;
  sharedHeader: SharedHeaderComponent;
  sharedNav: SharedNavComponent;
  sharedTable: SharedTableComponent;
  sharedForm: SharedFormComponent;
  sharedModal: SharedModalComponent;
  vardperiodSearch: VardperiodSearchComponent;
  vardperiodTable: VardperiodTableComponent;
  vantandeTable: VantandeTableComponent;
  vardhandelseSearch: VardhandelseSearchComponent;
  vardhandelseTable: VardhandelseTableComponent;
  slowNetwork: NetworkThrottler;
}

/**
 * Extends Playwright `test` with project page objects and the network throttler.
 * Copy the `examplePage` block to register additional pages.
 * Shared component fixtures are available for component-specific tests.
 */
export const test = base.extend<MyFixtures>({
  examplePage: async ({ page }, use) => {
    await use(new ExamplePage(page));
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  vardperiodPage: async ({ page }, use) => {
    await use(new VardperiodPage(page));
  },

  vardperiodDetailPage: async ({ page }, use) => {
    await use(new VardperiodDetailPage(page));
  },

  vantandePage: async ({ page }, use) => {
    await use(new VantandePage(page));
  },

  vardhandelsePage: async ({ page }, use) => {
    await use(new VardhandelsePage(page));
  },

  vardhandelseDetailPage: async ({ page }, use) => {
    await use(new VardhandelseDetailPage(page));
  },

  oversiktsloggPage: async ({ page }, use) => {
    await use(new OversiktsloggPage(page));
  },

  administrationPage: async ({ page }, use) => {
    await use(new AdministrationPage(page));
  },

  klientPage: async ({ page }, use) => {
    await use(new KlientPage(page));
  },

  klientDetailPage: async ({ page }, use) => {
    await use(new KlientDetailPage(page));
  },

  infotextPage: async ({ page }, use) => {
    await use(new InfotextPage(page));
  },

  blacklistPage: async ({ page }, use) => {
    await use(new BlacklistPage(page));
  },

  retfilPage: async ({ page }, use) => {
    await use(new RetfilPage(page));
  },

  tjansteRapportPage: async ({ page }, use) => {
    await use(new TjansteRapportPage(page));
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
    const form = new SharedFormComponent(page.locator("form").or(page.locator("div").filter({ has: page.locator("form") })));
    await use(form);
  },

  sharedModal: async ({ page }, use) => {
    const modal = new SharedModalComponent(page.locator('[role="dialog"]'));
    await use(modal);
  },

  vardperiodSearch: async ({ page }, use) => {
    const search = new VardperiodSearchComponent(page.locator("form").first());
    await use(search);
  },

  vardperiodTable: async ({ page }, use) => {
    const table = new VardperiodTableComponent(
      page.locator("div").filter({ has: page.locator("table") })
    );
    await use(table);
  },

  vantandeTable: async ({ page }, use) => {
    const table = new VantandeTableComponent(
      page.locator("div").filter({ has: page.locator("table") })
    );
    await use(table);
  },

  vardhandelseSearch: async ({ page }, use) => {
    const search = new VardhandelseSearchComponent(page.locator("form").first());
    await use(search);
  },

  vardhandelseTable: async ({ page }, use) => {
    const table = new VardhandelseTableComponent(
      page.locator("div").filter({ has: page.locator("table") })
    );
    await use(table);
  },

  slowNetwork: async ({ page }, use) => {
    const throttler = new NetworkThrottler(page);
    await use(throttler);
    await throttler.close();
  },
});

// Re-export common Playwright objects for convenience.
export { expect, Page, Locator, Response } from "@playwright/test";
