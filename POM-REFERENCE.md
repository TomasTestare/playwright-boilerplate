# Optional GVR Playwright POM Reference

This document describes the available Page Objects, components, and related test utilities used by the Playwright suite.

This is retained application-specific reference material, not part of the
generic starter contract. For its implemented and planned coverage, see
[GVR-TESTPLAN.md](./GVR-TESTPLAN.md). For a new project, use the generic
[TESTPLAN.md](./TESTPLAN.md) template instead.

---

## Phase 1: Core Shared Components (5 POMs) — Reference Documentation

Reusable UI components shared across all modules.

### 1.1 SharedHeaderComponent
**Location**: `pageObjects/components/SharedHeaderComponent.ts`

**Purpose**: Application header with user info, role, and logout.

**Scope**:
- Logo/branding
- Current user display
- User role display
- Logout button
- Environment banner (local/test/prod)

**Key Methods**:
- `getHeaderElement()` – Locate header container
- `getUserName()` – Get current user display name
- `getUserRole()` – Get user role (Visa, Admin, etc)
- `logout()` – Click logout button
- `isEnvironmentBannerVisible()` – Check banner state
- `getEnvironmentBannerText()` – Get banner text (Local/Test/Prod)

**Test Cases**: See [GVR-TESTPLAN.md](./GVR-TESTPLAN.md).

---

### 1.2 SharedNavComponent
**Location**: `pageObjects/components/SharedNavComponent.ts`

**Purpose**: Main navigation menu/sidebar (desktop & mobile support).

**Scope**:
- Main navigation menu
- Active link highlighting
- Mobile hamburger menu
- Navigation links (Vardhandelse, Vardperiod, Vantande, Administration)
- Responsive behavior

**Key Methods**:
- `getNavContainer()` – Locate nav element
- `isNavOpen()` – Check if nav is visible (mobile)
- `toggleNav()` – Open/close mobile nav
- `navigateTo(menuItem)` – Click nav link
- `getActiveNavLink()` – Get current active link
- `getNavLinks()` – Get all available nav links

**Test Cases**: See [GVR-TESTPLAN.md](./GVR-TESTPLAN.md).

---

### 1.3 SharedTableComponent
**Location**: `pageObjects/components/SharedTableComponent.ts`

**Purpose**: Reusable data table with sorting, filtering, pagination.

**Scope**:
- Table headers and rows
- Column sorting
- Pagination controls
- Row selection (if applicable)
- Empty state messaging
- Loading state

**Key Methods**:
- `getTable()` – Locate table element
- `getRowCount()` – Count visible data rows
- `getRowAtIndex(index)` – Get row element
- `getCellValue(rowIndex, colIndex)` – Get cell content
- `sortByColumn(columnName)` – Click column header
- `getSortIndicator(columnName)` – Get sort direction
- `nextPage()` – Navigate to next page
- `previousPage()` – Navigate to previous page
- `getCurrentPage()` – Get current page number
- `isEmpty()` – Check if table is empty
- `isLoading()` – Check loading state

**Test Cases**: See [GVR-TESTPLAN.md](./GVR-TESTPLAN.md).

---

### 1.4 SharedFormComponent
**Location**: `pageObjects/components/SharedFormComponent.ts`

**Purpose**: Form wrapper with error states and validation messaging.

**Scope**:
- Form inputs
- Validation error messages
- Submit button
- Clear/reset button
- Error state styling

**Key Methods**:
- `getForm()` – Locate form element
- `fillInput(fieldName, value)` – Set input value
- `getInputValue(fieldName)` – Get input value
- `getErrorMessage(fieldName)` – Get field error text
- `hasErrorFor(fieldName)` – Check if field has error
- `submit()` – Click submit button
- `isSubmitButtonDisabled()` – Check submit state
- `clear()` – Click clear/reset button
- `hasValidationError()` – Check if form has any errors

**Test Cases**: See [GVR-TESTPLAN.md](./GVR-TESTPLAN.md).

---

### 1.5 SharedModalComponent
**Location**: `pageObjects/components/SharedModalComponent.ts`

