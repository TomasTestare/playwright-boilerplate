# GVR Playwright Test Plan

## Overview

This document describes the test coverage for the GVR React application (`gvr-webb-react`). Tests are organized in layers — from mock-based UI verification to full API-driven integration tests against real backend services.

### Test-plan governance

`GVR-TESTPLAN.md` is the authoritative test-design and automation-handoff
document for this retained example.
The Administration design below follows `application-testdesign.agent.md`:
vanilla workflows, edge-case analysis, exploratory design, traceability,
deterministic data, evidence status, and automation-candidate lifecycle.
`application-playwright.agent.md` owns implementation decisions; this document does not
turn a `Draft` candidate into an implementation request.

The former `adminpage-testplan.md` remains as a historical working artifact;
the consolidated Administration section in this file is authoritative.

### Implementation Status

> **Implemented now:** The table below is the current automated suite inventory.  
> It should be read as **implemented coverage only**, not as a backlog or intent list.

| Suite | File(s) | Tests | Approach |
|---|---|---|---|
| **Vanilla (happy-path)** | `tests/vanilla/vanilla.spec.ts`, `tests/vanilla/adminpage.spec.ts` | 19 | Mocked API, UI assertions |
| **Request-driven** | `tests/vanilla/request-driven.spec.ts` | 2 | Mocked API, reference data + list pages |
| **Edge-cases** | `tests/edge-cases/*.spec.ts` (8 files) | 27 | Mocked API errors/null fields/timing + personnummer validation + admin deep-link authorization |
| **Integration (API-driven)** | `tests/integration/integration.spec.ts` | 8 | Real `gvr-services` API setup → UI verify → API cleanup |
| **Accessibility (WCAG 2.2)** | `tests/accessibility/*.spec.ts` (6 files) | 40 | axe-core + custom keyboard/focus/ARIA assertions |
| **Total** | 17 spec files | **88** | |

### Run Commands

```bash
# All tests (mock-based + integration)
npm run test:chromium

# Only mock-based tests (no backend needed)
npm run test:chromium -- tests/vanilla/ tests/edge-cases/

# Only integration tests (requires gvr-services + BFF + React running)
npm run test:integration

# Only accessibility tests
npm run test:chromium -- tests/accessibility/
```

### Project Structure
- **Page Objects**: 29 POMs in `pageObjects/` (pages + components)
- **Utilities**: `utils/gvrTestConfig.ts`, `utils/gvrServicesClient.ts`, `utils/logger.ts`
- **Mock helpers**: `tests/vanilla/mockApi.ts`, `tests/edge-cases/edge-case-mocks.ts`
- **Test Fixtures**: All registered in `pageObjects/pageFixture.ts`

---

## Vanilla Test Cases (Implemented ✅)

Happy-path cases verified with mocked API responses. All 19 tests in the vanilla happy-path specs pass.

**File:** `tests/vanilla/vanilla.spec.ts`

