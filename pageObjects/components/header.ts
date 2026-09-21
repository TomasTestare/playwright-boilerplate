import { Locator } from "@playwright/test";
import { BasePageComponent } from "../base.pageComponent";

/** Generic header component. Adapt its locators to the target application. */
export default class Header extends BasePageComponent {
  constructor(host: Locator) {
    super(host);
  }

  get element(): Locator {
    return this.host;
  }
}
