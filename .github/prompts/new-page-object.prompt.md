---
agent: agent
description: Scaffold a new Page Object, fixture entry, and spec following the boilerplate POM conventions.
---

# New Page Object

Generate a Page Object Model page from a URL or description, on-pattern with this repo. Read `.github/copilot-instructions.md` first.

Ask for: page name (e.g. `Login`), target path/URL, and key elements/actions if not provided.

Then create:

1. `pageObjects/pages/<name>.page.ts`
   - `export default class <Name>Page extends BasePage`.
   - Locators as `readonly` getters returning `Locator` (priority: `getByRole` → `getByTestId` → text).
   - Actions as async methods. `open()` calls `super.open("<path>")`.
2. Register in `pageObjects/starterFixture.ts` and add a fixture entry.
3. `tests/<name>.spec.ts`
   - `import { test, expect } from "../pageObjects/starterFixture"`.
   - `beforeEach` opens the page; web-first assertions on the page's getters; no raw `page.locator`.

Reuse existing components for shared areas (header/search/cookie); create a new component only for a genuinely reusable region. English, JSDoc on public methods, no `console`. Run the spec and confirm it compiles.
