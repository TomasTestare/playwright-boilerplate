import { Locator } from "@playwright/test";
import { BasePageComponent } from "../base.pageComponent";

/** Generic search component. Adapt labels and actions to the target application. */
export default class Search extends BasePageComponent {
  constructor(host: Locator) {
    super(host);
  }

  get input(): Locator {
    return this.host.getByRole("searchbox");
  }

  get submitButton(): Locator {
    return this.host.getByRole("button", { name: /search/i });
  }

  async search(value: string): Promise<void> {
    await this.input.fill(value);
    await this.submitButton.click();
  }
}
