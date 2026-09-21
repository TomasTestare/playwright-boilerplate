import { Locator } from "@playwright/test";
import { BasePageComponent } from "../base.pageComponent";

/** Generic cookie-consent component. Adapt the button name to the application. */
export default class Cookie extends BasePageComponent {
  constructor(host: Locator) {
    super(host);
  }

  get acceptButton(): Locator {
    return this.host.getByRole("button", { name: /accept|agree/i });
  }

  async accept(): Promise<void> {
    await this.acceptButton.click();
  }
}