**Purpose**: Modal dialog for confirmations, errors, and prompts.

**Scope**:
- Modal overlay
- Modal title and content
- Confirm and cancel buttons
- Modal close button
- Error/warning/info styling

**Key Methods**:
- `getModal()` – Locate modal element
- `getModalTitle()` – Get modal title text
- `getModalContent()` – Get modal body text
- `getConfirmButton()` – Locate confirm button
- `getCancelButton()` – Locate cancel button
- `getCloseButton()` – Locate close (X) button
- `confirm()` – Click confirm button
- `cancel()` – Click cancel button
- `close()` – Click close button
- `isVisible()` – Check if modal is open
- `getModalType()` – Get modal type (error/warning/info)

**Test Cases**: See [GVR-TESTPLAN.md](./GVR-TESTPLAN.md).

---

## Phase 2: Login (2 POMs)

User authentication and fake-login for local development.

### 2.1 LoginPage
**Location**: `pageObjects/pages/LoginPage.ts`

**Purpose**: Main login page with form, error handling, SAML fake-login support.

**Scope**:
- Login form (production SAML or local fake-login)
- Username/email input
- Password input (if applicable)
- Submit button
- Error messages
- SAML message (production mode)
- Fake login selector (local dev)

**Key Methods**:
- `open()` – Navigate to `/login`
- `loginAsUser(userId)` – Complete login flow
- `selectTestUser(userId)` – Select from fake login dropdown
- `clickLoginButton()` – Submit login
- `getErrorMessage()` – Get error text
- `isErrorVisible()` – Check error visibility
- `isFakeLoginVisible()` – Detect local dev mode
- `isSamlMessageVisible()` – Detect production mode
- `getTestUserOptions()` – List available test users
- `waitForPageLoad()` – Wait for login page ready

**Test Cases**: See [GVR-TESTPLAN.md](./GVR-TESTPLAN.md).

---

### 2.2 FakeLoginComponent
**Location**: `pageObjects/components/FakeLoginComponent.ts`

**Purpose**: Local dev fake login selector (supports selecting test users).

**Scope**:
- Fake login dropdown/selector
- Test user list
- Login button
- Instructions text

**Key Methods**:
- `selectTestUser(hsaId)` – Select a specific user
- `submitFakeLogin()` – Click login
- `loginAsUser(hsaId)` – Combined select + submit
- `getSelectedHsaId()` – Get current selection
- `getAvailableUsers()` – List all test users
- `getUserDisplayText(hsaId)` – Get display name
- `isVisible()` – Check component visibility
- `isSubmitButtonDisabled()` – Check button state
- `waitForVisible()` – Wait for component

**Test Cases**: See [GVR-TESTPLAN.md](./GVR-TESTPLAN.md).

---

## Phase 3: Vårdhandelse (Healthcare Events) (5 POMs)

Healthcare event search, viewing, and management.

### 3.1 VardhandelsePage
**Location**: `pageObjects/pages/VardhandelsePage.ts`

**Purpose**: Main list/search page for healthcare events.

**Scope**:
- Search form integration
- Results table integration
- Page header
- Navigation controls

**Key Methods**:
- `open()` – Navigate to `/vardhandelse/sok`
- `getSearchComponent()` – Access search form
- `getTableComponent()` – Access results table
- `navigate()` – Navigate to page

**Test Cases**: See [GVR-TESTPLAN.md](./GVR-TESTPLAN.md).

---

### 3.2 VardhandelseDetailPage
**Location**: `pageObjects/pages/VardhandelseDetailPage.ts`

**Purpose**: Detail view for a single healthcare event (read-only).

**Scope**:
- Event ID and basic info
- Event dates and times
- Event status
- Event type/classification
- Related information tabs
- Back button

**Key Methods**:
- `navigateToDetail(eventId)` – Navigate to event detail
- `getEventId()` – Get event ID
- `getEventTitle()` – Get event title
- `getEventStatus()` – Get status
- `getEventDates()` – Get start/end dates
- `getRelatedEvents()` – Get linked events
- `goBack()` – Navigate back to list
- `getEventDetails()` – Get all event info

