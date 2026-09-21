# Playwright Project Instructions

This directory contains reusable Playwright and TypeScript tests. Keep changes
focused, deterministic, and consistent with the Page Object Model. Read
`PROJECT-TEST-CONFIG.example.md` before implementing application-dependent
tests. If it is incomplete, ask one focused question or record `TBD`; do not
invent application behavior.

## Project boundaries and configuration

- Page objects and fixtures: `pageObjects/`
- Test specifications: `tests/`
- Shared helpers: `utils/`
- Configuration: `playwright.config.ts`, `.env`, and `PROJECT-TEST-CONFIG.example.md`
- Test plan and lifecycle: `TESTPLAN.md`
- Application source and API contracts: locations documented by the project profile

The starter has no default application URL, demo app, credentials, roles, or
authentication flow. Set `BASE_URL` and, when needed, `API_URL` explicitly.
Global setup performs no authentication. Never claim a test passed when the
application or a required service was unavailable.

## Agent lifecycle

For new coverage, use the applicable skills in this order:

`generate-tests` -> `exploratory-testing` -> `write-test` ->
`run-and-verify` -> `fix-and-heal`.

The test-design agent records candidates in `TESTPLAN.md`. Candidates start as
`Draft`, become `Ready for review` when evidence and an oracle are complete, and
require human approval as `Approved for implementation` before the Playwright
agent implements them. Use `Implemented` only after verification and `Blocked`
when a documented dependency prevents implementation.

## Test organization

- `tests/vanilla/`: normal workflows
- `tests/edge-cases/`: errors, validation, permissions, boundaries, and timing
- `tests/accessibility/`: semantics, keyboard, focus, and assistive technology
- `tests/integration/`: explicitly configured real-service workflows
- `tests/examples/`: optional starter examples

Use the API project only for files matching its configured API pattern. Install
route mocks before navigation. Integration tests require documented services,
data ownership, and cleanup.

## Page Object Model

- Pages extend `BasePage`; reusable components extend `BasePageComponent`.
- Pages own locators as `readonly` getters returning `Locator`.
- Components scope locators from `this.host`.
- Keep actions in domain language, not UI mechanics.
- Register every new page or component fixture in `pageObjects/starterFixture.ts`.
- Prefer existing page objects and components over duplicate locators.
- Do not use raw `page.locator(...)` in specs when a page object can own it.

Locator priority:

1. `getByRole(...)` and `getByLabel(...)`
2. `getByTestId(...)` using the configured test ID attribute
3. `getByText(...)` for visible assertions
4. CSS/XPath only when unavoidable, with a reason

## Reliable tests

- Use web-first assertions and meaningful URL, UI, or response readiness.
- Never use `page.waitForTimeout()`, arbitrary sleeps, or retry-only success.
- Keep tests independent, parallel-safe, and based on deterministic synthetic data.
- Verify HTTP method, URL, payload, status, and response shape for API behavior.
- For empty, unauthorized, forbidden, and server-error responses, verify stale
  protected data is cleared and the correct user-visible state is shown.
- After failed mutations, inspect state before retrying and clean up partial setup.
- Keep secrets and real personal data out of tests, traces, screenshots, and logs.

## Verification and reporting

Run the narrowest changed test first, then the relevant spec or suite. Classify
failures as product, test, fixture/mock, environment, or flaky. Do not weaken
assertions or mark failures as fixed merely to obtain a green run. Before
finishing, inspect the diff, run `git diff --check` when Git is available, and
report changed files, evidence level, commands, limitations, and blockers.

Use English for test names, documentation, and comments. Keep comments limited
to non-obvious reasoning and use the repository `Logger` in helpers where one
exists.
