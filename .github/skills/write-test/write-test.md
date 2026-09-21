---
description: Write Playwright test files from a confirmed specification, following the project's TypeScript, Page Object Model, API, and mock conventions.
input: Confirmed feature specification or acceptance criteria
output: One or more Playwright test files in the configured test directory
---

# Skill: Write Playwright Tests

## Step 0 — Check project conventions

Read representative tests if they exist, the project profile, fixture file,
configuration, and relevant page objects. Confirm:

- Import and fixture patterns
- Test ID attribute and selector conventions
- Authentication and storage-state policy
- API and mock helpers
- Test directory and project selection

If a required contract is missing, ask one focused question or record `TBD`;
do not invent it.

## Step 1 — Choose the test layer

| Scope | Typical path |
|---|---|
| Happy-path UI | `tests/vanilla/<name>.spec.ts` |
| Error and boundary | `tests/edge-cases/<name>.spec.ts` |
| Accessibility | `tests/accessibility/<name>.spec.ts` |
| Service-backed flow | `tests/integration/<name>.spec.ts` |
| HTTP contract | Project-configured API test location |

Append to an existing feature suite when appropriate rather than duplicating
setup or page objects.

## Step 2 — Write the test

Use descriptive names, one assertion focus per test, and arrange/act/assert
structure. Prefer:

1. `getByRole` and `getByLabel`
2. `getByTestId` using the configured attribute
3. `getByText` for visible content
4. CSS/XPath only when unavoidable, with a reason

Use web-first assertions and meaningful URL, UI, or response readiness. Never
use `page.waitForTimeout()`, arbitrary sleeps, random data, or hidden retries.
Install route mocks before navigation. Verify API method, URL, payload, status,
and response shape when the contract is in scope.

For workflows with reusable interactions, extend the closest page object or
component and register it in `pageObjects/starterFixture.ts`. Keep raw locators
out of specs when a page object can own them.

## Step 3 — Authentication and prerequisites

| Scenario | Setup |
|---|---|
| Mock UI | Install documented route mocks before navigation |
| Authenticated flow | Use the approved project login flow |
| Permission test | Use documented roles or permission contexts |
| Integration | Confirm services, own data, and clean up in `finally` |

Do not invent users, cookies, JWTs, tokens, roles, URLs, or API response data.

## Step 4 — Verify

Immediately run the changed test using the configured environment, then the
complete spec and relevant suite. Follow `run-and-verify.md`; classify blockers
instead of weakening assertions. Update the approved test-plan candidate to
`Implemented` only after verification.

## Output

Report files written, behavior statements covered, intentionally excluded cases,
commands run, evidence level, and unresolved `TBD` items. Then continue with
`run-and-verify.md`.