**Test Cases**: See [GVR-TESTPLAN.md](./GVR-TESTPLAN.md).

---

### 3.3 VardhandelseSearchComponent
**Location**: `pageObjects/components/VardhandelseSearchComponent.ts`

**Purpose**: Search/filter form (date range, status filters).

**Scope**:
- Patient ID input
- Date range pickers (from/to)
- Status filter dropdown
- Event type filter
- Search button
- Clear button

**Key Methods**:
- `setPatientId(id)` – Enter patient ID
- `setFromDate(date)` – Set start date
- `setToDate(date)` – Set end date
- `setStatusFilter(status)` – Select status
- `setEventTypeFilter(type)` – Select event type
- `search()` – Click search button
- `clear()` – Click clear button
- `fillSearchForm(criteria)` – Fill all fields

**Test Cases**: See [GVR-TESTPLAN.md](./GVR-TESTPLAN.md).

---

### 3.4 VardhandelseTableComponent
**Location**: `pageObjects/components/VardhandelseTableComponent.ts`

**Purpose**: Events table with event-specific columns.

**Scope**:
- Event list rows
- Event ID, title, date, status columns
- Pagination
- Sorting
- Row click to detail

**Key Methods**:
- `getRowCount()` – Count events
- `getEventAtRow(index)` – Get event data
- `clickEventRow(index)` – Navigate to detail
- `getEventId(index)` – Get event ID at row
- `getEventTitle(index)` – Get event title
- `getEventStatus(index)` – Get event status
- `nextPage()` – Go to next page
- `previousPage()` – Go to previous page
- `sortByColumn(columnName)` – Sort column

**Test Cases**: See [GVR-TESTPLAN.md](./GVR-TESTPLAN.md).

---

### 3.5 PatientOversiktPage
**Location**: `pageObjects/pages/PatientOversiktPage.ts`

**Purpose**: Patient overview search page.

**Scope**:
- Search form for patient lookup
- Current patient result panel
- Reset of previous result when a new search is performed

**Key Methods**:
- `open()` – Navigate to the patient overview page
- `search(personnummer)` – Execute a patient search
- `getResultPanel()` – Access the current result area
- `getEmptyStateMessage()` – Get the no-result message

**Test Cases**: See [GVR-TESTPLAN.md](./GVR-TESTPLAN.md).

---

## Phase 4: Vårdperiod (Care Periods) (4 POMs)

Care period search, viewing, and management.

### 4.1 VardperiodPage
**Location**: `pageObjects/pages/VardperiodPage.ts`

**Purpose**: Main list/search page for care periods.

**Scope**:
- Search form integration
- Results table integration
- Page header

**Key Methods**:
- `open()` – Navigate to `/vardperiod/sok`
- `getSearchComponent()` – Access search form
- `getTableComponent()` – Access results table

**Test Cases**: See [GVR-TESTPLAN.md](./GVR-TESTPLAN.md).

---

### 4.2 VardperiodDetailPage
**Location**: `pageObjects/pages/VardperiodDetailPage.ts`

**Purpose**: Detail view for a care period (read-only).

**Scope**:
- Period ID and dates
- Period status
- Related events
- Back button

**Key Methods**:
- `navigateToDetail(periodId)` – Navigate to period
- `getPeriodId()` – Get period ID
- `getStartDate()` – Get start date
- `getEndDate()` – Get end date
- `getRelatedEvents()` – Get linked events
- `goBack()` – Navigate back

**Test Cases**: See [GVR-TESTPLAN.md](./GVR-TESTPLAN.md).

---

### 4.3 VardperiodSearchComponent
**Location**: `pageObjects/components/VardperiodSearchComponent.ts`

**Purpose**: Search/filter form for care periods.

**Scope**:
- Patient ID input
- Date range pickers
- Status filter
- Search/clear buttons

**Key Methods**:
- `setPatientId(id)` – Enter patient ID
- `setFromDate(date)` – Set start date
- `setToDate(date)` – Set end date
- `search()` – Click search button
- `clear()` – Clear form

