import { Locator } from "@playwright/test";

/**
 * Base class for reusable page components.
 * A component wraps a host locator and exposes scoped locators + actions.
 */
export abstract class BasePageComponent {
  constructor(protected host: Locator) {}
}
