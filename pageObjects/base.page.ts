import { Page } from "@playwright/test";
import { Logger } from "../utils/logger";

import Header from "./components/header";
import Search from "./components/search";
import Cookie from "./components/cookie";

/**
 * Base class for all page objects.
 * Composes reusable components and provides common navigation helpers.
 * Extend this for your own pages and add page-specific locators/methods.
 */
export abstract class BasePage {
  /** Example header component. Replace selectors to match your app. */
  readonly header: Header;

  /** Example search component. Replace selectors to match your app. */
  readonly search: Search;

  /** Example cookie-consent component. Replace selectors to match your app. */
  readonly cookie: Cookie;

  constructor(protected page: Page) {
    this.header = new Header(page.locator("header"));
    this.search = new Search(page.getByRole("search"));
    this.cookie = new Cookie(page.getByRole("dialog"));
  }

  /** Navigates to a path with logging and error handling. */
  async open(path: string): Promise<void> {
    Logger.debug(`Navigating to path: ${path}`);
    try {
      await this.page.goto(path);
    } catch (error) {
      Logger.error(`Failed to navigate to path: ${path}`, error);
      throw error;
    }
  }

  /** Returns true if the given selector is visible. */
  async isOpen(selector: string): Promise<boolean> {
    return this.page.locator(selector).isVisible();
  }

  /** Waits until the given selector is visible. */
  async waitForLoad(selector: string): Promise<void> {
    await this.page.locator(selector).waitFor({ state: "visible" });
  }

  /** Returns the page title. */
  async getPageTitle(): Promise<string> {
    return this.page.title();
  }
}
