# Project Test Configuration

Complete this contract before enabling application-dependent tests. Keep local
values in `.env` or the approved secret store; do not commit credentials,
tokens, certificates, or real personal data.

## Project

- **Application name:** `[TBD]`
- **Repository / source locations:** `[TBD]`
- **Profile owner:** `[TBD]`
- **Configuration reviewed on:** `[TBD]`

## URLs and services

- **UI base URL:** `[TBD]`
- **UI entry path:** `[TBD]`
- **API base URL:** `[TBD or not applicable]`
- **API specification / contract:** `[TBD]`
- **Required services and health checks:** `[TBD]`
- **Environment name:** `[TBD]`

The starter has no application URL by default. Set `BASE_URL` and, when
needed, `API_URL` explicitly before running app-dependent projects.

## Authentication and authorization

- **Authentication method:** `[TBD]`
- **Approved login entry point or API flow:** `[TBD]`
- **Session / storage-state policy:** `[TBD]`
- **Roles or permission contexts:** `[TBD]`
- **How access is revoked or expired in tests:** `[TBD]`
- **Required secret names and provider:** `[TBD]`

Do not invent cookies, tokens, roles, or login users. If the contract is
unknown, ask for it and leave the relevant tests unconfigured.

## Test organization

- **Test directories:** `[TBD]`
- **UI project names:** `[TBD]`
- **API project match / directory:** `[TBD]`
- **Page-object and component locations:** `[TBD]`
- **Fixture registration file:** `[TBD]`
- **Selector strategy and test ID attribute:** `[TBD]`
- **Mock helpers and route ownership:** `[TBD]`

## Data and cleanup

- **Synthetic fixture source:** `[TBD]`
- **Factory / seed command:** `[TBD]`
- **Unique identifier strategy:** `[TBD]`
- **Created-resource owner:** `[TBD]`
- **Cleanup command or API:** `[TBD]`
- **Partial-failure cleanup:** `[TBD]`
- **Parallel execution constraints:** `[TBD]`

## CI and evidence

- **Install and browser setup:** `[TBD]`
- **Focused test command:** `[TBD]`
- **Full regression command:** `[TBD]`
- **Integration prerequisites:** `[TBD]`
- **CI secret bindings:** `[TBD]`
- **Reports, traces, screenshots, and videos:** `[TBD]`
- **Retention and redaction policy:** `[TBD]`
- **Exit criteria / owner sign-off:** `[TBD]`

## Agent handoff checklist

- [ ] This document is complete enough to identify the application and target
  environment.
- [ ] Authentication and authorization behavior is confirmed.
- [ ] UI/API contracts and selector conventions are evidenced.
- [ ] Fixtures, cleanup, and CI prerequisites are documented.
- [ ] `TESTPLAN.md` candidates have explicit lifecycle statuses.
- [ ] Any unresolved item is marked `TBD` and is not silently assumed.

