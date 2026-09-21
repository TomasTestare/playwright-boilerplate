---
description: Diagnose and fix failing Playwright tests systematically using the configured application, APIs, page objects, and test mocks.
input: Failing test file(s) or test suite output
output: Fixed Playwright file(s) and a concise diagnostic summary explaining the root cause
---

# Skill: Fix and Heal Playwright Tests

This skill applies to the configured Playwright project. Read
`PROJECT-TEST-CONFIG.example.md` for the application URL, API contract,
authentication, selectors, fixtures, and service prerequisites. Do not invent
JWTs, cookies, users, roles, endpoints, or excluded behavior.

## Step 1 - Reproduce the failure

Run from the `playwright` directory:

```text
npm test -- tests/path/to/file.spec.ts --reporter=line
```

For one test:

```text
npm test -- tests/path/to/file.spec.ts -g "test title" --reporter=line
```

Set `BASE_URL` explicitly when the target project requires it. On PowerShell:

```powershell
$env:BASE_URL = "https://configured-application.example"
npm test -- tests/path/to/file.spec.ts --reporter=line
```

If the application is not running, stop and report that prerequisite instead
of changing tests to hide the failure.

Record each failing test, line number, error message, URL, and relevant
request/response status.

## Step 2 - Categorize the failure

| Symptom | Possible cause | Fix strategy |
|---|---|---|
| Locator timeout | React markup or page object is stale | Inspect the current React component and update the page object |
| Strict-mode violation | Locator matches several IDS elements, inputs, or sort controls | Scope it to the owning component or use a semantic, unique locator |
| Assertion misses visible state | State is exposed through an ARIA attribute or IDS shadow DOM | Inspect the rendered DOM and assert on the appropriate role, text, or attribute |
| Wrong localized text | UI copy changed or assertion is too exact | Read the current component and use a stable, meaningful text fragment |
| Login or identity endpoint returns 401 | Wrong entry URL or stale storage state | Inspect the documented authentication flow and response |
| API mock is ignored | Route pattern or HTTP method does not match the React request | Compare the mock with the browser request URL, method, and payload |
| Stale rows remain after search | Component does not clear data on empty/error response, or the test observes too early | Verify the request sequence and assert the empty/error state after the response |
| 401/403 behavior is wrong | Authentication redirect or permissions differ from the test assumption | Inspect the configured identity endpoint, current URL, and authorization behavior |
| 500 error assertion fails | Error message is rendered with a stable prefix or generic fallback | Assert the user-visible error state, not implementation details |
| Narrow viewport fails | Fixed-width header or table container is being measured incorrectly | Check the intended scroll container; tables may scroll while page content must reflow |
| Detail navigation fails | Row action or route changed | Inspect the relevant page object and the current React route |
| Flaky loading assertion | Async API/UI state is not settled | Prefer web-first assertions and request-aware waits; do not add arbitrary sleeps |

## Step 3 - Read the source before changing tests

Read only the relevant files, in this order:

1. The failing spec in `tests/`.
2. Its page object or component in `pageObjects/pages/` or
   `pageObjects/components/`.
3. Shared fixtures in `pageObjects/starterFixture.ts`.
4. Shared mock helpers, especially `tests/vanilla/mockApi.ts` and
   `tests/edge-cases/edge-case-mocks.ts`.
5. The application source documented by the project profile when rendered
   behavior is unclear.
6. The configured API controller or endpoint when request/response behavior is
   unclear.

Use existing page-object methods and locators. Do not put raw
`page.locator(...)` calls into specs when a page object can own the locator.
Do not duplicate an application-specific fixture when
`pageObjects/starterFixture.ts` already provides the required fixture.

## Step 4 - Apply and verify the smallest correct fix

1. Fix the root cause in the page object, mock, or test at the narrowest
   appropriate scope.
2. Preserve the test's business meaning; never weaken an assertion merely to
   make it pass.
3. Re-run the individual test.
4. Repeat diagnosis and correction when the failure exposes a related issue.
5. Do not automatically add `test.fixme()`. If a failure is a genuine product
   defect, an unavailable environment, or still unresolved, leave the test
   failing and report the evidence clearly.

Respect the repository rule that test-healing changes belong in `playwright/`
unless the developer explicitly requests an application change.

## Step 5 - Confirm the scope

After the targeted test passes, run its complete spec file:

```text
npm test -- tests/path/to/file.spec.ts --reporter=line
```

For a broader change, run the relevant suite and then the full suite:

```text
npm run test:chromium -- tests/vanilla/ tests/edge-cases/ --reporter=line
npm test -- --reporter=line
```

Integration tests require the configured services and application. Do not
interpret an unavailable dependency as a Playwright locator failure.

## Step 6 - Report the healing result

Use this format in the final response:

```text
## Healing Summary

### Fixed
- `tests/...` — what failed, the root cause, and the targeted change.

### Remaining
- `tests/...` — unresolved failure or unavailable prerequisite, with evidence.

### Verification
- Targeted test/spec result.
- Broader suite result, if run.
```

## Rules

- Always read the page object and relevant React/mock source before guessing.
- Prefer accessible roles, labels, and stable `data-testid` values.
- Prefer fixing a shared page object or mock over duplicating locator logic.
- Use only the documented authentication flow.
- Never create fake session cookies, tokens, or JWTs.
- Never hide a product defect by weakening an assertion or marking it
  `fixme()` automatically.
- Keep all changes within `playwright/` unless explicitly instructed otherwise.
