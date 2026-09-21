---
name: edge-case-miner
description: >-
  Generate application-specific edge cases for a user flow, UI feature, or API endpoint. Covers input
  validation, boundary values, permissions, unusual user behaviour, timing, and integration
  failure scenarios. Use whenever the user wants to improve test quality quickly, asks for edge
  cases, mentions "kantfall", "edge cases", "corner cases", "konstiga värden", "gränsfall",
  "testfall saknas", or wants to go beyond happy-path testing.
  Also triggers on "what could users do wrong", "unexpected input", or "harden the tests".
---

# Edge-Case Miner - Edge and Corner Case Generator

## Purpose

Given a user flow, UI feature, or API endpoint description, produce a structured list of
edge cases and expected outcomes ready to turn into Playwright tests.

Always consider the configured session boundary, documented permission contexts,
and whether the relevant test is mock-based or integration-based.

---

## Step 1 — Receive input

The user provides one of:
- A user flow description (e.g. "user uploads an invoice PDF and submits for approval")
- A function or API endpoint specification
- An acceptance criterion or user story

If nothing is provided, ask: *"Describe the user flow or feature you want edge cases for."*

---

## Step 2 — Mine edge cases across six categories

Work through each category systematically. For each category, generate specific cases tied to
the provided input — not generic examples.

### Category A — Input validation

Think about every value a user or system can supply:
- **Empty / null / whitespace** — what happens when required fields are blank?
- **Wrong type** — string where number expected, array where scalar expected
- **Special characters** — `<script>`, SQL quotes `'`, null bytes `\0`, emoji, RTL text
- **Encoding** — UTF-8 edge cases, non-breaking spaces, zero-width characters
- **File uploads** — wrong MIME type, zero-byte file, file with correct extension but wrong content,
  extremely large file, file name with path traversal characters (`../../etc/passwd`)

### Category B — Boundary values

Apply classic boundary-value analysis:
- Exact minimum allowed value, one below minimum
- Exact maximum allowed value, one above maximum
- 0, -1, 1, `MAX_INT`, `MIN_INT` for numeric fields
- Empty collection (0 items), single item, max allowed items, max + 1
- Date fields: past dates, future dates, today, leap day (Feb 29), end of year/month,
  timezone edge cases (midnight UTC vs. local time)

### Category C — Unusual user behaviour

Think about how a real (or adversarial) user might interact:
- **Double-submit** — clicking "Submit" twice rapidly; back-button re-submit
- **Partial completion** — abandoning a multi-step flow halfway through
- **Stale page** — submitting a form after the session has expired
- **Multi-tab** — same user completing the same flow in two browser tabs simultaneously
- **Browser quirks** — refreshing mid-upload, navigating away and back
- **Paste and autocomplete** — data pasted from external sources with hidden formatting
- **Very long inputs** — names, addresses, descriptions at 10×, 100× expected length

### Category D — Concurrency and timing

Look for race conditions and timing dependencies:
- Two users performing the same action on the same shared resource simultaneously
- A record being deleted while another request is reading or updating it
- A long-running async job completing after its originating session has expired
- Webhook or callback arriving out of order (before the initiating request completes)
- Cache invalidation timing — stale cache served after an update
- Retry logic — what if the retry fires while the original request is still processing?

### Category E — Integration failures

Consider every external dependency in the flow:
- Downstream service returns 500 / 503 / timeout
- Downstream service returns a valid HTTP 200 but with malformed or empty body
- Network packet loss causing partial data delivery
- Third-party auth provider (SSO, OAuth) is temporarily unavailable
- Database connection pool exhausted
- Message queue full or consumer offline
- External API rate limit hit mid-flow

### Category F — State and environment

- **Permissions changes mid-flow** — user's role is revoked while they are in the middle of an action
- **Feature flags** — flow executed with flag ON vs. OFF; flag toggled mid-session
- **Locale and timezone** — user in UTC-12 vs UTC+14; date formatting differences; decimal separator
- **Configuration drift** — environment variable missing or set to an unexpected value
- **Already-done states** — submitting something that was already submitted, approving
  something already approved, deleting something already deleted (idempotency)

---

## Step 3 — Output format

Group cases by category. For each case, provide:

| # | Category | Case description | Expected behaviour |
|---|---|---|---|
| 1 | Input validation | User submits form with Name field empty | Validation error shown, form not submitted |
| … | | | |

After the table, add a **"Top 5 highest-risk cases"** list — the cases most likely to uncover
a real defect or cause a production incident if untested.

---

## Quality bar

A good edge-case analysis:
- Produces at least 3 cases per applicable category
- Specifies the *expected* correct behaviour — not just the input
- Highlights cases that test multiple failure modes at once (higher value)
- Does not repeat the happy path as an "edge case"

If a category genuinely does not apply (e.g. a pure read-only query has no concurrency risk),
skip it and briefly note why.