**Test Cases**: See [GVR-TESTPLAN.md](./GVR-TESTPLAN.md).

---

### 4.4 VardperiodTableComponent
**Location**: `pageObjects/components/VardperiodTableComponent.ts`

**Purpose**: Care periods table.

**Scope**:
- Period list rows
- Period ID, dates, status columns
- Pagination and sorting

**Key Methods**:
- `getRowCount()` – Count periods
- `getPeriodAtRow(index)` – Get period data
- `clickPeriodRow(index)` – Navigate to detail
- `nextPage()` – Next page
- `previousPage()` – Previous page

**Test Cases**: See [GVR-TESTPLAN.md](./GVR-TESTPLAN.md).

---

## Phase 5: Vantande (Waiting List) (2 POMs)

Waiting list search and management.

### 5.1 VantandePage
**Location**: `pageObjects/pages/VantandePage.ts`

**Purpose**: Waiting list search/view page.

**Scope**:
- Search form
- Results table
- Admin void operations (Makulera)

**Key Methods**:
- `open()` – Navigate to `/vantande/sok`
- `search(personnummer, startDate?, endDate?)` – Execute search
- `getTableComponent()` – Access table
- `openMakuleraDialog()` – Open void dialog
- `confirmMakulera()` – Confirm void operation
- `cancelMakulera()` – Cancel void operation

**Test Cases**: See [GVR-TESTPLAN.md](./GVR-TESTPLAN.md).

---

### 5.2 VantandeTableComponent
**Location**: `pageObjects/components/VantandeTableComponent.ts`

**Purpose**: Waiting list table.

**Scope**:
- Waiting list entries
- Patient/person info
- Priority and status
- Action buttons (admin)

**Key Methods**:
- `getRowCount()` – Count entries
- `getRowCells(rowIndex)` – Get row cells
- `getCellText(rowIndex, colIndex)` – Get cell value
- `clickRow(rowIndex)` – Click row
- `toggleRowExpansion()` – Expand row details
- `getButtonInRow(rowIndex)` – Get action button
- `clickButtonInRow(rowIndex)` – Click action

**Test Cases**: See [GVR-TESTPLAN.md](./GVR-TESTPLAN.md).

---

## Phase 6: Administration (7 POMs)

Admin functions for system management.

### 6.1 AdministrationPage
**Location**: `pageObjects/pages/AdministrationPage.ts`

**Purpose**: Admin dashboard/landing page.

**Scope**:
- Admin menu
- Links to sub-pages
- Admin status/info

**Key Methods**:
- `open()` – Navigate to `/administration`
- `navigateToKlient()` – Go to client management
- `navigateToInfotext()` – Go to infotext management
- `navigateToBlacklist()` – Go to blacklist management
- `navigateToRetfil()` – Go to retfil management

**Test Cases**: See [GVR-TESTPLAN.md](./GVR-TESTPLAN.md).

---

### 6.2 KlientPage
**Location**: `pageObjects/pages/KlientPage.ts`

**Purpose**: Client management list/search page.

**Scope**:
- Client search form
- Client results table
- Add client button (admin)
- Client edit/detail links
- **NO delete button** (inactivation only)

**Key Methods**:
- `open()` – Navigate to `/administration/klient`
- `search(query)` – Search clients
- `getTableComponent()` – Access client table
- `clickAddClient()` – Navigate to add form
- `clickClientRow(index)` – Open client detail
- `getClientCount()` – Count results

**Test Cases**: See [GVR-TESTPLAN.md](./GVR-TESTPLAN.md).

---

### 6.3 KlientDetailPage
**Location**: `pageObjects/pages/KlientDetailPage.ts`

**Purpose**: Client details view/edit page.

**Scope**:
- Client information fields
- Stoppdatum (inactivation date)
- Save button
- Back button
- **NO delete button** (inactivation via stoppdatum)

**Key Methods**:
- `navigateToDetail(clientId)` – Open client detail
- `getClientId()` – Get client ID
- `getClientName()` – Get client name
- `getStoppdatum()` – Get inactivation date
- `setStoppdatum(date)` – Set inactivation date
- `save()` – Save changes
- `goBack()` – Return to list
- `isDeleteButtonVisible()` – Verify no delete button

