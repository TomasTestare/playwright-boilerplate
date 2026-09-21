# Playwright Rules

These rules extend the generic `generate-tests` skill for tests written with
**Playwright** and TypeScript.

---

## Selectors

- Prefer role-based and semantic locators over CSS or XPath:
  ```ts
  page.getByRole('button', { name: 'Submit' })
  page.getByLabel('Email address')
  page.getByText('Order confirmed')
  page.getByPlaceholder('Search...')
  ```
- Use `data-testid` attributes as a fallback when semantic selectors are ambiguous:
  ```ts
  page.getByTestId('checkout-total')
  ```
- Never use XPath or brittle CSS selectors (`.btn-primary`, `nth-child(3)`) unless there is no alternative. Add a comment explaining why if you must.

---

## Waiting and Async

- Never use `page.waitForTimeout()` (hard sleeps). Always wait for a specific condition:
  ```ts
  await expect(page.getByRole('status')).toBeVisible()
  await page.waitForURL('**/dashboard')
  await page.waitForResponse(resp => resp.url().includes('/api/orders'))
  ```
- Use `await expect(...).toBeVisible()` or `await expect(...).toHaveText(...)` — Playwright's `expect` has built-in auto-retry.

---

## Test Structure

- Use `test.describe` blocks to group related tests for a single feature or page.
- Use `test.beforeEach` to set up shared preconditions (navigation, login) rather than repeating them in each test.
- Use `test.afterEach` only for cleanup that is strictly necessary (e.g., deleting created records via API).

```ts
test.describe('Cart — add item', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/products/123')
  })

  test('adds item to cart when quantity is valid', async ({ page }) => {
    // Arrange
    await page.getByLabel('Quantity').fill('2')
    // Act
    await page.getByRole('button', { name: 'Add to cart' }).click()
    // Assert
    await expect(page.getByRole('status')).toHaveText('2 items in cart')
  })
})
```

---

## Authentication

- Use the shared fixtures in `pageObjects/starterFixture.ts`.
- Follow the approved authentication flow documented in the project profile.
- Do not invent cookies, JWTs, tokens, users, or roles. Keep authentication
  disabled until the project contract supplies the required details.
- Reuse project mock helpers for setup where applicable.

---

## Assertions

- Prefer Playwright's web-first assertions (`expect(locator)`) over generic Node assertions — they retry automatically:
  ```ts
  // Good
  await expect(page.getByRole('heading')).toHaveText('Checkout complete')

  // Avoid
  const text = await page.getByRole('heading').innerText()
  expect(text).toBe('Checkout complete')
  ```
- Assert the user-visible outcome (text, visibility, URL) rather than internal DOM state.

---

## Page Objects

- For features with more than ~3 tests, extract interactions into a Page Object class stored in `pageObjects/pages/` or `pageObjects/components/`, and register new fixtures in `pageObjects/starterFixture.ts`.
- Page Object methods should describe actions in domain language (`checkout.placeOrder()`), not UI mechanics (`checkout.clickSubmitButton()`).

---

## Network / API

- For integration tests that depend on backend data, use the existing API helpers and clean up created data in `afterEach` where required.
- Use `page.route()` to mock network responses only when testing frontend error-handling behaviour (e.g., how the UI reacts to a 500 response).

---

## Configuration

- Tests should pick up `baseURL` from `playwright.config.ts` — never hardcode URLs inside test files.
- Use Playwright projects to run the same tests across browsers if cross-browser coverage is required.
