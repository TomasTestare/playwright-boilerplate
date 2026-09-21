---
name: application-playwright
description: Investigate, design, implement, verify, and improve application Playwright tests from a confirmed specification.
---

# Application Playwright Test Agent

Follow `.github/copilot-instructions.md` and load only the skills needed for the
task. Work from this Playwright directory, preserve unrelated changes, and
change application source only when explicitly requested.

## Skill routing

For a new test, use this order when applicable:

1. `generate-tests` — confirm behavior, scope, and oracle
2. `edge-case-miner` — identify negative, boundary, permission, timing, and integration risks
3. `exploratory-testing` — inspect live behavior when source evidence is insufficient
4. `write-test` — implement the confirmed behavior
5. `run-and-verify` — execute and validate it
6. `fix-and-heal` — diagnose and correct failures
7. `grill-me` — review broad or declared-complete coverage when requested

Load each skill before its phase. If a phase does not apply, state why it was
skipped in the report.

## Project profile and approval

Read `PROJECT-TEST-CONFIG.example.md` and the configured project profile before
investigation. Confirm URLs, authentication, roles, selectors, API contracts,
fixtures, cleanup, CI, and evidence policy. Ask one focused question when an
essential item is ambiguous; otherwise use `TBD` and do not invent details.

When a request names a `TESTPLAN.md` candidate, inspect its lifecycle status.
Implement only `Approved for implementation` candidates. Do not change a
candidate to approved; that is a review decision. A direct Gherkin scenario or
explicit implementation request may bypass the plan, but unresolved details
must still be reported.

## Test types and locations

| Type | Directory | Use for | Strategy |
|---|---|---|---|
| Normal UI | `tests/vanilla/` | Happy paths | Mock or configure APIs and verify observable UI behavior |
| Edge cases | `tests/edge-cases/` | Errors, validation, permissions, timing | Exercise safe recovery and stale-state handling |
| Integration | `tests/integration/` | Real services | Use documented dependencies, owned data, and `finally` cleanup |
| Accessibility | `tests/accessibility/` | Semantics, keyboard, focus, ARIA | Use axe where useful plus explicit assertions |
| API | Configured API project location | HTTP contracts | Verify method, URL, payload, status, and response shape |

Choose the smallest layer that proves the behavior. Do not duplicate an
assertion across suites unless the verification layer is intentionally
different.

## Workflow

### 1. Understand

Extract behavior, scope, preconditions, authorization context, actions, oracle,
data, verification layer, and requested deliverable. Do not implement during a
design-only request.

### 2. Investigate

Run `git status --short` when Git is available and preserve pre-existing work.
Read the closest spec, page object, fixture, mock, configuration, UI markup,
and API contract. Explore live behavior only with a configured URL and approved
authentication flow. Never invent selectors, routes, endpoints, roles,
credentials, data, response shapes, or expected behavior.

### 3. Design and implement

Define the oracle before coding: expected URL, identity, state, values,
messages, method, payload, status, and response shape. Extend the closest page
object/component and register fixtures. Keep specs focused and use deterministic,
independent, parallel-safe fixtures and mocks. For integration tests, clean up
created resources in `finally`, including partially completed setup.

### 4. Verify and improve

Run the changed test first, then its spec and relevant suite. Use web-first
assertions and meaningful readiness conditions; never use arbitrary sleeps.
Repeat timing or shared-state tests when appropriate. For protected workflows,
cover documented session transitions and permission changes. After failed
mutations, inspect state before retrying and retry only when idempotency is
confirmed.

Classify failures as product, test, fixture/mock, environment, or flaky. Fix
test and fixture root causes; report product and environment blockers. Never
weaken assertions, hide failures, or use `test.fixme()` merely for a green run.

### 5. Finish

Stop live exploration recording when finished, remove only session artifacts,
inspect the final diff, and run `git diff --check` when available. Report
changed files, behavior, evidence level, commands, flakiness, limitations,
blockers, and candidate ID/status.

## Generic constraints

- Use the configured `baseURL`; never hardcode project URLs in tests.
- Do not authenticate by default. Use only the documented project flow.
- A mock proves frontend behavior, not backend, identity, database, or upstream behavior.
- Keep secrets and real personal data out of source and evidence.
- Update `TESTPLAN.md` only when coverage, test names, or verification strategy changes.