**Test Cases**: See [GVR-TESTPLAN.md](./GVR-TESTPLAN.md).

---

### 6.4 InfotextPage
**Location**: `pageObjects/pages/InfotextPage.ts`

**Purpose**: Infotext management page.

**Scope**:
- Infotext list
- Edit buttons
- Infotext form/editor
- Save button

**Key Methods**:
- `open()` – Navigate to `/administration/infotext`
- `getInfotextList()` – Get all infotexts
- `clickEditInfotext(index)` – Open editor
- `setInfotextContent(content)` – Set text
- `save()` – Save changes
- `getInfotextAtIndex(index)` – Get infotext

**Test Cases**: See [GVR-TESTPLAN.md](./GVR-TESTPLAN.md).

---

### 6.5 BlacklistPage
**Location**: `pageObjects/pages/BlacklistPage.ts`

**Purpose**: Blacklist management page.

**Scope**:
- Blacklist entries table
- Add to blacklist form
- Delete buttons
- Reason/notes field

**Key Methods**:
- `open()` – Navigate to `/administration/blacklist`
- `getBlacklistTable()` – Access entry table
- `addToBlacklist(personnummer, reason?)` – Add entry
- `removeFromBlacklist(id)` – Delete entry
- `getEntryCount()` – Count entries
- `confirmDelete()` – Confirm delete dialog

**Test Cases**: See [GVR-TESTPLAN.md](./GVR-TESTPLAN.md).

---

### 6.6 RetfilPage
**Location**: `pageObjects/pages/RetfilPage.ts`

**Purpose**: Retfil management page (read-only).

**Scope**:
- Retfil data list
- Read-only view
- No edit/delete buttons

**Key Methods**:
- `open()` – Navigate to `/administration/retfil`
- `getRetfilList()` – Get all entries
- `getRetfilCount()` – Count entries
- `selectRetfilGroup(groupName)` – Filter by group
- `getRetfilAtIndex(index)` – Get entry

**Test Cases**: See [GVR-TESTPLAN.md](./GVR-TESTPLAN.md).

---

### 6.7 AdminOverviewPage
**Location**: `pageObjects/pages/AdminOverviewPage.ts`

**Purpose**: Administration overview for service-based client/kombika lookups.

**Scope**:
- Service selector/search input
- Result list of client IDs and kombikas
- Administration tab navigation

**Key Methods**:
- `open()` – Navigate to the administration overview
- `search(serviceName)` – Look up a service
- `getResultRows()` – Get the matching overview rows
- `getResultAtIndex(index)` – Read one matching row

**Test Cases**: See [GVR-TESTPLAN.md](./GVR-TESTPLAN.md).

---

## Phase 7: Utilities (3 Files)

### 7.1 gvrPageFixture.ts
**Location**: `pageObjects/gvrPageFixture.ts`

**Purpose**: Enhanced test fixture with app-specific helpers.

**Key Helpers**:
- `loginAsUser(userId, role)` – User login
- `navigateToApp()` – App navigation
- `logoutCurrentUser()` – User logout
- `getCurrentUser()` – Get user info
- `getEnvironment()` – Get environment type

### 7.2 testData.ts
**Location**: `utils/testData.ts`

**Purpose**: Test data builders and factories.

**Factory Functions**:
- `createVardhandelse(overrides?)` – Mock healthcare event
- `createVardperiod(overrides?)` – Mock care period
- `createKlient(overrides?)` – Mock client
- `createVantandeEntry(overrides?)` – Mock waiting list entry
- `createUser(userId, role)` – Mock user

### 7.3 selectors.ts
**Location**: `utils/selectors.ts`

**Purpose**: Centralized selector constants.

**Selector Groups**:
- `header`, `navigation`, `common`
- `login`, `fakeLogin`
- `dashboard`
- `vardhandelse`, `vardperiod`, `vantande`
- `administration` (all sub-modules)
