---
name: generate-tests
description: Generate Playwright tests from a confirmed application specification.
---

## Guiding principle

Tests describe what the system should do, not what the current implementation
happens to do. Derive behavior from a requirement or explicit user description,
then inspect source only to confirm routes, APIs, locators, and test seams.

## Step 1 — Confirm scope

When the request is unclear, ask:

1. What feature or workflow is under test?
2. What is the happy path?
3. Which failures, boundaries, permissions, and timing cases matter?
4. What acceptance criteria or requirement evidence exists?
5. What is explicitly out of scope?

Do not proceed until the feature and expected outcomes are clear. If the user
provides a specification, confirm only ambiguous points.

## Step 2 — Define behavior

Write numbered statements in this form and obtain confirmation:

```text
Given [precondition], when [action], then [observable outcome].
```

Each statement should identify the user context, data, state transition, and
oracle. Do not invent routes, roles, selectors, credentials, response shapes,
or test data. Mark unknowns `TBD` and ask one focused question when they block
implementation.

## Step 3 — Confirm framework and project contract

Confirm or infer from the repository:

- TypeScript and Playwright are used
- Test type: UI, API, accessibility, integration, or combination
- Test directory and project name
- Fixture, page-object, selector, mock, and data conventions
- Configured `BASE_URL`, `API_URL`, authentication, and cleanup

Read `.github/skills/generate-tests/rules/playwright-rules.md` and
`PROJECT-TEST-CONFIG.example.md`. Application-dependent tests are not valid
until their target and prerequisites are explicitly configured.

## Step 4 — Draft or implement

Use one assertion focus per test, descriptive names, arrange/act/assert
structure, stable data, and independent setup. Assert observable behavior, not
private implementation details. Use the Page Object Model for reusable
interactions and install route mocks before navigation.

Direct implementation is allowed only after the behavior is confirmed and,
when using `TESTPLAN.md`, the candidate is `Approved for implementation`.

## Step 5 — Review and iterate

Present each generated test alongside the behavior statement it covers. Ask:

- Does this reflect the expected behavior?
- Are any failure or boundary cases missing or incorrect?
- Are environment, authentication, data, and cleanup assumptions evidenced?

Revise until confirmed. Report what is covered, what is intentionally excluded,
any `TBD` items, and the verification command.