| # | Test name | What it covers |
|---|---|---|
| 1 | `logs in with the three supported test users and shows the signed-in user in the header` | Fake login for TEST1/TEST3/TEST4, header shows hsaId + role |
| 2 | `shows the Vårdhändelse personnummer column and opens the detail view` | Search → result with personnummer → open detail (req #11) |
| 3 | `opens a Vårdhändelse by direct ID and shows patient and event data` | Direct ID form → `/vardhandelse/{id}` → patient/event detail values |
| 4 | `allows an Utdrag user to export searched Vårdhändelse results` | Utdrag role → event search → export button → request parameters |
| 5 | `searches Översiktslogg and shows the expected audit-log row` | Valid date/HSA-ID filters → timestamp, user, and operation values |
| 6 | `shows the empty successful result state for an Översiktslogg search` | Valid search with no matches → explicit empty state |
| 7 | `clears stale patient results when a new search returns no data` | First search shows a patient result, second search with no hit clears stale data (req #12) |
| 8 | `shows the Vårdperiod result and opens the detail view` | Search → period row → open detail with linked events |
| 9 | `completes the Vårdperiod lifecycle with start and end corrections` | Admin → PUT start correction → POST end creation → PUT end correction → success messages and updated values |
| 10 | `lets an admin search the waiting list and confirm makulering` | Vantande search → makulera → confirm dialog |
| 11 | `shows the administration page and the client list filters by client ID` | Admin → wait for the Klienter list readiness state → search by ID → verify the matching row → open client detail and wait for its exact heading and form (req #9) |
| 12 | `allows an admin to edit and inactivate a client with a stoppdatum` | Admin → edit client fields → PUT and success alert → reload persistence → stoppdatum inactivation |
| 13 | `shows the service report for an admin group` | Rapport/tjanster overview with expected klient-ID and kombikod (req #10) |
| 14 | `allows keyboard navigation to search within klient search form` | Tab/Enter through klient search (accessibility) |
| 15 | `denies TEST1 (Visa user) access to administration navigation` | Permission denial for non-admin |

**Stability notes for test 6:** The test waits for the client list heading and
form before searching. The detail page uses a role-based exact heading locator
(`Klient: <id>` or `Skapa klient`) and waits for the detail form to be visible,
avoiding a timing-sensitive broad `h2` locator.

**File:** `tests/vanilla/request-driven.spec.ts`

| # | Test name | What it covers |
|---|---|---|
| 16 | `loads reference codes without breaking the UI` | Koder endpoints → vårdhändelse detail renders tabs |
| 17 | `loads list pages without stale or broken rows` | Blacklist + infotext admin pages render data |

**File:** `tests/vanilla/adminpage.spec.ts`

| # | Test name | What it covers |
|---|---|---|
| 18 | `ADM-A1: Admin navigation opens all four Administration tabs` | Admin fake login → Administration → Klienter, Tjänsterapport, Svartlista, and Banners route/headings |
| 19 | `Admin finds a client by client ID` | Admin → Klienter → client-ID filter → matching row and placement, with unrelated rows excluded |

---

## High-Priority Planned Coverage (Not Yet Automated)

> **Planned next:** The items in this section are intentionally called out as the most important remaining gaps.  
> They are **not** evidence of implemented automation yet.

### Authorization and session

- Expired session should clear protected data and redirect or show a clear auth failure.
- Deep-link access to protected admin pages is now automated via Playwright, but currently documented as expected-failure coverage because a known redirect gap remains.
- Permission loss mid-session should not leave previously loaded protected data actionable.

### Search and result boundaries

- Search-heavy pages should each cover **0 / 1 / many** result sizes explicitly.
- Boundary values should be defined for date ranges, klient IDs, patient IDs, and long kombika/service labels.
- Valid-but-nonexistent identifiers should show clear empty states without stale data.

### Recovery and duplicate-submit behavior

- Repeated submits should not produce duplicate actions or conflicting visible states.
- Failed admin mutations should leave the page in a consistent retryable state.
- Recovery after API error should be explicit: error shown, stale data cleared, controls still usable.

---

## Low-Priority Planned Catalogue (Reference Backlog)

> **Reference only:** This catalogue is a backlog/design aid for future tests.  
> It is more detailed than the high-priority list below, but it should **not** be read as current automated coverage.

### Core shared components

- **SharedHeaderComponent**
  - User info displays correctly after login
  - Logged in user is shown in the top-right corner
  - Logout button navigates to login page
  - Environment banner shows correct environment
  - Header persists across page navigation
- **SharedNavComponent**
  - All navigation links are accessible
  - Active link is highlighted correctly
  - Mobile nav opens/closes
  - Navigation to module pages works
  - Nav persists after page load
- **SharedTableComponent**
  - Correct number of rows display
  - Column sorting works (ascending/descending)
  - Pagination navigation works
  - Empty state message displays
  - Loading spinner shows during data fetch
  - Cell values display correctly
- **SharedFormComponent**
  - Inputs accept and display values
  - Validation errors display correctly
  - Submit button is disabled when form invalid
  - Clear button resets all fields
  - Error styling is visible
- **SharedModalComponent**
  - Modal displays with correct title and content
  - Confirm button triggers expected action
  - Cancel button closes modal
  - Close button closes modal
  - Modal overlay prevents interaction with page
  - Modal types (error/warning/info) display correct styling

### Login

- **LoginPage**
  - Login page loads correctly
  - Fake login dropdown works in local mode
  - Login works for TEST1 (Visa), TEST3 (Admin), and TEST4 (Utdrag)
  - Correct user is shown in the top-right corner after login (verify exact HSA ID matches)
  - Valid login redirects to dashboard
  - Invalid login shows error message
  - SAML message displays in production mode
  - Test user selection works
  - Session is established after login
  - **Permission denial**: TEST1 (Visa) user cannot access admin pages; 403 or redirect shown
  - **Keyboard-only**: Tab/Enter through login form and submit without mouse
- **FakeLoginComponent**
  - All test users are available in dropdown
  - TEST1, TEST3, and TEST4 can be selected
  - User selection updates selected value
  - Submit button works after selection
  - Login creates session with selected user
  - Component only visible in local mode

### Vårdhändelse

- **VardhandelsePage**
  - Page loads and displays search form
  - Search executes and returns results
  - Results display in table with personnummer in first column
  - Personnummer value is correctly visible (not null or corrupted)
  - Table columns are correct
  - Pagination works
- **VardhandelseDetailPage**
  - Detail page loads with event data
  - Personnummer field displays correctly and matches search result value
  - All event fields display correctly (not null values)
  - Related events section shows
  - Back button navigates to list
  - Read-only - no edit button
- **VardhandelseSearchComponent**
  - Patient ID input works
  - Date pickers work correctly
  - Status filter options available
  - Event type filter works
  - Search executes with all criteria
  - Clear button resets all fields
  - Search with invalid/special characters treated as plain text (no XSS)
- **VardhandelseTableComponent**
  - Correct number of events display
  - Event data displays correctly (no null values render as "null")
  - **Personnummer visible**: Search results show patient number in the first column (requirement #11)
  - Personnummer format preserved (handles expected lengths and formats)
  - Row click navigates to detail
  - Pagination works
  - Sorting works on columns
  - Empty results message displays
  - **Stale result handling**: Personnummer disappears if search returns no results on retry

### Vårdperiod

- **VardperiodPage**
  - Page loads and displays search
  - Search returns results
  - Results table shows data with personnummer visible (requirement #11)
  - Personnummer value is correctly displayed (not null)
  - Navigation works
- **VardperiodDetailPage**
  - Detail page loads with period data
  - Personnummer matches search result value (data consistency check)
  - All fields display correctly (no null/undefined rendering)
  - Related events show
  - Back button works
  - Read-only - no edit
- **VardperiodSearchComponent**
  - Inputs work correctly
  - Date pickers functional
  - Search executes
  - Clear resets form
  - Search with whitespace-only input rejected or trimmed
- **VardperiodTableComponent**
  - Rows display correctly
  - Personnummer rendered as expected format (handles null fields)
  - Pagination works
  - Row click navigates
  - Data displays accurately
  - **Stale result handling**: Old results cleared when new search returns no data

### Vantande

- **VantandePage**
  - Page loads with search form
  - Search returns results
  - Admin can open void dialog
  - Void operation confirms
  - Void operation cancels
  - Table updates after void
- **VantandeTableComponent**
  - Entries display correctly
  - Row data is accurate
  - Pagination works
  - Action buttons visible to admin
  - Row expansion works

### Administration

- **AdministrationPage**
  - Dashboard loads
  - All menu links visible
  - Navigation to each sub-page works
  - Admin user (TEST3) can access
  - **Permission denial**: TEST1 (Visa user) cannot access admin pages
- **KlientPage**
  - Page loads with search (requirement #9: search by klient-ID)
  - Search returns clients matching ID
  - **Search filters by client ID**: Entering "K001" returns only K001 entries
  - Search with spaces-only or special chars (`<script>`) handled safely
  - Add client button accessible
  - Client rows clickable
  - NO delete button present (requirement #6: no delete, only inactivation)
  - Client table displays correctly
  - **Klient-ID values verified**: Row contains exact expected ID (data accuracy)
- **KlientDetailPage**
  - Client data displays correctly with no null values
  - Client ID matches search result value (data consistency)
  - Stoppdatum can be set (inactivation via stop date, requirement #6)
  - Changes can be saved
  - Back button returns to list
  - NO delete button visible (requirement #6)
  - Inactivation via stoppdatum works
- **InfotextPage**
  - Infotext list displays
  - Edit button opens editor
  - Content can be updated
  - Changes save correctly
  - List updates after save
- **BlacklistPage**
  - Blacklist displays entries
  - Entry can be added
  - Entry can be deleted
  - Delete requires confirmation
  - Entries display correctly
- **RetfilPage**
  - Retfil list displays
  - Entries display correctly
  - Read-only - no edit buttons
  - Filtering works if applicable
- **AdminOverviewPage** (Requirement #10)
  - Administration overview opens from the admin tab
  - **Service search returns matching client IDs**: Search returns specific klient IDs
  - **Service search returns matching kombikas**: Results include expected kombika values
  - Result list is visible after search
  - Duplicate client IDs handled (visible, not skipped)
  - Empty state clear when no results

---

## Edge Case Tests (Implemented ✅)

27 edge-case tests across 8 spec files. All use mocked API responses to verify resilience, state handling, input validation, and route-level authorization behavior.

**Files:**
- `tests/edge-cases/klient-search.spec.ts` — 3 tests (500 error, null ID, XSS)
- `tests/edge-cases/service-overview.spec.ts` — 3 tests (empty results, 500 error, back/forward)
- `tests/edge-cases/vardhandelse-personnummer.spec.ts` — 4 tests (null field, 500 error, long value, mobile)
- `tests/edge-cases/patientoversikt-stale-results.spec.ts` — 4 tests (success, empty data, 500 error, back/forward)
- `tests/edge-cases/admin-deep-link-authorization.spec.ts` — 4 tests (Visa deep-link denial for klienter, blacklist, texter, rapport; currently tagged as expected failures)
- `tests/edge-cases/vardhandelse-personnummer-validation.spec.ts` — 3 tests (valid personnummer accepted, hyphen rejected, invalid Luhn tagged as expected failure)
- `tests/edge-cases/vardperiod-personnummer-validation.spec.ts` — 3 tests (valid personnummer accepted, hyphen rejected, invalid Luhn tagged as expected failure)
- `tests/edge-cases/vantande-personnummer-validation.spec.ts` — 3 tests (valid personnummer accepted, hyphen rejected, invalid Luhn tagged as expected failure)

**Known status note:** The three invalid-Luhn tests and the four admin deep-link authorization tests are implemented and intentionally marked with `test.fail(...)`. They document known gaps and remain expected failures until the application validates personnummer according to Luhn and consistently redirects non-admin users away from admin deep-links.

### Edge Case Design Reference

### 1. Administration - Klient search

| Edge case | Why it is a risk | Expected behavior | Failing example | Potential user impact |
|---|---|---|---|---|
| Search with only spaces in Klient-ID | Blank input can look like a valid search and may keep old results visible. | Trim the input and require a real value before searching. | Previous search results still visible after entering "   " and submitting. | Administrators may trust stale or irrelevant client data. |
| Search with unsupported characters like `<script>` or quotes | Can expose input sanitization gaps or broken filtering. | Treat the value as plain text and return either matched results or empty state. | HTML/JS rendered in page instead of treated as plain text; page breaks. | Confusing results or security concerns if unsafe text is echoed back. |
| Search API returns 500 error | Search pages are often used under load and should fail clearly. | Show an error message and keep the page usable. | No error message; spinner spins forever or blank results appear. | Administrators may assume there are no clients or that the app is broken. |
| Search API returns 403 (permission denied) | Role-based access can fail silently. | Show clear error: "You don't have permission to search clients." | User sees generic "error" with no actionable info; may retry indefinitely. | Confusion about whether the user has access or if the service is broken. |
| Null or zero-value klient-ID in response | Data quality issue: missing mandatory field. | Render as empty string or N/A, not crash or skip the row. | Row disappears or page errors; count doesn't match visible rows. | Administrators miss a valid client due to rendering failure. |
| Keyboard-only search and result selection | The admin search is a core workflow and must be accessible without a mouse. | Search and row selection should work with keyboard focus and Enter/Tab. | Tab stops don't reach search button; Enter doesn't trigger search; row selection requires mouse. | Users relying on keyboard navigation may be blocked from the workflow. |

### 2. Administration - Service/kombika overview

| Edge case | Why it is a risk | Expected behavior | Failing example | Potential user impact |
|---|---|---|---|---|
| Search for a service with no matching kombikas | Empty result handling must be clear for admin diagnosis work. | Show a clear empty state, not a stale previous list. | Old service results still visible; user cannot tell if search ran. | Users may think the wrong service was searched or that the data is outdated. |
| API returns 500 error on service lookup | Error recovery should be obvious. | Show error message; page remains usable for retry. | Blank page or spinner never stops; no error visible. | Admins may restart browser thinking the app crashed. |
| Service lookup returns duplicate client IDs | Duplicate rows can hide data quality issues or make the list hard to use. | Render duplicates consistently and visibly, without breaking the page. | Duplicates cause page to glitch; row count mismatch or corruption. | Admins may miss which client/kombika combination is relevant. |
| Submit the same search twice quickly (rapid double-click) | Double-submit can trigger duplicate requests or inconsistent lists. | Either ignore the second submit or render one stable result set. | Both requests complete; page shows conflicting data or outdated result. | Duplicate work and confusion about which list is current. |
| Browser back/forward after searching | The page should not restore a stale search that no longer matches the visible controls. | Restore the search state only if it is consistent with the page. | Back button shows old search results but search controls show different service. | Users may act on an outdated overview. |

### 3. Vårdhändelse - Personnummer in search result

| Edge case | Why it is a risk | Expected behavior | Failing example | Potential user impact |
|---|---|---|---|---|
| Search result missing personnummer from the API | The change depends on a field that may be absent in some records. | Show a clear fallback or empty value rather than breaking the row. | Row disappears or page errors; count doesn't match visible rows. | Support staff lose the diagnostic value of the result list. |
| Personnummer field is null or empty string | Common data quality issue in healthcare systems. | Display as empty cell or "–", keep row readable and sortable. | Null shows as "null" string; column alignment breaks. | Search results become confusing; users may think data is corrupted. |
| Personnummer has unexpected format or length | Formatting changes can break display or sorting. | Render the value as received and keep the row readable. | Very long personnummer breaks column width; text overflows. | Search results may become harder to use during troubleshooting. |
| Large result set on a narrow viewport | Extra visible text can wrap badly or hide other important columns. | Keep the table readable and scrollable on smaller screens. | Personnummer column hidden on mobile; vital diagnostic info lost. | Mobile or smaller-screen users may struggle to scan the list. |
| Search API returns 500 or times out after a valid query | A failed refresh should not look like an empty patient list. | Show an error message and avoid presenting stale data as current. | Old results still visible with no error indicator. | Users may misdiagnose the patient or assume no event exists. |

**Automated coverage:** `tests/edge-cases/vardhandelse-personnummer.spec.ts` verifies
the complete 200-to-500 lifecycle. It waits for the actual search responses,
confirms the successful result row and patient identity card, then confirms the
500 error, removal of result rows, and removal of the previous patient identity
card. The test also covers null personnummer rendering, long personnummer layout,
and mobile navigation.

### 4. Patientöversikt - clearing stale results

| Edge case | Why it is a risk | Expected behavior | Failing example | Potential user impact |
|---|---|---|---|---|
| New search returns no data after a previous hit | This is the core bug fix area; stale data is easy to misread. | Clear the old patient result and show only the no-result message. | Old patient data still visible; no-result message appears below it. | Very high risk of confusion and wrong patient handling. |
| New search fails after a previous hit | Errors can leave the old result visible unless the state is reset. | Clear the old result and show the error state for the new search. | Old patient info still visible; error message appears but doesn't replace it. | Users may continue working on the wrong patient. |
| Rapidly switching between two patient searches (timing race) | Slower response can overwrite newer result due to timing. | Last submitted search should win; stale responses must not replace newer UI state. | Search A completes slow; search B completes fast; UI shows result A, not B. | Dangerous mix-up between patients in a high-impact clinical workflow. |
| API returns 401 (session timeout) after previous success | Session loss should not leave old patient data visible. | Clear result and show login redirect or clear session error. | Old patient data remains visible; no indication user must log in again. | Users may continue working on stale patient data after auth failure. |
| Search is repeated from another tab or after browser back | Browser state can preserve stale data across navigation. | The displayed result should always match the latest successful search. | Back button shows old patient result; search controls show different patient. | Users may think the page still reflects the current query when it does not. |

---

## Exploratory Test Design (Reference — Not Automated)

> **Note:** This section documents exploratory test charters and missions for manual or future automated testing. No Playwright spec files implement these directly — they informed the design of the edge-case tests above.

Risk-based exploratory plan for the recent UI changes. Findings should be tagged as **Critical**, **High**, **Medium**, or **Low**.

### Test Objectives

- Verify that the four changed flows are easy to understand and use.
- Find stale-data, timing, accessibility, and API-failure issues that happy-path tests may miss.
- Confirm that results remain trustworthy when the user repeats searches or changes context quickly.
- Capture observations that can be turned into stable Playwright regression tests.

### Scope

**In scope**
- Administration search by klient-ID
- Administration overview by service / kombika
- Vårdhändelse search result presentation with personnummer
- Patientöversikt clearing stale results on new search
- Keyboard navigation, loading, empty states, and error states around those flows

**Out of scope**
- Unrelated feature areas outside the four recent changes
- Deep backend validation beyond what is visible in the UI
- Security testing beyond obvious UI misuse patterns

### Assumptions

- Test users with the right roles are available.
- The environment has representative data for clients, services, patients, and events.
- Search APIs can return success, empty, and error states during testing.
- The UI should show the most recent successful search state, not stale prior data.

### Risks

| Risk | Priority | Why it matters |
|---|---|---|
| Stale patient data remains visible after a new search | Critical | Can lead to confusion or wrong-patient work. |
| Search results fail to show personnummer | High | Reduces the main troubleshooting benefit of the change. |
| Admin search returns misleading empty or stale results | High | Admins may act on incorrect client information. |
| Slow or failed APIs leave the page looking valid | High | Users may trust a broken result set. |
| Keyboard-only users cannot complete the workflow | Medium | Blocks users relying on accessibility support. |
| Long or unusual values break layout or readability | Medium | Makes the UI harder to use under real conditions. |

### Test Charters

#### Charter 1: Administration klient search

| Field | Content |
|---|---|
| Goal | Validate that admins can find clients by klient-ID quickly and understand the result list. |
| Areas to explore | Search input, reset behavior, row selection, empty state, error state, keyboard navigation. |
| Examples of test ideas | Search with partial ID, repeat the search after clearing, select a row, tab through controls, trigger an API error. |
| Expected observations | Matching clients are shown clearly, old results do not linger, and the page remains usable after no-result or error states. |

#### Charter 2: Administration service/kombika overview

| Field | Content |
|---|---|
| Goal | Check that the admin overview produces a trustworthy service-based list of client IDs and kombikas. |
| Areas to explore | Service selector/search, list content, duplicate handling, navigation history, empty state, screen size changes. |
| Examples of test ideas | Search a known service, repeat the same search, change browser width, use back/forward, inspect row readability. |
| Expected observations | The list reflects the selected service, is readable, and does not keep stale rows when the search changes. |

#### Charter 3: Vårdhändelse personnummer presentation

| Field | Content |
|---|---|
| Goal | Ensure search results expose personnummer in a way that supports troubleshooting. |
| Areas to explore | Result table columns, long values, missing values, row expansion, visual clarity, loading and error states. |
| Examples of test ideas | Search a known event, verify the personnummer column, inspect behavior when data is incomplete, resize the viewport. |
| Expected observations | Personnummer is visible in the result list and remains readable without breaking the layout. |

#### Charter 4: Patientöversikt stale-result reset

| Field | Content |
|---|---|
| Goal | Confirm the page always reflects the latest patient search and clears older patient data. |
| Areas to explore | New search flow, empty result handling, error handling, browser back/forward, rapid repeated searches, multi-tab behavior. |
| Examples of test ideas | Search patient A, then search patient B, then search a non-existing patient, trigger a failed request, switch tabs quickly. |
| Expected observations | Previous patient results disappear when a new search runs, and the visible state always matches the newest search outcome. |

### Test Scenarios

| Scenario | Focus | Expected outcome |
|---|---|---|
| Admin searches for a known klient-ID | Core usability | Matching client rows appear and can be opened. |
| Admin searches for a service with known kombikas | Data interpretation | The overview lists the expected client IDs and kombikas. |
| User reviews a Vårdhändelse result row | Diagnostic clarity | Personnummer is visible without obscuring other important columns. |
| User performs a second Patientöversikt search with no hit | Stale-data prevention | The previous patient result is removed and only the no-result state remains. |

### Exploratory Missions

| Mission | Priority | What to look for |
|---|---|---|
| Mission A: Find admin search confusion points | High | Misleading empty states, stale filters, unclear row selection. |
| Mission B: Stress the service overview | High | Duplicate rows, broken labels, inconsistent history behavior. |
| Mission C: Verify patient identifiers remain visible | High | Missing personnummer, wrapping issues, readability problems. |
| Mission D: Prove stale patient data cannot persist | Critical | Timing issues, back-navigation issues, and state reset failures. |

### Negative Test Scenarios

**API Failure Injection**
- Search API returns 500 (internal server error) → Page shows error, not stale results
- Search API returns 403 (forbidden/permission denied) → Clear error message: "You don't have permission"
- Search API returns 401 (session timeout) → Redirect to login or clear session state
- Search API timeout (>30s) → Show loading state, allow cancel, not infinite spinner

**Data Quality Issues**
- Blank or whitespace-only search terms → Rejected or trimmed; old results cleared
- API returns null or missing mandatory field (personnummer, klient-ID) → Render as empty/N/A, not crash
- API returns zero-value IDs or empty strings → Display safely without breaking row or count
- Very long values (personnummer 50+ chars) → Wrap or truncate safely; not overflow layout

**Timing & State Issues**
- Repeated submit clicks on the same search form → Ignore second submit or debounce (no duplicate requests)
- Search A submitted, then search B submitted quickly → Result B wins; result A does not overwrite B
- Search after navigating back to the page → Result reflects current page state, not browser history
- New search with no results after previous hit → Old results cleared completely; empty state shows only

**Keyboard & Accessibility**
- Keyboard-only navigation through search and results → Tab/Enter sufficient; no mouse required
- Reach all controls via Tab without getting stuck → Focus trap test
- Search form clear button accessible via keyboard → No keyboard-only dead ends

### Accessibility Checks

- All search fields have clear labels.
- Search and reset controls are reachable by keyboard.
- Result rows are reachable and understandable without hover-only cues.
- Empty and error messages are announced visually and are not ambiguous.
- Focus order remains logical after search and after clearing results.

### Suggested Automation Candidates

- Admin klient-ID happy-path search.
- Admin service/kombika happy-path search.
- Vårdhändelse result row shows personnummer.
- Patientöversikt clears the previous result on a new search.
- One keyboard-navigation smoke test for the main search controls.

### Test Data Requirements

**For happy-path vanilla tests**:
- At least one known klient-ID with multiple matching rows (for search verification)
- At least one service with predictable kombika/client mappings
- At least one Vårdhändelse with a visible personnummer in the result list
- Two distinct patients for the stale-result reset flow (test A, then test B)
- One non-existing value for empty-state coverage

**For failure injection tests**:
- Mock API endpoint that can return 500, 403, 401, timeout
- Test data with null personnummer (missing field in record)
- Test data with zero-value klient-ID or empty string
- Test data with very long personnummer (50+ chars) to test wrapping
- Whitespace-only search input to test trimming logic

**For accessibility & keyboard tests**:
- All search controls must be reachable via Tab
- Focus indicators must be clearly visible (WCAG 2.1 Level AA)
- Enter key must trigger search (no mouse-only patterns)
- Result rows must be navigable and expandable via keyboard

### Exit Criteria

- Each charter has been explored enough to produce at least one actionable observation or confirm expected behavior.
- Critical and high-risk findings are documented with clear reproduction steps.
- The happy-path and exploratory notes are sufficient to create Playwright regression tests in the next step.

---

## gvr-services Request-to-Test Matrix (Implemented ✅)

The requests in `http-client/gvr-services-1-9-2.http` are used as **setup/fixture calls only** when the UI needs realistic backend state. Playwright assertions stay on the BFF/UI surface.

**Mock-based coverage** (in `tests/vanilla/`): Maps API calls to mocked tests that verify UI rendering.
**Integration coverage** (in `tests/integration/`): Uses real API calls for setup/cleanup.

| Call | Exact Playwright test name | Setup / assertion / cleanup |
|---|---|---|
| `GET /api/webb/fake/options`, `POST /api/webb/fake/login?hsaId=...`, `GET /api/webb/me` | `logs in with the three supported test users and shows the signed-in user in the header` | **Setup:** choose TEST1, TEST3, or TEST4 through fake login. **Assertion:** verify the header shows the correct HSA ID and role. **Cleanup:** end the browser context or log out before the next case. |
| `GET /api/webb/klient?kombika=ALLA`, `GET /api/webb/klient/{id}` | `shows the administration page and the client list filters by client ID` | **Setup:** seed the admin list with known client data. **Assertion:** filter by klient-ID and verify the expected row, then open it. **Cleanup:** clear search state or start a fresh context. |
| `GET /api/webb/rapport/tjanster?gruppId=...` | `shows the service report for an admin group` | **Setup:** seed a known service/group result set. **Assertion:** verify expected client IDs and kombikas render in the overview. **Cleanup:** none beyond a new context; read-only flow. |
| `GET /api/webb/koder/akut` | `loads reference codes without breaking the UI` | **Setup:** seed the code list response. **Assertion:** confirm the code-driven UI renders normally. **Cleanup:** none; read-only flow. |
| `POST /vardhandelse/inskrivning`, `POST /vardperioder`, `GET /vardperioder/{id}`, `GET /vardhandelse?id={id}` | `shows the Vårdperiod result and opens the detail view` | **Setup:** create a period and linked inskrivning records. **Assertion:** verify the Vårdperiod row appears and the detail view shows the linked event identifiers. **Cleanup:** delete seeded period data if the environment persists state. |
| `POST /vardhandelse/besok`, `GET /vardhandelse?patientId=...&start=...`, `GET /vardhandelse?id=...&extra=true` | `shows the Vårdhändelse personnummer column and opens the detail view` | **Setup:** create a visit for a known patient. **Assertion:** verify personnummer is shown in the result row and matches the detail view. **Cleanup:** remove seeded event data if needed. |
| `POST /vardhandelse/utskrivning` | `creates a discharge (utskrivning) and verifies the closed admission in the UI` | **Setup:** admit a patient, then post a discharge on the same event time. **Assertion:** the admission event carries the discharge code/date and shows as a single closed-admission row. **Cleanup:** delete the admission and period. |
| `POST /vardhandelse/flytt`, `GET /vardhandelse/flytt`, `DELETE /vardhandelse/flytt` | `creates a flytt (transfer) via REST, verifies it, and removes it` | **Setup:** admit a patient, then transfer the admission to a target enhet. **Assertion:** `GET /vardhandelse/flytt` confirms source/target/times; the base admission stays visible in the Vårdhändelse search. **Cleanup:** delete the flytt, admission, and period. |
| `GET /vardperioder?start=...`, `DELETE /vardperioder/{id}` | `clears stale patient results on a second search` | **Setup:** seed a patient result, then prepare a second search with no hit. **Assertion:** verify the second search clears the previous result and shows only the empty state. **Cleanup:** delete seeded period rows. |
| `GET /api/webb/blacklist`, `GET /api/webb/infotext` | `loads list pages without stale or broken rows` | **Setup:** seed empty or known list data. **Assertion:** verify list pages stay usable for empty, error, and populated states. **Cleanup:** none beyond browser context reset. |

### Notes

- Backend-only maintenance calls from `gvr-services` remain setup helpers, not direct Playwright assertions.
- UI tests should still prefer the BFF `/api/webb/**` endpoints for visible behaviour checks.
- Use `gvr-services` only when the UI needs realistic patient, event, or reference-data state that the BFF does not create by itself.

---

## API-driven Integration Tests (Real Backend)

These tests call `gvr-services` to create/delete real data, then verify it in the UI.
No mocks — requires all services running locally.

**File:** `tests/integration/integration.spec.ts`

**Run command:** `npm run test:integration`

### Prerequisites
- `gvr-services` running at `GVR_SERVICES_URL` (default: `http://localhost:9080/gvr-services/rest`)
- `gvr-webb-bff` running at port 8081 (serves the React app and `/api/webb/**`)
- `gvr-webb-react` served by the BFF at `BASE_URL` (default: `http://localhost:8081`)
- Spring profile `local` (fake login enabled)

### Configuration (`data/test-data.json`)

The active GVR environment is selected with `GVR_TEST_ENV` (defaults to `dev`).
Use `GVR_TEST_DATA_FILE` to load an environment-specific file outside the
repository, for example when AT values must not be committed.

| Variable | Default | Description |
|---|---|---|
| `GVR_TEST_ENV` | `dev` | Profile key in the test data file |
| `GVR_TEST_DATA_FILE` | `data/test-data.json` | Optional path to an external test data file |
| `GVR_AUTH_CERT` | `data/test-auth-cert.pem` | Optional certificate value; keep secrets outside Git |

### Test Cases

| # | Test name | API Setup | Verification | API Cleanup |
|---|---|---|---|---|
| 1 | `creates vårdperiod with inskrivning and verifies in UI search` | `POST /vardperiod` + `POST /vardhandelse/inskrivning` | API: `GET /vardhandelse` returns the linked event; `GET /vardhandelse?id=` resolves it | `DELETE /vardhandelse/inskrivning` + `DELETE /vardperiod` |
| 2 | `creates besök and verifies personnummer in vårdhändelse search` | `POST /vardperiod` + `POST /vardhandelse/besok` | UI: Vårdhändelse search returns the row and retains the patient ID | `DELETE /vardperiod` |
| 3 | `creates a besök via REST, verifies it in the UI, and deletes it via REST` | `POST /vardperiod` + `POST /vardhandelse/besok` | UI: search shows the visit row (date/time), then shows empty state after `DELETE /vardhandelse/besok` | `DELETE /vardhandelse/besok` + `DELETE /vardperiod` |
| 4 | `creates a period with events via REST and verifies cleanup in both UIs` | Legacy `POST /vardperiod` + inskrivning + besök | UI: Vårdperiod shows the period row and Vårdhändelse shows 2 rows; both views show empty state after deletion | `DELETE besök` + `DELETE inskrivning` + `DELETE /vardperiod` |
| 5 | `creates full patient timeline and verifies coherence in UI` | `POST /vardperiod` + inskrivning + besök + utskrivning | UI: Vårdhändelse search shows the timeline rows (≥2) for the patient | `DELETE /vardperiod` |
| 6 | `clears stale patient results after data is deleted` | `POST /vardperiod` + besök, then delete mid-test | UI: second search after deletion clears the previous results | Already cleaned mid-test |
| 7 | `creates a discharge (utskrivning) and verifies the closed admission in the UI` | `POST /vardperiod` + inskrivning + `POST /vardhandelse/utskrivning` (same event time) | API: the admission event carries `utskrKod`/`utskrDatum`. UI: Vårdhändelse search shows the single closed-admission row | `DELETE /vardhandelse/inskrivning` + `DELETE /vardperiod` |
| 8 | `creates a flytt (transfer) via REST, verifies it, and removes it` | `POST /vardperiod` + inskrivning; then `POST /vardhandelse/flytt` to a target enhet | UI: base admission is visible in Vårdhändelse search. API: `GET /vardhandelse/flytt` confirms source/target/times, and returns empty after `DELETE /vardhandelse/flytt` | `DELETE /vardhandelse/flytt` + `DELETE /vardhandelse/inskrivning` + `DELETE /vardperiod` |

> **Note:** Flytt is not rendered in the React UI, so test 8 verifies the transfer through `GET /vardhandelse/flytt` while anchoring the base admission in the Vårdhändelse search. Utskrivning is merged onto the existing admission event, so test 7 asserts the discharge fields on that single row rather than a separate row.

---

## Accessibility Tests — WCAG 2.2 Level AA (Implemented ✅)

Target: **WCAG 2.2 Level AA** conformance across all 12 routable pages.

**Tool:** `@axe-core/playwright` (installed) + custom Playwright assertions for criteria axe cannot detect.

**Run command:** `npm run test:chromium -- tests/accessibility/`

**Full details:** See `ACCESSIBILITY-TESTPLAN.md` for per-criterion breakdown and identified code gaps.

### Test Files

| Spec file | Tests | What it covers |
|---|---|---|
| `axe-scan.spec.ts` | 12 | Automated axe-core scan on every page (contrast, labels, ARIA, headings) |
| `keyboard-navigation.spec.ts` | 8 | Tab through forms, Enter/Space on rows, Escape closes dialogs, no traps |
| `focus-management.spec.ts` | 6 | Visible focus ring, modal focus on open/close, focus not obscured by header |
| `aria-states.spec.ts` | 6 | `aria-expanded` on table rows, `role="alert"` on errors, dialog ARIA |
| `color-contrast.spec.ts` | 4 | Error uses text indicator (not color alone), banner contrast, disabled state |
| `responsive-reflow.spec.ts` | 4 | 320px reflow, 200% zoom, table scroll on narrow viewport, mobile nav |
| **Total** | **40** | |

### Implemented Tests (✅ all 40 tests created)

**`tests/accessibility/axe-scan.spec.ts`** — 12 tests:
1. `LoginPage has no critical violations`
2. `SokVardhandelse has no critical violations`
3. `PatientOversikt has no critical violations`
4. `Oversiktslogg has no violations`
5. `SokVardperiod has no critical violations`
6. `PeriodOversikt has no critical violations`
7. `SokVantande has no critical violations`
8. `KlientOversikt has no critical violations`
9. `KlientDetalj has no critical violations`
10. `TjansteRapport has no critical violations`
11. `Blacklist has no critical violations`
12. `EditeraTexter has no violations`

**`tests/accessibility/keyboard-navigation.spec.ts`** — 8 tests:
1. `Tab through login form and submit without mouse`
2. `Tab through vårdhändelse search form and results`
3. `Tab through vårdperiod search and results`
4. `Tab through admin klient search`
5. `Enter or Space triggers table row expand`
6. `Escape closes ConfirmDialog and returns focus`
7. `Tab does not get trapped in modal dialog`
8. `SubNav tabs navigable with keyboard`

**`tests/accessibility/focus-management.spec.ts`** — 6 tests:
1. `all interactive elements have visible focus indicator`
2. `ConfirmDialog moves focus to dialog on open`
3. `ConfirmDialog returns focus to trigger on close`
4. `focus not obscured by sticky header after scroll`
5. `error summary moves focus to first error field`
6. `loading state does not steal focus from user input`

**`tests/accessibility/aria-states.spec.ts`** — 6 tests:
1. `expandable table rows have aria-expanded attribute`
2. `ErrorMessage uses role=alert and is announced`
3. `LoadingSpinner uses role=status with aria-label`
4. `ConfirmDialog has role=dialog with aria-modal and aria-labelledby`
5. `empty table state announced to screen readers`
6. `SubNav tabs have proper ARIA semantics`

**`tests/accessibility/color-contrast.spec.ts`** — 4 tests:
1. `error messages use text indicator, not color alone`
2. `form required fields have text indicator, not just color`
3. `environment banner text meets contrast requirements`
4. `disabled buttons are distinguishable from enabled`

**`tests/accessibility/responsive-reflow.spec.ts`** — 4 tests:
1. `content reflows at 320px viewport without horizontal scroll`
2. `content usable at 200% text zoom`
3. `data tables remain scrollable on narrow viewport`
4. `mobile nav functions correctly at 375px`

### Pages Scanned (axe-core)

| Route | Component | Key patterns |
|---|---|---|
| `/login` | LoginPage | Form, select, button, error alert |
| `/vardhandelse/sok` | SokVardhandelse | Search form, data table, expandable rows |
| `/vardhandelse/:id` | PatientOversikt | Read-only detail, panels, delete dialog |
| `/vardhandelse/oversiktslogg` | Oversiktslogg | Search form, data table |
| `/vardperiod/sok` | SokVardperiod | Search form, data table |
| `/vardperiod/:id` | PeriodOversikt | Detail view |
| `/vantande/sok` | SokVantande | Search form, expandable table, confirm dialog |
| `/administration/klienter` | KlientOversikt | Search form, data table |
| `/administration/klienter/:id` | KlientDetalj | Multi-field form, validation, permissions |
| `/administration/rapport` | TjansteRapport | Select, data table |
| `/administration/blacklist` | Blacklist | Form, data table, confirm dialog |
| `/administration/texter` | EditeraTexter | Card list, rich text editor |

### Key WCAG 2.2 Criteria Tested

| Criterion | Level | Test type | What we verify |
|---|---|---|---|
| 1.3.1 Info and Relationships | A | axe + custom | Table structure, form labels, heading hierarchy |
| 1.4.3 Contrast (Minimum) | AA | axe | Text on RS Blå backgrounds meets 4.5:1 |
| 1.4.10 Reflow | AA | custom | No horizontal scroll at 320px |
| 1.4.11 Non-text Contrast | AA | custom | Form borders + focus rings ≥ 3:1 |
| 2.1.1 Keyboard | A | custom | All interactive elements operable via keyboard |
| 2.1.2 No Keyboard Trap | A | custom | Tab can escape every component |
| 2.4.3 Focus Order | A | custom | Logical Tab sequence through forms |
| 2.4.7 Focus Visible | AA | custom | Visible focus indicator on all interactive elements |
| 2.4.11 Focus Not Obscured | AA | custom | Focused element not hidden by sticky header |
| 2.5.8 Target Size (Minimum) | AA | custom | Click targets ≥ 24×24px |
| 3.3.1 Error Identification | A | custom | Errors name the field and appear adjacent |
| 3.3.8 Accessible Authentication | AA | custom | Login doesn't require cognitive function test |
| 4.1.2 Name, Role, Value | A | axe | ARIA roles valid on IDS Web Components |
| 4.1.3 Status Messages | AA | custom | `role="alert"` / `role="status"` for dynamic content |

### Known Gaps (from code review)

| Issue | Criterion | Severity | Component |
|---|---|---|---|
| DataTable rows: no `onKeyDown`, no `tabIndex` | 2.1.1 Keyboard | High | `DataTable.tsx` |
| DataTable expandable rows: no `aria-expanded` | 4.1.2 Name, Role, Value | High | `DataTable.tsx` |
| ConfirmDialog: no focus trap, no Escape handler | 2.1.2 No Keyboard Trap | High | `ConfirmDialog.tsx` |
| ConfirmDialog: no auto-focus on open | 2.4.3 Focus Order | Medium | `ConfirmDialog.tsx` |
| No skip-to-content link | 2.4.1 Bypass Blocks | Medium | `AppLayout.tsx` |
| PersonnummerInput: missing `autocomplete` | 1.3.5 Identify Input Purpose | Low | `PersonnummerInput.tsx` |

### Known Gaps — Details and Remediation

These gaps were identified during code review and are annotated in the test suite via `test.info().annotations` so they don't block CI but remain visible in reports.

#### 1. DataTable — keyboard inaccessible rows (High)
**Problem:** Interactive table rows use `onClick` but have no `tabIndex`, `role="row"` with `aria-selected`, or `onKeyDown` handler. Keyboard users cannot reach or activate rows.

**WCAG:** 2.1.1 Keyboard (A)

**Fix:** Add `tabIndex={0}`, `role="row"`, and an `onKeyDown` handler (Enter/Space) to each `<tr>` that has `onRowClick` or `renderSubRow`.

#### 2. DataTable — missing `aria-expanded` on expandable rows (High)
**Problem:** The expand/collapse chevron is `aria-hidden="true"` (correct) but the parent `<tr>` has no `aria-expanded` attribute. Screen readers cannot detect the expanded state.

**WCAG:** 4.1.2 Name, Role, Value (A)

**Fix:** Add `aria-expanded={isExpanded}` to the `<tr>` when `renderSubRow` is provided.

#### 3. ConfirmDialog — no focus trap or Escape key (High)
**Problem:** When the dialog opens, focus stays on the element behind the overlay. Pressing Escape does nothing. Tab can leave the dialog and reach page content behind the overlay.

**WCAG:** 2.1.2 No Keyboard Trap (A), 2.4.3 Focus Order (A)

**Fix:**
- Auto-focus the first button (`Avbryt`) or the dialog itself on mount.
- Add `onKeyDown` listener for Escape → call `onCancel`.
- Implement focus trap (loop Tab within dialog buttons).

#### 4. AppLayout — no skip-to-content link (Medium)
**Problem:** Keyboard users must Tab through the entire header and navigation before reaching main content. There is no skip link.

**WCAG:** 2.4.1 Bypass Blocks (A)

**Fix:** Add a visually-hidden skip link as the first focusable element: `<a href="#main-content" class="skip-link">Hoppa till innehåll</a>` and `id="main-content"` on the `<main>` element.

#### 5. PersonnummerInput — missing `autocomplete` (Low)
**Problem:** The personnummer input lacks the `autocomplete` attribute. Browsers and assistive tech cannot identify its purpose.

**WCAG:** 1.3.5 Identify Input Purpose (AA)

**Fix:** While no standard `autocomplete` value exists for Swedish personnummer, consider adding a custom `inputmode="numeric"` if not already present.

---

## POM Reference

The Page Object Model reference has been moved to [POM-REFERENCE.md](./POM-REFERENCE.md).

Use that document for:
- page and component purposes
- scope and key methods
- utility/reference descriptions

Keep this file focused on implemented and planned test coverage.

---

## Test Case Template

Use this template when adding new test cases:

```typescript
test('Should [action] when [condition]', async ({ test }) => {
  // Arrange: Set up initial state
  await loginAsUser('test-user-id', 'Visa');
  
  // Act: Perform the action
  await page.goto('/path/to/page');
  const result = await component.performAction();
  
  // Assert: Verify expected outcome
  expect(result).toBe(expectedValue);
});
```

---

## Execution Guide

### Run All Tests
```bash
npm run test:chromium
```

### Run Specific Test File
```bash
npm run test:chromium -- tests/login.spec.ts
```

### Run Headed (with browser UI)
```bash
npm run test:headed
```

### Debug Mode
```bash
npm run test:debug
```

### Generate HTML Report
```bash
npx playwright show-report
```

---

## Environment Setup

### Local Development
- Set `NODE_ENV=local`
- Fake login available
- Use test users from dropdown

### Test Environment
- Set `NODE_ENV=test`
- SAML enabled (mock)
- Use test credentials

### Production
- Set `NODE_ENV=prod`
- SAML enabled (real)
- Production credentials required

---

## CI/CD Integration

Tests run on:
- Every PR
- Merge to main
- Daily scheduled run

Configuration: `.github/workflows/playwright.yml`

---

## Notes & Good Practices

1. **Always use POMs** – Never use raw `page.locator()` in tests
2. **Prefer getByRole** – Use semantic locators over CSS selectors
3. **One assertion per test** – Keep tests focused
4. **Use test data builders** – Create test data with factory functions
5. **Clean up after tests** – Logout and clear state
6. **No hard waits** – Use web-first assertions and built-in waits

---

## Document Maintenance

- Update when adding new POMs
- Add test cases as they are implemented
- Update screenshots/video references as needed
- Keep environment setup current
- Review quarterly for outdated patterns

---

**Last Updated**: 2026-07-03  
**Created By**: Copilot  
**Status**: Active - Ready for Test Development

---

## Superseded Test Design: Administration - Klienter

> Superseded by **Test Design: Administration (Consolidated)** below. This
> section is retained temporarily as historical evidence for the earlier
> client-only design; use ADM identifiers and statuses for all new work.

### 1. Summary

This design covers the Admin workflow for finding and maintaining clients under
Administration → Klienter. The live exploration confirmed the current user-visible
flow: Admin login, client-ID and placement filters, URL-synchronised searches,
empty results, sortable and paginated results, client detail navigation, editable
client fields, save, and stoppdatum-based inactivation.

The design is intentionally separate from the implemented test inventory above.
It describes normal cases for future automation and risk-based cases that still
need explicit coverage. No real client identifiers are included here.

### 2. Traceability Between Changes and Tests

| Area | Vanilla cases | Edge cases | Exploratory charters | Automation candidates |
|---|---|---|---|---|
| Admin access and navigation | AK-01 | AK-E01, AK-E08 | AK-C1 | AK-A1 |
| Client-ID and placement search | AK-02 | AK-E02, AK-E03, AK-E04, AK-E05 | AK-C2 | AK-A2 |
| Result table, sorting, paging, and empty state | AK-03 | AK-E06, AK-E07 | AK-C3 | AK-A3 |
| Client detail and back navigation | AK-04 | AK-E09, AK-E10 | AK-C4 | AK-A4 |
| Edit and stoppdatum inactivation | AK-05 | AK-E11, AK-E12, AK-E13 | AK-C5 | AK-A5 |
| Privacy and accessibility | AK-01 to AK-05 | AK-E14, AK-E15 | AK-C6 | AK-A6 |

### 3. Step 1: Vanilla Test Cases

#### AK-01 — Admin opens the client administration page

| Field | Content |
|---|---|
| Related change | Administration → Klienter |
| Priority | High |
| Objective | Verify that an Admin can reach the client list and identify the available client-management controls. |
| Preconditions | The application is available; the supported Admin fake-login user is available; the test starts at `/fake-login`. |
| Test data | The supported Admin test user; a deterministic client fixture set. |
| Test steps and expected results | 1. Log in as Admin → the authenticated header shows the Admin role. 2. Open Administration → Klienter → the Klienter tab is selected and the client list is visible. 3. Verify the client-ID, placement, Sök, Rensa, and Skapa klient controls → each is visible and usable. |
| Expected final result | The Admin is on the client list without console errors or an authentication error. |
| Playwright automation suitability | Yes |
| Comment | Use the real fake-login flow and deterministic mocked client data; wait for the list heading and form rather than using a fixed delay. |

#### AK-02 — Admin searches by client ID and placement

| Field | Content |
|---|---|
| Related change | Client search |
| Priority | High |
| Objective | Verify that each supported filter finds the expected client rows and synchronises the search state in the URL. |
| Preconditions | AK-01 is complete; the client list has deterministic records for both filters. |
| Test data | One client-ID with a known match and one placement with known matches. |
| Test steps and expected results | 1. Enter the client-ID and submit Sök → matching row(s) appear and the URL contains the client-ID query. 2. Select Rensa → both fields and query state are cleared and the unfiltered list returns. 3. Enter the placement and submit Sök → matching rows appear and the URL contains the placement query. |
| Expected final result | The visible rows correspond to the active filter and no stale result remains after reset. |
| Playwright automation suitability | Yes |
| Comment | Assert row content and URL state; do not depend on production data values. |

#### AK-03 — Admin uses the result table

| Field | Content |
|---|---|
| Related change | Client result list |
| Priority | Medium |
| Objective | Verify that an Admin can change page size, move between pages, sort by each visible column, and recover from an empty search. |
| Preconditions | A fixture set larger than one page is available. |
| Test data | At least 25 clients with distinguishable IDs and placements, plus a value with no match. |
| Test steps and expected results | 1. Change the page-size selection → the displayed range and number of rows update. 2. Select Nästa sida → the next page of rows is shown. 3. Sort by client ID and placement → the table order changes according to the selected sort. 4. Search for a non-existing value → the table shows `Inga klienter matchar sökningen.`. 5. Select Rensa → the normal list returns. |
| Expected final result | Pagination, sorting, empty state, and reset remain understandable and usable. |
| Playwright automation suitability | Yes |
| Comment | Use fixture data with an unambiguous expected order; verify the accessible sort labels rather than icon glyphs. |

#### AK-04 — Admin opens and leaves client detail

| Field | Content |
|---|---|
| Related change | Client detail navigation |
| Priority | High |
| Objective | Verify that selecting a result opens the correct client detail and that Tillbaka returns to the list. |
| Preconditions | AK-02 has produced one deterministic result. |
| Test data | One client with complete detail data and permission responses. |
| Test steps and expected results | 1. Select the result row → the route contains the selected client ID and the heading identifies that client. 2. Verify the detail fields and Spara/Tillbaka controls → the loaded values match the fixture. 3. Select Tillbaka → the client list is shown without an unrelated client ID or stale detail form. |
| Expected final result | The selected client identity is preserved through navigation and the list remains usable after returning. |
| Playwright automation suitability | Yes |
| Comment | Assert the exact detail heading and readiness fields; do not use broad headings or arbitrary sleeps. |

#### AK-05 — Admin edits and inactivates a client

| Field | Content |
|---|---|
| Related change | Client maintenance and stoppdatum inactivation |
| Priority | Critical |
| Objective | Verify that client changes can be saved and that a stoppdatum represents inactivation without a delete action. |
| Preconditions | AK-04 is complete; the fixture client is editable. |
| Test data | Valid replacement values for editable fields and a deterministic stoppdatum. |
| Test steps and expected results | 1. Change the supported client fields → the form contains the new values. 2. Set Stoppdatum (inaktivering) and select Spara → the save request contains the changed client data and stoppdatum, and the success alert is shown. 3. Reload the detail → changed values and stoppdatum persist. 4. Inspect available actions → no client-delete control is present. |
| Expected final result | The client is represented as inactive through its stoppdatum, and saved data is durable after reload. |
| Playwright automation suitability | Yes |
| Comment | Mock the observed save API with stateful persistence and assert the request body; the exact inactive badge/state is TBD because the current UI exposes the stoppdatum rather than a separate badge. |

### 4. Step 2: Edge Case Analysis

| ID | Related change | Category | Priority | Risk or test idea | Why this is a risk | Expected behavior | Potential user impact | Recommended test type |
|---|---|---|---|---|---|---|---|---|
| AK-E01 | Admin access | Security misuse | Critical | Visa or unauthenticated user opens the client list or detail URL directly. | UI navigation alone must not protect administrative data. | Access is denied or redirected according to the application authorization policy; no client data is rendered. | Unauthorized disclosure or modification of client data. | Playwright + API |
| AK-E02 | Search filters | Invalid input | Medium | Search with whitespace-only, leading/trailing spaces, quotes, or unsupported characters. | Input can produce misleading filters or unsafe reflected text. | Input is handled as plain text, normalized consistently, and never executes markup; empty state or valid matches are explicit. | Confusing or unsafe search results. | Playwright |
| AK-E03 | Search filters | Boundary values | Medium | Empty, very short, and very long client-ID or placement values. | Length assumptions can break filtering and layout. | The page remains usable and gives a deterministic result or empty state. | Missed clients or unusable form. | Playwright |
| AK-E04 | Search results | Missing data | High | A response contains a null client ID or placement. | Client ID is a key display and navigation value. | The row renders safely or is rejected with a clear error; the page does not crash or create an invalid route. | An administrator may miss a client or open the wrong record. | API + Playwright |
| AK-E05 | Search results | Integration failure | High | The observed client-list request returns 401, 403, 500, malformed JSON, or times out. | A failed list can look like a legitimate empty list. | A clear error state is shown, sensitive old results are not presented as current, and retry/recovery is possible if supported. | Incorrect administrative decisions or confusion. | API + Playwright |
| AK-E06 | Table behavior | Timing/concurrency | High | Submit searches rapidly or change filters while a previous response is delayed. | Older responses can overwrite newer filter state. | The final visible result corresponds to the latest submitted search. | Wrong client list may be acted upon. | API + Playwright |
| AK-E07 | Table behavior | High-impact business risk | High | Change page size, page, sort, then apply or clear a filter. | Table state may show rows that do not match the current filter. | Pagination resets or remains consistent with the filtered dataset; counts and rows agree. | An administrator may select the wrong client. | Playwright |
| AK-E08 | Authorization | Security misuse | Critical | A non-Admin attempts client edit/save or calls the save operation directly. | Hidden controls are not an authorization boundary. | The operation is rejected and no data changes. | Unauthorized client modification. | API + Playwright |
| AK-E09 | Detail loading | Missing/unexpected data | High | Detail response is 404, null, incomplete, or identifies a different client than the route. | The form may display data for the wrong client. | Show a clear not-found/error state or reject the mismatch; never save under the wrong identity. | Wrong-client edits or misleading administration data. | API + Playwright |
| AK-E10 | Detail navigation | Browser/state | Medium | Refresh, browser back/forward, or direct deep link after a filtered list. | URL and visible data can diverge. | The route, heading, form values, and list filters remain consistent. | Users may believe they are editing another client. | Playwright |
| AK-E11 | Edit and inactivation | Validation/boundary | High | Invalid dates, a stoppdatum before the start date, or clearing an existing stoppdatum. | Inactivation dates affect whether a client is usable. | Validation or server response is shown clearly; invalid data is not saved; clearing follows the defined business rule. | Premature or failed inactivation. | Playwright + API |
| AK-E12 | Edit and inactivation | Integration failure | High | Save returns 400, 403, 409, or 500, or succeeds without persistence. | A misleading success state can cause incorrect operational assumptions. | Error is visible, unsaved values are not presented as persisted, and retry does not duplicate or corrupt data. | Administrators believe a change took effect when it did not. | API + Playwright |
| AK-E13 | Edit and inactivation | Timing/concurrency | High | Double-submit Spara or two tabs save different versions. | Last-write behavior may silently overwrite changes. | The application prevents duplicate submission or surfaces a conflict according to the version policy. | Lost changes or incorrect client status. | API + exploratory |
| AK-E14 | Privacy | Security/accessibility | Critical | Client or permission data appears in URL, console, error text, or an unauthorized page. | Administrative data may be sensitive even without patient data. | Only intended data is rendered to authorized users; diagnostics do not expose unnecessary values. | Data disclosure and compliance impact. | Manual + API |
| AK-E15 | Accessibility | Accessibility | Medium | Keyboard-only use, focus after search/reset/save, screen-reader labels, and status announcements. | Core administration work must not require a mouse or visual interpretation. | All controls are labelled and keyboard reachable; focus and success/error states are understandable. | Users may be blocked from client administration. | Playwright + manual |

### 5. Step 3: Exploratory Test Plan

#### 5.1 Test Objectives

- Confirm that an Admin can find, inspect, edit, and inactivate the intended client.
- Discover stale-state, race-condition, data-quality, authorization, and privacy failures.
- Verify that empty, error, and recovery states are distinguishable from successful empty results.
- Produce stable evidence for future Playwright tests without recording real client identifiers.

#### 5.2 Scope

**In scope:** Admin login, Administration → Klienter, client-ID and placement filters,
URL state, result table sorting and pagination, empty/reset behavior, client detail,
save, stoppdatum inactivation, back/forward, authorization, accessibility, and
observable `/api/webb/**` traffic.

**Out of scope:** Other Administration tabs, real patient workflows, backend
database correctness beyond observable API responses, and implementation of new
client-management behavior.

#### 5.3 Assumptions

- The supported Admin fake-login flow is available in the local test environment.
- Deterministic fixtures can provide zero, one, and many clients.
- The client list loads through `GET /api/webb/klient?kombika=ALLA`; exact error
  presentation for failures is TBD.
- Client detail loads through `GET /api/webb/klient/{id}` and save uses the
  observed client save operation; the exact server-side concurrency policy is TBD.
- Inactivation is represented by a non-empty `tomDat`/stoppdatum; a separate
  inactive badge is not currently confirmed.

#### 5.4 Risks

| Risk | Priority | Why it matters |
|---|---|---|
| Unauthorized users can read or modify client data through deep links or APIs | Critical | Administrative access controls must hold outside the visible navigation. |
| Wrong or stale rows are shown after filter, sort, or paging changes | High | An administrator may open or edit the wrong client. |
| Save reports success without durable persistence | High | Operational staff may rely on an unapplied change. |
| Invalid stoppdatum changes active/inactive status incorrectly | High | Client routing and data delivery may be affected. |
| Null or malformed client data crashes the list or detail page | High | A single bad record can block administration. |
| Sensitive values leak through diagnostics or URLs | Critical | Client and permission data requires controlled exposure. |

#### 5.5 Test Charters

| Charter | Priority | Goal | Areas to explore | Test ideas | Expected observations | Timebox | Related changes |
|---|---|---|---|---|---|---|---|
| AK-C1: Reach the administration surface | High | Establish whether role, route, and visible controls agree. | Fake login, direct routes, tabs, refresh, unauthorized user. | Compare Admin and Visa access; open list and detail URLs directly. | Authorization is enforced consistently and the Admin page is ready without errors. | 20 min | Admin access/navigation |
| AK-C2: Search for the intended client | High | Find filtering defects that could select the wrong client. | ID, placement, case, spaces, combined filters, reset, URL state. | Repeat searches, clear between searches, use zero/one/many matches. | Results and controls always describe the same active search. | 25 min | Client search |
| AK-C3: Stress the result table | Medium | Assess whether sorting, paging, and empty states remain trustworthy. | Page-size selector, next/previous, sort controls, counts, empty row. | Change table state before and after filtering; inspect keyboard operation. | Counts, order, row contents, and empty state remain coherent. | 25 min | Result table |
| AK-C4: Follow a client into detail | High | Detect route/data identity mismatches. | Row selection, detail loading, refresh, back/forward, missing client. | Open a row, compare identity and fields, return, deep-link to a missing ID. | The displayed heading, route, and data identify one client consistently. | 20 min | Client detail |
| AK-C5: Change client status safely | Critical | Explore persistence and inactivation risks. | Editable fields, save, validation, stoppdatum, reload, duplicate save. | Save valid data, inject failures, set/clear boundary dates, use two tabs. | Success/error state reflects persistence and status changes; no delete action is implied. | 30 min | Edit/inactivation |
| AK-C6: Review privacy and accessibility | Critical | Find exposure and operability defects. | Network/console, keyboard, focus, labels, announcements, viewport. | Inspect diagnostics after errors and complete the workflow without a mouse. | No unnecessary sensitive values leak; controls and state changes are perceivable and operable. | 20 min | Privacy/accessibility |

#### 5.6 Test Scenarios

| Scenario | Focus | Expected outcome |
|---|---|---|
| Admin searches for one known client ID | Core workflow | One matching row appears and opens the matching detail. |
| Admin searches placement with several matches | Filter semantics | Every visible row matches the placement criterion. |
| Admin searches for a nonexistent value and resets | Empty/recovery | The explicit empty state appears, then the full list returns after Rensa. |
| Admin changes page size and moves to another page | Table state | Range, rows, and controls remain consistent. |
| Admin sorts by client ID and placement | Ordering | The requested order is visible and stable. |
| Admin reloads a client detail | Identity/persistence | Heading and field values still identify the same client. |
| Admin saves an edit and stoppdatum | Business workflow | Success is visible and values persist after reload. |
| Visa user opens an Admin route | Authorization | No client data or edit capability is exposed. |

#### 5.7 Exploratory Missions

| Mission | Priority | Action |
|---|---|---|
| Find stale-filter confusion | High | Explore client-ID and placement searches using zero, one, and many matches, then clear and repeat to uncover rows or URL state that no longer match the controls. |
| Stress table state transitions | Medium | Explore page-size, pagination, sorting, and filtering in alternating order to uncover inconsistent counts, ordering, or row selection. |
| Prove client identity continuity | High | Explore row selection, refresh, back/forward, and direct detail URLs to uncover route/data mismatches. |
| Break the save workflow safely | High | Explore invalid values, repeated save, delayed save, and failed save responses to uncover false success or lost changes. |
| Challenge authorization boundaries | Critical | Explore Admin and Visa sessions against list, detail, and save routes to uncover access granted by UI-only checks. |
| Inspect privacy and accessibility | Critical | Explore browser diagnostics and keyboard-only operation during normal, empty, and error states to uncover data leakage or blocked users. |

#### 5.8 Negative Test Scenarios

- Return 401/403/500 and malformed data for the list and detail requests; verify
  that the UI does not present old client data as current.
- Return a null ID, missing placement, duplicate ID, or an empty object; verify
  safe rendering and explicit handling.
- Delay an older search response until after a newer search response; verify that
  the newer submitted search remains visible.
- Reject save after the user changes fields; verify that an error is visible and
  a reload does not falsely show the rejected values.
- Attempt save as a non-Admin and by direct request; verify no mutation occurs.
- Use invalid or boundary dates; exact validation rules and messages are `TBD`.

#### 5.9 Accessibility Checks

- Verify accessible names for client-ID, placement, Sök, Rensa, pagination, sort,
  detail fields, Spara, Tillbaka, and stoppdatum.
- Complete search, reset, row selection, detail navigation, and save using only
  keyboard input.
- Verify visible focus after search, reset, navigation, and save.
- Verify empty, loading, success, and error states are perceivable without relying
  on color or hover.
- Verify table headers, sort state, pagination state, and row meaning are
  understandable to assistive technology.

#### 5.10 Suggested Automation Candidates

| ID | Candidate | Type | Priority |
|---|---|---|---|
| AK-A1 | Admin login, Administration → Klienter readiness, and role visibility | Playwright UI | High |
| AK-A2 | Client-ID and placement search with URL and row assertions | Playwright UI | High |
| AK-A3 | Empty result followed by Rensa recovery | Playwright UI | High |
| AK-A4 | Row-to-detail identity and Tillbaka navigation | Playwright UI | High |
| AK-A5 | Stateful edit, stoppdatum save, success alert, and reload persistence | Playwright UI + request assertion | Critical |
| AK-A6 | Non-Admin deep-link and save denial | Playwright UI + API mock | Critical |
| AK-A7 | Delayed response race between two searches | Playwright API mock | High |
| AK-A8 | Keyboard and accessibility smoke coverage for the client workflow | Playwright + axe/manual review | Medium |

#### 5.11 Test Data Requirements

- A deterministic Admin login and a non-Admin login.
- Client fixtures with zero, one, and many matches for client-ID and placement.
- At least 25 clients with distinguishable IDs and placements for pagination.
- Fixtures with known sort order, duplicate values, null/missing fields, and a
  nonexistent search value.
- A complete editable client fixture and a deterministic stoppdatum.
- Mock responses for 401, 403, 404, 409, 500, malformed data, and delayed
  responses; exact production error payloads are `TBD`.
- No real client, patient, or permission identifiers in committed test data.

#### 5.12 Exit Criteria

- AK-01 through AK-05 pass with deterministic data.
- Critical and High edge cases have either an automated test, an exploratory
  finding with reproduction evidence, or an explicitly accepted `TBD`.
- Authorization is checked at both visible-route and save-operation level.
- Empty, error, delayed-response, and persistence behavior is documented.
- Keyboard and accessible-name checks cover the core workflow.
- No unexplained console errors or sensitive values appear in captured evidence.

### 6. Open Questions and Assumptions

- What is the authoritative business rule for an allowed stoppdatum range, and can
  an existing stoppdatum be cleared?
- What error message and recovery action should be shown for list/detail/save
  failures?
- Is optimistic concurrency enforced by `version`, and what should a conflict
  display to the Admin?
- Should the client list show a dedicated inactive indicator, or is the detail
  stoppdatum the only required indication?
- Is `Skapa klient` included in the intended workflow, and what are its validation
  and authorization requirements?
- Should sorting and pagination state be encoded in the URL and restored on
  browser navigation?
- Are client and permission values considered sensitive enough to require explicit
  masking in logs, screenshots, and error telemetry?
- Which exact non-Admin roles should be used for authorization coverage in each
  environment?
- The current exploratory session observed no console errors on the authenticated
  client search/detail flow; broader failure-state behavior remains `TBD`.

---

## Test Design: Administration (Consolidated)

### 1. Summary

This is the authoritative risk-based design for Administration navigation,
Klienter, Tjänsterapport, Svartlista, Banners, and role-based access. It covers
Admin (`TEST3`), Visa (`TEST1`), and Utdrag (`TEST4`) using the local
`/fake-login` flow, synthetic data, mocked `/api/webb/**` responses, and
real-service integration only where the UI needs database-backed state.

Evidence labels are `source`, `mock`, `integration`, `live`, or `TBD`. No live
exploratory session was performed for this consolidation; unverified runtime
behavior remains `TBD`.

### 2. Traceability Between Changes and Tests

| Scope | Vanilla cases | Edge cases | Exploratory charters | Automation candidates |
|---|---|---|---|---|
| Administration navigation | ADM-V01, ADM-V02 | ADM-E01, ADM-E02 | ADM-C1 | ADM-A1, ADM-A2 |
| Klienter | ADM-V03–ADM-V05 | ADM-E03–ADM-E08 | ADM-C2, ADM-C3 | ADM-A3–ADM-A6 |
| Tjänsterapport | ADM-V06 | ADM-E09, ADM-E10 | ADM-C4 | ADM-A7, ADM-A8 |
| Svartlista | ADM-V07, ADM-V08 | ADM-E11–ADM-E14 | ADM-C5 | ADM-A9, ADM-A10 |
| Banners | ADM-V09, ADM-V10 | ADM-E15–ADM-E18 | ADM-C6 | ADM-A11, ADM-A12 |
| Role-based access | ADM-V01, ADM-V02 | ADM-E01, ADM-E02, ADM-E05, ADM-E13, ADM-E17 | ADM-C1, ADM-C7 | ADM-A1, ADM-A2, ADM-A13 |

### 3. Step 1: Vanilla Test Cases

Normal workflows only. These cases use deterministic synthetic fixtures and
are suitable for Playwright when their stated evidence and data are available.

| ID | Workflow and oracle | Priority | Evidence | Automation |
|---|---|---|---|---|
| ADM-V01 | Admin opens Administration and all four tabs; every route and heading is correct. | High | source/mock | Yes |
| ADM-V02 | Visa and Utdrag see only policy-permitted navigation; Admin-only tabs are absent. | Critical | source/TBD | Yes, policy confirmation required |
| ADM-V03 | Admin searches Klienter by ID; URL, row, and detail identify the same synthetic client. | High | source/mock | Yes |
| ADM-V04 | Admin combines ID/placement filters, searches no-match data, and resets; URL and rows match active state. | High | source/mock | Yes |
| ADM-V05 | Admin edits a client and sets stoppdatum; request, success state, reload values, and no-delete rule are correct. | Critical | source/mock/TBD | Partial |
| ADM-V06 | Admin selects group `1` in Tjänsterapport; formatted report rows match the fixture. | High | source/mock | Yes |
| ADM-V07 | Admin adds a synthetic Svartlista entry; request, refresh, form reset, and single new row are correct. | Critical | source/mock | Yes |
| ADM-V08 | Admin cancels and then confirms Svartlista removal; only the target row is removed. | Critical | source/mock | Yes |
| ADM-V09 | Admin edits a Banner and cancels; editor changes are discarded and original content remains. | High | source/mock | Yes |
| ADM-V10 | Admin creates, orders, and deletes a Banner; pinned boundaries, confirmation, and refreshed order are correct. | High | source/mock/TBD | Partial |

### 4. Step 2: Edge Case Analysis

| ID | Category | Risk and expected behavior | Priority | Test type |
|---|---|---|---|---|
| ADM-E01 | Security misuse | Visa/Utdrag direct access to Admin-only routes is denied or redirected; no protected data renders. | Critical | Playwright + API |
| ADM-E02 | Security misuse | Non-Admin direct mutation calls are rejected and state is unchanged. | Critical | API + Playwright |
| ADM-E03 | Invalid input | Empty, whitespace, quotes, markup-like, and long client filters are safe and explicit. | Medium | Playwright |
| ADM-E04 | Missing data | Null/duplicate/malformed client rows do not crash or create an invalid route. | High | API + Playwright |
| ADM-E05 | Integration failure | Client/report reads returning 401/403/404/500, malformed JSON, or timeout do not look like valid empty data. | High | API + Playwright |
| ADM-E06 | Timing/concurrency | Delayed older client search responses cannot overwrite the latest submitted search. | High | API mock |
| ADM-E07 | Boundary validation | Invalid or conflicting stoppdatum values are rejected and not persisted. | High | Playwright + API |
| ADM-E08 | Recovery/idempotency | Failed or double-submitted client saves leave a retryable, truthful state. | High | API + exploratory |
| ADM-E09 | Missing data | Empty, single, many, null-ended, or malformed report rows render safely. | High | API + Playwright |
| ADM-E10 | Timing/integration | Rapid group changes show only the latest group; empty and error states are distinct. | High | API mock |
| ADM-E11 | Invalid input | Invalid/blank/long Svartlista values do not create partial entries. | Critical | Playwright + API |
| ADM-E12 | Idempotency | Duplicate add or double-submit follows a defined policy without unintended duplicates. | High | API + exploratory |
| ADM-E13 | Security misuse | Visa/Utdrag cannot add, delete, or manipulate a blacklist entry ID. | Critical | API + Playwright |
| ADM-E14 | Recovery | Failed blacklist mutation or refresh leaves form and rows consistent with server state. | High | API + Playwright |
| ADM-E15 | Validation | Empty/unsafe Banner content is rejected or sanitized according to the confirmed policy. | Medium | Playwright + API |
| ADM-E16 | Timing/concurrency | Double-save or stale Banner editors do not silently lose or duplicate content. | High | API + exploratory |
| ADM-E17 | Security misuse | Visa/Utdrag cannot open or mutate the Banner editor directly. | Critical | API + Playwright |
| ADM-E18 | Business boundary | First/last/pinned Banner ordering and empty-list states remain deterministic. | Medium | Playwright + API |

Browser/device-specific Administration behavior is covered by the existing
accessibility/reflow suites rather than duplicated here. Scale beyond
deterministic zero/one/many fixtures is `TBD`.

### 5. Step 3: Exploratory Test Plan

#### 5.1 Test Objectives and Scope

Confirm that Admin can complete every Administration workflow, that Visa and
Utdrag cannot perform Admin-only actions, and that route, URL, data, error,
loading, empty, privacy, and accessibility states remain coherent.

In scope: four Administration routes, client search/detail/edit/inactivation,
report group selection, blacklist add/remove, Banner edit/create/delete/order,
direct routes, API traffic, keyboard access, and failure states.

Out of scope: Banner display on other pages, real patient workflows, production
SAML behavior, and database correctness beyond observable API responses.

#### 5.2 Assumptions and Risks

- Local UI is available at `http://localhost:8081/fake-login`.
- `TEST1`, `TEST3`, and `TEST4` remain supported synthetic users.
- Deterministic mocks can provide zero, one, and many results.
- Exact production error payloads, date rules, concurrency policy, and Utdrag
  authorization are `TBD`.
- Critical risks are unauthorized access/mutation and sensitive data leakage;
  high risks are stale/out-of-order results, false mutation success, and
  incorrect Banner/report state.

#### 5.3 Test Charters

| ID | Priority | Goal | Mission | Expected observations | Timebox |
|---|---|---|---|---|---|
| ADM-C1 | Critical | Prove the role boundary. | Compare Admin, Visa, and Utdrag across tabs, direct routes, refresh, and mutations. | UI/API authorization agrees; no protected data leaks. | 25 min |
| ADM-C2 | High | Find client identity errors. | Alternate zero/one/many ID and placement searches, reset, reload, and history. | URL, controls, rows, heading, and form identify one client. | 30 min |
| ADM-C3 | Critical | Stress client mutations. | Try invalid dates, delayed saves, duplicate saves, two tabs, and reload. | No false success, wrong-client save, or delete behavior. | 30 min |
| ADM-C4 | High | Establish report trustworthiness. | Change groups rapidly using delayed, empty, malformed, and failed responses. | Latest group owns the visible report and state is explicit. | 20 min |
| ADM-C5 | Critical | Explore blacklist safety. | Use invalid/duplicate synthetic values, confirm/cancel, and failed mutations. | Only intended entries change and privacy is preserved. | 30 min |
| ADM-C6 | High | Explore Banner lifecycle/order. | Edit/create types, cancel, move boundaries, delete, and interrupt requests. | Content, type, order, and mutation state remain coherent. | 30 min |
| ADM-C7 | Critical | Inspect privacy/accessibility. | Complete workflows with keyboard and inspect focus, alerts, console, and network. | State is perceivable/operable and unnecessary sensitive values are absent. | 20 min |

#### 5.4 Negative Scenarios and Accessibility

- Inject 401/403/404/409/500, malformed, delayed, and empty responses; verify
  stale protected data is not presented as current.
- Submit blank/whitespace/malformed values and repeat mutations; verify no
  unintended state change.
- Delay an older response after a newer request; verify the newest state wins.
- Refresh, use back/forward, and open direct routes; verify route and visible
  identity remain aligned.
- Verify accessible names, keyboard completion, focus after route/search/reset/
  dialog/save/error, and non-color status communication.
- Reuse existing axe, keyboard, focus, ARIA, contrast, and reflow coverage.

### 6. Suggested Automation Candidates

The lifecycle is `Draft`, `Ready for review`, `Approved for implementation`,
`Implemented`, or `Blocked`. Only `Approved for implementation` candidates are
implementation-ready for `application-playwright.agent.md`.

| ID | Lifecycle | Candidate and oracle | Route/data/evidence | Verification and related test |
|---|---|---|---|---|
| ADM-A1 | Implemented | Admin opens all four tabs with correct URL/headings. | TEST3; read mocks; `/administration/**`; mock | Mocked UI — `tests/vanilla/adminpage.spec.ts`, `ADM-A1: Admin navigation opens all four Administration tabs` |
| ADM-A2 | Draft | Visa/Utdrag visible navigation matches policy and direct access is handled. | TEST1/TEST4; role matrix TBD; mock/API | UI + API; partial `tests/vanilla/vanilla.spec.ts` Visa navigation case |
| ADM-A3 | Draft | ID/placement search, URL, empty state, and reset produce matching rows. | 0/1/many client fixtures; `/administration/klienter`; mock | Mocked UI; partial `adminpage.spec.ts`, `Admin finds a client by client ID` |
| ADM-A4 | Draft | Row-to-detail identity and back navigation remain consistent. | Complete synthetic detail; `/administration/klienter/{id}`; mock | Mocked UI; partial `vanilla.spec.ts`, client filter/detail test |
| ADM-A5 | Draft | Edit/stoppdatum request, success, reload persistence, and no-delete rule. | Synthetic editable client; GET/PUT; mock/TBD persistence | UI + request; partial `vanilla.spec.ts`, client edit test |
| ADM-A6 | Draft | Non-Admin client detail/save denial. | TEST1/TEST4; 403 mock/API; `/administration/klienter/**` | UI + API; partial expected-failure `admin-deep-link-authorization.spec.ts` |
| ADM-A7 | Draft | Group selection displays correctly formatted report rows. | Group `1`; `/administration/rapport`; mock | Mocked UI; `vanilla.spec.ts`, service report test |
| ADM-A8 | Draft | Empty/error/out-of-order report responses leave a truthful usable state. | Empty/500/delayed report mocks; mock | UI + API mock; partial `service-overview.spec.ts` |
| ADM-A9 | Draft | Add blacklist entry and verify refreshed list/form reset. | Stable synthetic entry; `/administration/blacklist`; mock | UI + request; not implemented |
| ADM-A10 | Draft | Cancel/confirm blacklist removal and verify target-only deletion. | Stable synthetic ID; mock | Mocked UI; not implemented |
| ADM-A11 | Draft | Banner edit/create/cancel/type behavior is persisted or safely discarded. | Welcome banner fixtures; `/administration/banners`; mock/TBD | UI + request; not implemented |
| ADM-A12 | Draft | Banner ordering boundaries and delete confirmation are safe. | Pinned/movable ordered fixtures; mock | UI + API mock; not implemented |
| ADM-A13 | Draft | Visa/Utdrag Admin mutation requests are rejected with no state change. | TEST1/TEST4; direct mutation calls; API | API + UI; direct-route cases are only partial |

All candidates must use existing page objects/fake-login, install mocks before
navigation, assert known method/URL/payload/status values, use synthetic
parallel-safe data, clean mutation fixtures, and exclude sensitive values from
artifacts.

### 7. Test Data, Exit Criteria, and Open Questions

**Data requirements:** TEST3/Admin, TEST1/Visa, TEST4/Utdrag; client fixtures
with zero/one/many, duplicate, missing-field, and nonexistent-filter cases;
editable client and stoppdatum; group `1` report fixtures; blacklist entries
with stable synthetic IDs; pinned/movable Banner fixtures; and 401/403/404/
409/500, malformed, and delayed responses. No real client, patient,
personnummer, credentials, or production identifiers.

**Exit criteria:** ADM-V01–ADM-V10 have reviewed or approved oracles; Critical
and High edge cases have automation, exploratory evidence, or accepted `TBD`;
authorization is checked at visible-route and API levels; mutable features
cover empty/error/delayed/confirmation/cancellation/recovery states; and
keyboard/accessibility checks cover core workflows.

**Open questions:** authoritative Utdrag permissions; unauthorized-route
contract (403 versus redirect); exact BFF mutation URLs/payloads; stoppdatum
rules; optimistic concurrency behavior; personnummer masking requirements;
editable Banner metadata and sanitization; and pagination/sorting contract.
