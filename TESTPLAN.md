# Test Plan Template

> Copy this template for a project and replace every `[TBD]` or bracketed
> placeholder with evidence from the project. Do not treat an unconfigured
> template as proof that an application was tested.

## 1. Scope

- **Application / release:** [TBD]
- **Feature or change:** [TBD]
- **In scope:** [TBD]
- **Out of scope:** [TBD]
- **Environments and build:** [TBD]
- **Requirements / risks covered:** [TBD]

## 2. Test Strategy

- **Layers:** [UI / API / integration / accessibility / exploratory]
- **Approach:** [mocked, service-backed, or other]
- **Browsers and devices:** [TBD]
- **Authentication and permissions:** [TBD; document approved flows only]
- **Readiness evidence:** [source, live, mock, integration, or TBD]
- **Lifecycle gate:** New candidates are `Draft`; a reviewer moves them to
  `Ready for review` and then `Approved for implementation`. Use `Implemented`
  only after verification and `Blocked` when a dependency prevents progress.

## 3. Risks and Priorities

| ID | Risk | Impact | Likelihood | Priority | Mitigation / evidence |
|---|---|---|---|---|---|
| R-[TBD] | [TBD] | [TBD] | [TBD] | [Critical/High/Medium/Low] | [TBD] |

## 4. Negative and Boundary Tests

| ID | Category | Input or state | Expected safe outcome | Layer | Status |
|---|---|---|---|---|---|
| E-[TBD] | [validation/error/permission/timing/integration/accessibility] | [TBD] | [TBD] | [TBD] | [Draft] |

Consider invalid, missing, minimum, maximum, duplicate, unauthorized, expired,
delayed, malformed, empty, and concurrent states where they apply. Mark a
category not applicable rather than inventing a test.

## 5. Test Data and Cleanup

- **Synthetic or approved data:** [TBD]
- **Ownership and parallel-safe identifiers:** [TBD]
- **Fixtures and factories:** [TBD]
- **Created resources:** [TBD]
- **Cleanup, including partial setup failure:** [TBD]
- **Secrets and sensitive data handling:** Keep secrets outside Git and never
  record credentials or real personal data in tests or evidence.

## 6. Evidence and Observability

- **Expected oracle for each candidate:** [URL, UI state, API contract, or
  other observable result]
- **Evidence sources:** [live/source/mock/integration/TBD]
- **Artifacts:** [trace, screenshot, video, report, logs]
- **Retention and redaction:** [TBD]

## 7. Lifecycle and Traceability

| Candidate ID | Requirement / change | Priority | Layer | Lifecycle status | Evidence | Owner |
|---|---|---|---|---|---|---|
| TC-[TBD] | [TBD] | [TBD] | [TBD] | Draft | TBD | [TBD] |

Document preconditions, role or authorization context, actions, exact expected
results, data, cleanup, and parallel-safety for every candidate.

## 8. Automation Handoff

For each candidate marked `Approved for implementation`, provide:

- Test case and requirement IDs
- Preconditions, configured entry point, and authorization context
- Page-object actions and confirmed selector evidence
- API method, URL, payload, response shape, and mock requirements (if relevant)
- Verification layer and oracle
- Fixture ownership, cleanup, and parallel-safety
- Known limitations and unresolved `TBD` items

Agents must ask one focused question when an essential contract is unknown, or
record the item as `TBD` and leave the candidate unapproved. They must not
invent routes, roles, selectors, data, credentials, or expected behavior.

## 9. Execution and CI

- **Local command:** [TBD]
- **CI command and required services:** [TBD]
- **Environment variables / secret store:** [TBD]
- **Parallelism, retries, and timeouts:** [TBD]
- **Failure classification and reporting:** [TBD]
- **App-dependent suites:** Explicitly configure and run them only when the
  target application and its dependencies are available.

## 10. Exit Criteria

- [ ] In-scope requirements have traceable coverage.
- [ ] Critical and high risks have a disposition.
- [ ] Negative and boundary categories were evaluated.
- [ ] Approved automation candidates were implemented or explicitly blocked.
- [ ] Tests passed in the configured environment, or failures are classified.
- [ ] Evidence is retained and redacted appropriately.
- [ ] Known limitations and open questions are recorded.

## 11. Open Questions

1. [TBD]
2. [TBD]

