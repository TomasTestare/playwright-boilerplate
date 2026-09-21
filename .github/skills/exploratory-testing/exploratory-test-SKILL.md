---
name: exploratory-testing
description: Explore a configured web application through playwright-cli to find unexpected behaviour, edge cases, and defects, with screenshots and network/console evidence.
---

## Guiding Principle

Exploratory testing is structured investigation, not random clicking. Each session has a defined **charter** — a scope and a mission — and findings are documented with evidence as they are discovered. The goal is to surface behaviour that automated regression tests might miss: edge cases, unexpected UI states, error handling, and integration failures.

---

## Step 1 — Gather the exploration brief from the user

**Do not open the browser or take any action until this step is complete.**

Ask the user for all of the following. Do not proceed to Step 2 until you have at minimum items 1, 2, and 3:

1. **What is the URL of the application to test?** Use the configured project URL.
2. **What feature or area should be explored?** — Be specific. "The checkout flow" is good. "The app" is not enough.
3. **What is the focus of this session?** — What kind of issues are we looking for? Examples:
   - Input handling and validation
   - Error states and recovery
   - Boundary conditions
   - Permissions and access control
   - Unexpected UI states or broken flows
4. **What should work correctly?** — Any known-good behaviour the agent should treat as the baseline (helps distinguish bugs from intentional behaviour).
5. **Are there any areas explicitly out of scope?** — What should the agent NOT explore in this session?

Once you have the answers, confirm the charter with the user before continuing:

```
Charter: Explore [feature/area] on [URL] to discover how the application handles [focus].
Out of scope: [anything excluded]
```

The user must confirm or correct this charter before the browser is opened.

---

## Prerequisites

`playwright-cli` must be installed and accessible:

```bash
npm install -g @playwright/cli@latest
playwright-cli --help
```

Use only the authentication flow and test identities documented in the project
configuration contract. Do not request or record credentials, tokens, or real
personal data.

---

## Step 2 — Open the application and authenticate

Start a named session so the browser state is preserved across commands:

```bash
playwright-cli -s=explore open [base-url]
playwright-cli -s=explore snapshot
```

If authentication is required, use the approved environment's documented flow.
Do not invent cookies or JWTs:

```bash
# Example: use only documented project actions and values.
playwright-cli -s=explore goto [configured-login-url]
playwright-cli -s=explore snapshot
```

Take a baseline screenshot once at the starting point:

```bash
playwright-cli -s=explore screenshot --filename=explore-baseline.png
```

---

## Step 3 — Start tracing and recording

Before exploring, start a trace and optionally a video to capture evidence automatically:

```bash
playwright-cli -s=explore tracing-start
playwright-cli -s=explore video-start explore-session.webm
```

---

## Step 4 — Execute the exploration

Work through the charter systematically. After each significant action, snapshot to understand current state and check for issues.

### Interaction loop

For each scenario or probe:

```bash
# Navigate to target area
playwright-cli -s=explore goto [url]
playwright-cli -s=explore snapshot

# Interact
playwright-cli -s=explore click [ref]          # or fill, select, check, etc.
playwright-cli -s=explore snapshot             # observe result

# Capture evidence of anything interesting
playwright-cli -s=explore screenshot --filename=finding-[description].png

# Check for errors after interactions
playwright-cli -s=explore console              # JS console errors
playwright-cli -s=explore network              # failed or unexpected network requests
```

### Probe categories to work through (use those relevant to the charter)

**Input handling**
- Empty / blank values where input is required
- Values at, below, and above stated limits (boundary values)
- Special characters: `<>'"`, SQL-like strings, long strings, unicode
- Wrong data types (letters in number fields, past dates where future is required)

**State and flow**
- Navigate directly to a URL mid-flow (bypassing earlier steps)
- Use browser back/forward during a multi-step process
- Submit a form twice in quick succession (double-submit)
- Leave a form partially filled, navigate away, return
- Open the same feature in two tabs simultaneously

**Error conditions**
- Trigger a known error state (e.g., submit with missing required fields)
- Observe error messages: are they clear, accurate, and recoverable?
- Check what happens immediately after an error — is the form state preserved?

**Permissions and access**
- Access a feature with a role that should not have permission
- Attempt actions the current user should not be able to complete
- Repeat permission checks with each documented role or permission context where relevant

---

## Step 5 — Document findings in real time

For every finding, capture it immediately with this structure:

```
### Finding [N]: [Short title]

**Severity:** Critical / High / Medium / Low / Observation
**Area:** [feature or page]
**Charter relevance:** [how this relates to the session charter]

**Steps to reproduce:**
1. [step]
2. [step]

**Observed behaviour:** [what happened]
**Expected behaviour:** [what should have happened]
**Evidence:** [screenshot filename, console output, network request]
```

Severity guide:
| Severity | Meaning |
|----------|---------|
| **Critical** | Data loss, security issue, complete feature failure |
| **High** | Core flow broken, no workaround |
| **Medium** | Unexpected behaviour with a workaround |
| **Low** | Minor UI issue, confusing message |
| **Observation** | Noteworthy but not a defect — worth discussing |

---

## Step 6 — Stop recording and collect evidence

```bash
playwright-cli -s=explore tracing-stop
playwright-cli -s=explore video-stop
playwright-cli -s=explore screenshot --filename=explore-final.png
```

---

## Step 7 — Produce the exploration report

Output a structured report:

---

### Exploratory Testing Report

**Charter:** [mission statement from Step 1]
**Area explored:** [feature/page]
**Session date:** [date]

#### Findings

[List all findings using the format from Step 5]

#### Areas explored

Brief list of flows and scenarios covered during the session.

#### Areas NOT explored (out of scope or time-boxed out)

Note anything relevant that was identified but not explored — useful for planning a follow-up session.

#### Evidence files

| File | Description |
|------|-------------|
| `explore-baseline.png` | Starting state |
| `finding-[N]-[description].png` | [what it shows] |
| `explore-session.webm` | Full session recording |

#### Summary

- **X findings** (Y critical/high, Z medium/low, W observations)
- **Coverage:** [brief statement of what was covered]
- **Recommended next steps:** [write tests for finding X, investigate finding Y further, etc.]

---

## Step 8 — Close the session

```bash
playwright-cli -s=explore close
```

---

## Output

A completed exploration report with:
- All findings documented with steps to reproduce, severity, and screenshots
- A record of what was and was not explored
- Clear recommended next steps

> Confirmed defects from this session can be handed to the `generate-tests` skill to write regression tests that prevent them recurring.
