import { Page } from "@playwright/test";
import { BasePage } from "../base.page";

/** Minimal page object to copy and adapt for a real application. */
export default class ExamplePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get heading() {
    return this.page.getByRole("heading").first();
  }

  async open(path = "/"): Promise<void> {
    await super.open(path);
  }
}
