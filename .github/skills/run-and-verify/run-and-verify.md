---
description: Run Playwright tests, diagnose failures, and verify targeted fixes without hiding product defects.
input: Written or failing Playwright test file(s)
output: Test results, applied fixes, and clearly reported blockers
---

# Skill: Run and Verify Playwright Tests

Run commands from the Playwright directory. Configure `BASE_URL` and required
services explicitly before running application-dependent tests.

## Step 1 - Run the narrowest useful scope

Run one test file first:

```text
npm test -- tests/path/to/file.spec.ts --reporter=line
```

Run one test by title:

```text
npm test -- tests/path/to/file.spec.ts -g "test title" --reporter=line
```

Then run the complete file. For the full suite:

```text
npm test -- --reporter=line
```

On PowerShell, set the URL explicitly when needed:

```powershell
$env:BASE_URL = "https://configured-application.example"
npm test -- tests/path/to/file.spec.ts --reporter=line
```

## Step 2 - Read and classify failures

Record the test title, line number, error, URL, and relevant request status.

| Failure | Possible cause | Action |
|---|---|---|
| Locator timeout | React markup or page object is stale | Inspect the current page object and React component |
| Strict-mode violation | Locator matches multiple IDS controls or table elements | Scope by role, label, `data-testid`, or owning component |
| 401 from the configured API | Missing session or wrong login flow | Verify the documented authentication setup |
| 403 or unexpected access | Permission setup or authorization expectation is wrong | Verify each documented permission context |
| Mock not used | Route does not match the actual method or URL | Compare the browser request with the mock in the relevant helper |
| Stale data after empty/error response | UI state is not cleared or assertion runs too early | Verify response handling and assert the user-visible state |
| 500 assertion mismatch | Error copy or stable prefix changed | Inspect the rendered error message and assert its meaningful visible text |
| Responsive failure | Wrong scroll container is measured, or a fixed-width element overflows | Distinguish page reflow from intentionally scrollable tables |
| `ERR_CONNECTION_REFUSED` | Application or service is not running | Report the unavailable prerequisite; do not modify the test |
| Integration setup failure | A documented service, database, or test-data dependency is unavailable | Report the dependency failure separately from UI failures |

## Step 3 - Fix and re-run

1. Read the failing spec, its page object/component, fixtures, mocks, and
   relevant React/BFF source before changing code.
2. Apply the smallest correct fix in `playwright/`.
3. Prefer fixing a shared page object or mock over duplicating logic in a spec.
4. Re-run the individual test, then the complete spec file.
5. Do not weaken assertions, add arbitrary sleeps, or automatically mark a
   failure as `test.fixme()`. Report genuine product defects and blockers.

Use web-first assertions and request-aware synchronization instead of
`page.waitForTimeout()`.

## Step 4 - Report the result

```text
## Test Results

### Passing
- `tests/...` — test or spec result

### Blocked or failing
- `tests/...` — evidence and whether the cause is product, test, or environment

### Fixes applied
- `playwright/...` — concise description of the root cause and change
```

## Rules

- Never report a test as passing without running it.
- Use only the documented authentication flow.
- Never invent cookies, JWTs, tokens, or roles.
- Never change an assertion solely to make a test pass.
- Keep changes within `playwright/` unless explicitly instructed otherwise.
