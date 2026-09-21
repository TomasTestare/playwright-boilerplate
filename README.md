# Playwright + TypeScript Starter

A reusable Playwright starter for UI, API, accessibility, and integration
testing. It contains patterns and agent guidance, but no self-running demo
application. Copy it into an existing project, configure the project contract,
and adapt the examples before enabling app-dependent tests.

## Included

- Page Object Model bases, fixtures, reusable component patterns, and logging
- Optional accessibility, CSV data, network-profile, and Xray helpers
- Generic test-plan and project-configuration templates
- Copilot instructions, test-design and Playwright implementation agents, and
  supporting skills
- Playwright projects for UI browsers and opt-in API tests

The empty example directories are scaffolding. Existing application-specific
helpers, page objects, and tests are retained as optional reference material;
they are not a generic contract.

## Copy, install, and configure

Copy the `playwright/` directory into the existing application repository. The
starter is intentionally not connected to a demo application, so installation
does not require the application to be running.

PowerShell example:

```powershell
Copy-Item -Recurse .\playwright C:\path\to\application\playwright
Set-Location C:\path\to\application\playwright

npm install
npx playwright install
Copy-Item .env.example .env
Copy-Item PROJECT-TEST-CONFIG.example.md PROJECT-TEST-CONFIG.md
```

Complete `PROJECT-TEST-CONFIG.md` before asking an agent to design tests. It is
the contract that tells the agents where the application source and API
contracts are located, how authentication works, which roles exist, how test
data is owned and cleaned up, and how the suite runs in CI.

Set local values such as `BASE_URL`, `API_URL`, and authentication settings in
`.env` or the approved secret store. Do not put credentials, tokens,
certificates, or real personal data in the project profile or Git.

The starter has no default application URL, demo credentials, or authentication.
Application-dependent tests must remain unconfigured until the target
application and its prerequisites are available.

```powershell
npm install
npx playwright install
npm run typecheck
npm test -- --list
```

Run a configured suite with the project's own URL and prerequisites:

```bash
BASE_URL=https://your-application.example npm test -- --project=chromium
```

On PowerShell:

```powershell
$env:BASE_URL = "https://your-application.example"
npm test -- --project=chromium
```

## Exact Copilot workflow

### 1. Adapt the starter to the application

Ask Copilot to inspect the application and update the starter configuration
before creating a test design:

```text
Adapt this Playwright starter to the application in this repository.

Read:
- PROJECT-TEST-CONFIG.md
- .github/copilot-instructions.md
- package.json
- the application routes, UI components, source code, and API contracts

Identify and update only the Playwright project files that need adaptation:
- playwright.config.ts
- global-setup.ts
- pageObjects/starterFixture.ts
- README.md
- relevant agent and skill instructions

Do not change application code. Do not invent routes, selectors, roles,
credentials, API response shapes, or test data. Ask one focused question when
an essential contract is missing; otherwise mark it TBD and leave dependent
tests unconfigured.
```

After this step, verify the configuration:

```powershell
npm run typecheck
npm test -- --list
```

### 2. Ask the test-design agent for a feature analysis

Use the test-design agent for a requirement, user story, defect, page, or
workflow. The agent updates `TESTPLAN.md`; it does not create Playwright tests
in this phase.

```text
Follow .github/agents/application-testdesign.agent.md.

Create a risk-based test design for:
[feature, user story, defect, or requirement]

Use the application's actual source, routes, API contracts, roles, and test
data. Cover the normal workflow and relevant validation, boundary, permission,
error, timeout, concurrency, accessibility, privacy, recovery, and cleanup
risks. Do not invent technical details. Update TESTPLAN.md with traceability,
test cases, edge cases, exploratory missions, and automation candidates.
Do not create Playwright test files yet.
```

The agent creates candidates with lifecycle statuses:

```text
Draft
Ready for review
Approved for implementation
Implemented
Blocked
```

Review the oracle, evidence, test data, cleanup, parallel-safety, and open
questions. A human reviewer must change a candidate to `Approved for
implementation`; the implementation agent must not approve candidates itself.

### 3. Ask the Playwright agent to implement an approved candidate

```text
Follow .github/agents/application-playwright.agent.md.

Implement automation candidate [CANDIDATE_ID] from TESTPLAN.md.
The candidate is Approved for implementation.

First inspect the current UI, API contract, page objects, fixtures, mocks, and
project configuration. Use the smallest suitable test layer and preserve the
candidate's oracle, evidence level, test-data ownership, cleanup, and
parallel-safety requirements. Run the focused test first, then the relevant
spec or suite. Do not weaken assertions to obtain a green result.
```

After successful verification, the agent reports the changed files, commands,
evidence level, limitations, and failures. The candidate can then be marked
`Implemented`.

### 4. Maintain the handoff

Update `TESTPLAN.md` when requirements, coverage, test names, verification
strategy, evidence, or known risks change. Keep `PROJECT-TEST-CONFIG.md`
aligned with the application and keep secrets only in `.env` or the approved
secret store.

Use `playwright-cli` for live exploration only after the target URL and approved
authentication flow are configured. Never invent session cookies or tokens.

## Commands

```text
npm test -- --reporter=line
npm run test:chromium
npm run test:api
npm run test:debug
npm run typecheck
```

App-dependent commands require the configured application and services. An API
test file is selected by the API project pattern; no API tests are enabled by
default unless such files are added. The test in `tests/examples/` is
intentionally skipped until it is adapted to the target application.

## Structure

```text
pageObjects/                 # base classes, starterFixture, components, pages
tests/                       # vanilla, edge-cases, accessibility, integration
tests/examples/              # intentionally skipped starter examples
utils/                       # reusable helpers
data/                        # synthetic, non-sensitive fixture data
.github/                     # agent instructions and skills
TESTPLAN.md                  # generic test-plan template
PROJECT-TEST-CONFIG.example.md
PROJECT-TEST-CONFIG.md       # local project contract after setup
GVR-TESTPLAN.md              # retained optional GVR reference from the source project
playwright.config.ts
global-setup.ts
.env.example
```

## Optional reference material

`GVR-TESTPLAN.md`, `POM-REFERENCE.md`, `pageObjects/pageFixture.ts`,
`pageObjects/gvrPageFixture.ts`, and the GVR-oriented utilities and selectors
are preserved from the source project for teams that need them as examples.
They are not required by the generic starter and must not be treated as the
configuration contract for another application. The generic fixture is
`pageObjects/starterFixture.ts`.
