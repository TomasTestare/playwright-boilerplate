/**
 * Centralized CSS and data-testid selectors for GVR application.
 * Single source of truth for all UI element selectors.
 * Organized hierarchically by feature/component for easy navigation and updates.
 *
 * @example
 * import { SELECTORS } from '../utils/selectors';
 *
 * const header = page.locator(SELECTORS.header.userInfo);
 * const loginButton = page.locator(SELECTORS.login.button);
 */

export const SELECTORS = {
  // ========================================================================
  // Shared/Global Components
  // ========================================================================

  header: {
    /** Main header container (IDS design header) */
    container: 'ids-wc-header-inera-general',
    /** User info display in header */
    userInfo: '[data-testid="header-user-info"]',
    /** User name text */
    userName: '[data-testid="header-user-name"]',
    /** Logout button/link */
    logout: '[data-testid="header-logout"]',
    /** Menu button (hamburger) */
    menu: '[data-testid="header-menu"]',
    /** Environment badge (local/test/prod) */
    environmentBadge: '[data-testid="environment-badge"]',
  },

  navigation: {
    /** Main navigation container */
    container: '[data-testid="main-nav"]',
    /** Navigation list */
    list: '[data-testid="nav-list"]',
    /** Home link */
    home: '[data-testid="nav-home"]',
    /** Vårdhandelse link */
    vardhandelse: '[data-testid="nav-vardhandelse"]',
    /** Vårdperiod link */
    vardperiod: '[data-testid="nav-vardperiod"]',
    /** Vantande (waiting list) link */
    vantande: '[data-testid="nav-vantande"]',
    /** Administration link */
    administration: '[data-testid="nav-admin"]',
    /** Settings link */
    settings: '[data-testid="nav-settings"]',
  },

  common: {
    /** Loading spinner/indicator */
    loading: '[data-testid="loading-spinner"]',
    /** Generic error message container */
    errorMessage: '[data-testid="error-message"]',
    /** Generic success message container */
    successMessage: '[data-testid="success-message"]',
    /** Generic warning message container */
    warningMessage: '[data-testid="warning-message"]',
    /** Table element */
    table: 'table',
    /** Modal dialog */
    modal: '[role="dialog"]',
    /** Form element */
    form: 'form',
    /** Search input */
    searchInput: 'input[type="search"]',
    /** Submit button */
    submitButton: 'button[type="submit"]',
    /** Cancel button */
    cancelButton: '[data-testid="button-cancel"]',
    /** Delete/Remove button */
    deleteButton: '[data-testid="button-delete"]',
    /** Edit button */
    editButton: '[data-testid="button-edit"]',
    /** Save button */
    saveButton: '[data-testid="button-save"]',
    /** Close button (X) */
    closeButton: '[data-testid="button-close"]',
  },

  // ========================================================================
  // Login / Authentication
  // ========================================================================

  login: {
    /** Login page container */
    container: '[data-testid="login-page"]',
    /** Login form */
    form: '[data-testid="login-form"]',
    /** Main heading "Gemensamt vårdregister" */
    heading: 'h1',
    /** Test user selector dropdown (fake login) */
    userSelect: '[data-testid="fake-login-select"]',
    /** Login button */
    button: '[data-testid="login-button"]',
    /** Loading indicator on button */
    buttonLoading: '[data-testid="login-button-loading"]',
    /** Error message alert */
    errorAlert: '[data-testid="login-error"]',
    /** SAML message (production) */
    samlMessage: '[data-testid="saml-message"]',
    /** Loading message */
    loadingMessage: '[data-testid="login-loading"]',
  },

  // ========================================================================
  // Fake Login Component (local development)
  // ========================================================================

  fakeLogin: {
    /** Fake login container */
    container: '[data-testid="fake-login-container"]',
    /** User option list */
    optionsList: '[data-testid="fake-login-options"]',
    /** Role selector */
    roleSelect: '[data-testid="fake-login-role"]',
    /** Environment indicator */
    environmentLabel: '[data-testid="fake-login-environment"]',
  },

  // ========================================================================
  // Dashboard / Home Page
  // ========================================================================

  dashboard: {
    /** Dashboard container */
    container: '[data-testid="dashboard"]',
    /** Welcome message */
    welcome: '[data-testid="dashboard-welcome"]',
    /** Quick stats card */
    statsCard: '[data-testid="dashboard-stats"]',
    /** Recent activity section */
    recentActivity: '[data-testid="dashboard-recent-activity"]',
    /** Quick action buttons */
    quickActions: '[data-testid="dashboard-quick-actions"]',
  },

  // ========================================================================
  // Vårdhandelse (Care Event) Page & Search
  // ========================================================================

  vardhandelse: {
    /** Main page container */
    container: '[data-testid="vardhandelse-page"]',
    /** Page heading */
    heading: '[data-testid="vardhandelse-heading"]',

    search: {
      /** Search form container */
      form: '[data-testid="vardhandelse-search-form"]',
      /** Search input field */
      input: '[data-testid="vardhandelse-search-input"]',
      /** Date range from input */
      dateFrom: '[data-testid="vardhandelse-date-from"]',
      /** Date range to input */
      dateTo: '[data-testid="vardhandelse-date-to"]',
      /** Status filter */
      statusFilter: '[data-testid="vardhandelse-status-filter"]',
      /** Type filter */
      typeFilter: '[data-testid="vardhandelse-type-filter"]',
      /** Search button */
      button: '[data-testid="vardhandelse-search-button"]',
      /** Clear filters button */
      clearButton: '[data-testid="vardhandelse-clear-filters"]',
    },

    table: {
      /** Results table */
      container: '[data-testid="vardhandelse-table"]',
      /** Table header row */
      header: '[data-testid="vardhandelse-table-header"]',
      /** Table rows */
      rows: '[data-testid="vardhandelse-row"]',
      /** Table row by ID */
      rowById: (id: string) => `[data-testid="vardhandelse-row-${id}"]`,
      /** Cell: ID column */
      cellId: '[data-testid="vardhandelse-cell-id"]',
      /** Cell: Title column */
      cellTitle: '[data-testid="vardhandelse-cell-title"]',
      /** Cell: Date column */
      cellDate: '[data-testid="vardhandelse-cell-date"]',
      /** Cell: Status column */
      cellStatus: '[data-testid="vardhandelse-cell-status"]',
      /** Cell: Action buttons */
      cellActions: '[data-testid="vardhandelse-cell-actions"]',
    },

    detail: {
      /** Detail page container */
      container: '[data-testid="vardhandelse-detail"]',
      /** Page heading */
      heading: '[data-testid="vardhandelse-detail-heading"]',
      /** Back button */
      backButton: '[data-testid="vardhandelse-detail-back"]',
      /** Edit button */
      editButton: '[data-testid="vardhandelse-detail-edit"]',
      /** Close button */
      closeButton: '[data-testid="vardhandelse-detail-close"]',
      /** Title field */
      title: '[data-testid="vardhandelse-detail-title"]',
      /** Description field */
      description: '[data-testid="vardhandelse-detail-description"]',
      /** Start date field */
      startDate: '[data-testid="vardhandelse-detail-start-date"]',
      /** End date field */
      endDate: '[data-testid="vardhandelse-detail-end-date"]',
      /** Status field */
      status: '[data-testid="vardhandelse-detail-status"]',
    },
  },

  // ========================================================================
  // Vårdperiod (Care Period) Page & Search
  // ========================================================================

  vardperiod: {
    /** Main page container */
    container: '[data-testid="vardperiod-page"]',
    /** Page heading */
    heading: '[data-testid="vardperiod-heading"]',

    search: {
      /** Search form container */
      form: '[data-testid="vardperiod-search-form"]',
      /** Search input field */
      input: '[data-testid="vardperiod-search-input"]',
      /** Date range from input */
      dateFrom: '[data-testid="vardperiod-date-from"]',
      /** Date range to input */
      dateTo: '[data-testid="vardperiod-date-to"]',
      /** Status filter */
      statusFilter: '[data-testid="vardperiod-status-filter"]',
      /** Type filter */
      typeFilter: '[data-testid="vardperiod-type-filter"]',
      /** Care unit filter */
      careUnitFilter: '[data-testid="vardperiod-care-unit-filter"]',
      /** Search button */
      button: '[data-testid="vardperiod-search-button"]',
      /** Clear filters button */
      clearButton: '[data-testid="vardperiod-clear-filters"]',
    },

    table: {
      /** Results table */
      container: '[data-testid="vardperiod-table"]',
      /** Table header row */
      header: '[data-testid="vardperiod-table-header"]',
      /** Table rows */
      rows: '[data-testid="vardperiod-row"]',
      /** Table row by ID */
      rowById: (id: string) => `[data-testid="vardperiod-row-${id}"]`,
      /** Cell: ID column */
      cellId: '[data-testid="vardperiod-cell-id"]',
      /** Cell: Title column */
      cellTitle: '[data-testid="vardperiod-cell-title"]',
      /** Cell: Date column */
      cellDate: '[data-testid="vardperiod-cell-date"]',
      /** Cell: Status column */
      cellStatus: '[data-testid="vardperiod-cell-status"]',
      /** Cell: Care unit column */
      cellCareUnit: '[data-testid="vardperiod-cell-care-unit"]',
      /** Cell: Action buttons */
      cellActions: '[data-testid="vardperiod-cell-actions"]',
    },

    detail: {
      /** Detail page container */
      container: '[data-testid="vardperiod-detail"]',
      /** Page heading */
      heading: '[data-testid="vardperiod-detail-heading"]',
      /** Back button */
      backButton: '[data-testid="vardperiod-detail-back"]',
      /** Edit button */
      editButton: '[data-testid="vardperiod-detail-edit"]',
      /** Close button */
      closeButton: '[data-testid="vardperiod-detail-close"]',
      /** Title field */
      title: '[data-testid="vardperiod-detail-title"]',
      /** Description field */
      description: '[data-testid="vardperiod-detail-description"]',
      /** Start date field */
      startDate: '[data-testid="vardperiod-detail-start-date"]',
      /** End date field */
      endDate: '[data-testid="vardperiod-detail-end-date"]',
      /** Status field */
      status: '[data-testid="vardperiod-detail-status"]',
      /** Care unit field */
      careUnit: '[data-testid="vardperiod-detail-care-unit"]',
    },
  },

  // ========================================================================
  // Vantande (Waiting List) Page
  // ========================================================================

  vantande: {
    /** Main page container */
    container: '[data-testid="vantande-page"]',
    /** Page heading */
    heading: '[data-testid="vantande-heading"]',

    search: {
      /** Search form container */
      form: '[data-testid="vantande-search-form"]',
      /** Search input field */
      input: '[data-testid="vantande-search-input"]',
      /** Priority filter */
      priorityFilter: '[data-testid="vantande-priority-filter"]',
      /** Status filter */
      statusFilter: '[data-testid="vantande-status-filter"]',
      /** Search button */
      button: '[data-testid="vantande-search-button"]',
      /** Clear filters button */
      clearButton: '[data-testid="vantande-clear-filters"]',
    },

    table: {
      /** Results table */
      container: '[data-testid="vantande-table"]',
      /** Table rows */
      rows: '[data-testid="vantande-row"]',
      /** Table row by ID */
      rowById: (id: string) => `[data-testid="vantande-row-${id}"]`,
      /** Cell: Client name column */
      cellName: '[data-testid="vantande-cell-name"]',
      /** Cell: Priority column */
      cellPriority: '[data-testid="vantande-cell-priority"]',
      /** Cell: Status column */
      cellStatus: '[data-testid="vantande-cell-status"]',
      /** Cell: Date column */
      cellDate: '[data-testid="vantande-cell-date"]',
      /** Cell: Action buttons */
      cellActions: '[data-testid="vantande-cell-actions"]',
    },

    detail: {
      /** Detail/modal container */
      container: '[data-testid="vantande-detail"]',
      /** Close button */
      closeButton: '[data-testid="vantande-detail-close"]',
      /** Client info section */
      clientInfo: '[data-testid="vantande-detail-client-info"]',
      /** Priority section */
      priority: '[data-testid="vantande-detail-priority"]',
      /** Status section */
      status: '[data-testid="vantande-detail-status"]',
      /** Notes section */
      notes: '[data-testid="vantande-detail-notes"]',
    },
  },

  // ========================================================================
  // Klient (Client) Management
  // ========================================================================

  klient: {
    /** Main page container */
    container: '[data-testid="klient-page"]',
    /** Page heading */
    heading: '[data-testid="klient-heading"]',

    search: {
      /** Search form container */
      form: '[data-testid="klient-search-form"]',
      /** Search input (name/ID) */
      input: '[data-testid="klient-search-input"]',
      /** Personnummer search */
      personnummerInput: '[data-testid="klient-personnummer-input"]',
      /** Status filter */
      statusFilter: '[data-testid="klient-status-filter"]',
      /** Search button */
      button: '[data-testid="klient-search-button"]',
      /** Clear filters button */
      clearButton: '[data-testid="klient-clear-filters"]',
    },

    table: {
      /** Results table */
      container: '[data-testid="klient-table"]',
      /** Table rows */
      rows: '[data-testid="klient-row"]',
      /** Table row by ID */
      rowById: (id: string) => `[data-testid="klient-row-${id}"]`,
      /** Cell: Name column */
      cellName: '[data-testid="klient-cell-name"]',
      /** Cell: Personnummer column */
      cellPersonnummer: '[data-testid="klient-cell-personnummer"]',
      /** Cell: Status column */
      cellStatus: '[data-testid="klient-cell-status"]',
      /** Cell: Action buttons */
      cellActions: '[data-testid="klient-cell-actions"]',
    },

    detail: {
      /** Detail page container */
      container: '[data-testid="klient-detail"]',
      /** Page heading */
      heading: '[data-testid="klient-detail-heading"]',
      /** Back button */
      backButton: '[data-testid="klient-detail-back"]',
      /** Edit button */
      editButton: '[data-testid="klient-detail-edit"]',
      /** Name field */
      name: '[data-testid="klient-detail-name"]',
      /** Personnummer field */
      personnummer: '[data-testid="klient-detail-personnummer"]',
      /** Email field */
      email: '[data-testid="klient-detail-email"]',
      /** Phone field */
      phone: '[data-testid="klient-detail-phone"]',
      /** Address field */
      address: '[data-testid="klient-detail-address"]',
      /** City field */
      city: '[data-testid="klient-detail-city"]',
      /** Stop date field (inactivation) */
      stopDate: '[data-testid="klient-detail-stop-date"]',
      /** Status display */
      status: '[data-testid="klient-detail-status"]',
    },

    form: {
      /** Create/edit form container */
      container: '[data-testid="klient-form"]',
      /** Name input */
      nameInput: '[data-testid="klient-form-name"]',
      /** Personnummer input */
      personnummerInput: '[data-testid="klient-form-personnummer"]',
      /** Email input */
      emailInput: '[data-testid="klient-form-email"]',
      /** Phone input */
      phoneInput: '[data-testid="klient-form-phone"]',
      /** Address input */
      addressInput: '[data-testid="klient-form-address"]',
      /** City input */
      cityInput: '[data-testid="klient-form-city"]',
      /** Save button */
      saveButton: '[data-testid="klient-form-save"]',
      /** Cancel button */
      cancelButton: '[data-testid="klient-form-cancel"]',
    },
  },

  // ========================================================================
  // Administration Pages
  // ========================================================================

  administration: {
    /** Admin page container */
    container: '[data-testid="admin-page"]',
    /** Admin page heading */
    heading: '[data-testid="admin-heading"]',
    /** Admin menu/tabs */
    menu: '[data-testid="admin-menu"]',

    blacklist: {
      /** Blacklist page container */
      container: '[data-testid="admin-blacklist"]',
      /** Blacklist table */
      table: '[data-testid="blacklist-table"]',
      /** Blacklist rows */
      rows: '[data-testid="blacklist-row"]',
      /** Row by ID */
      rowById: (id: string) => `[data-testid="blacklist-row-${id}"]`,
      /** Add button */
      addButton: '[data-testid="blacklist-add-button"]',
      /** Delete button in row */
      deleteButton: '[data-testid="blacklist-delete-button"]',
      /** Search input */
      searchInput: '[data-testid="blacklist-search"]',
    },

    infotext: {
      /** Infotext page container */
      container: '[data-testid="admin-infotext"]',
      /** Infotext list */
      list: '[data-testid="infotext-list"]',
      /** Infotext items */
      items: '[data-testid="infotext-item"]',
      /** Item by ID */
      itemById: (id: string) => `[data-testid="infotext-item-${id}"]`,
      /** Edit button */
      editButton: '[data-testid="infotext-edit"]',
      /** Save button */
      saveButton: '[data-testid="infotext-save"]',
      /** Cancel button */
      cancelButton: '[data-testid="infotext-cancel"]',
      /** Text editor */
      editor: '[data-testid="infotext-editor"]',
    },

    retfil: {
      /** Retfil management page */
      container: '[data-testid="admin-retfil"]',
      /** Search input */
      searchInput: '[data-testid="retfil-search"]',
      /** Results table */
      table: '[data-testid="retfil-table"]',
      /** Table rows */
      rows: '[data-testid="retfil-row"]',
    },

    koder: {
      /** Codes/Koder management page */
      container: '[data-testid="admin-koder"]',
      /** Code type selector */
      typeSelector: '[data-testid="koder-type-selector"]',
      /** Codes table */
      table: '[data-testid="koder-table"]',
      /** Table rows */
      rows: '[data-testid="koder-row"]',
    },
  },

  // ========================================================================
  // Oversiktslogg (Overview Log / Audit Log)
  // ========================================================================

  oversiktslogg: {
    /** Main page container */
    container: '[data-testid="oversiktslogg-page"]',
    /** Page heading */
    heading: '[data-testid="oversiktslogg-heading"]',

    search: {
      /** Search form container */
      form: '[data-testid="oversiktslogg-search-form"]',
      /** Date from input */
      dateFrom: '[data-testid="oversiktslogg-date-from"]',
      /** Date to input */
      dateTo: '[data-testid="oversiktslogg-date-to"]',
      /** User filter */
      userFilter: '[data-testid="oversiktslogg-user-filter"]',
      /** Action filter */
      actionFilter: '[data-testid="oversiktslogg-action-filter"]',
      /** Search button */
      button: '[data-testid="oversiktslogg-search-button"]',
    },

    table: {
      /** Results table */
      container: '[data-testid="oversiktslogg-table"]',
      /** Table rows */
      rows: '[data-testid="oversiktslogg-row"]',
      /** Cell: Timestamp */
      cellTimestamp: '[data-testid="oversiktslogg-cell-timestamp"]',
      /** Cell: User */
      cellUser: '[data-testid="oversiktslogg-cell-user"]',
      /** Cell: Action */
      cellAction: '[data-testid="oversiktslogg-cell-action"]',
      /** Cell: Details */
      cellDetails: '[data-testid="oversiktslogg-cell-details"]',
    },
  },

  // ========================================================================
  // Inera IDS Design Components
  // ========================================================================

  ineraComponents: {
    /** IDS header component */
    header: 'ids-wc-header-inera-general',
    /** IDS button */
    button: 'ids-button',
    /** IDS input */
    input: 'ids-input',
    /** IDS text field */
    textField: 'ids-text-field',
    /** IDS date picker */
    datePicker: 'ids-date-picker',
    /** IDS dropdown/select */
    dropdown: 'ids-dropdown',
    /** IDS table */
    table: 'ids-table',
    /** IDS modal */
    modal: 'ids-modal',
    /** IDS alert */
    alert: 'ids-alert',
    /** IDS card */
    card: 'ids-card',
  },

  // ========================================================================
  // Test/Environment Specific
  // ========================================================================

  testEnvironment: {
    /** Local environment banner (yellow) */
    localBanner: '[data-testid="environment-banner-local"]',
    /** Test environment banner (orange) */
    testBanner: '[data-testid="environment-banner-test"]',
    /** Prod environment (no banner) */
    prodBanner: '[data-testid="environment-banner-prod"]',
  },
};

/**
 * Helper function to build dynamic selectors for rows/items by ID.
 *
 * @example
 * const selector = selectRowById('vardhandelse', 'VH-12345');
 */
export function selectRowById(feature: string, id: string): string {
  const featureSelectors = SELECTORS[feature as keyof typeof SELECTORS];
  if (featureSelectors && "table" in featureSelectors) {
    const tableSelectors = featureSelectors.table as { rowById: (id: string) => string };
    return tableSelectors.rowById(id);
  }
  throw new Error(`No rowById selector found for feature: ${feature}`);
}

/**
 * Helper function to get all action buttons for a specific element.
 *
 * @example
 * const actions = getActionButtons(page, SELECTORS.vardhandelse.table.cellActions);
 */
export function getActionButtonSelectors(cellActionsSelector: string): Record<string, string> {
  return {
    viewButton: `${cellActionsSelector} [data-testid*="view"]`,
    editButton: `${cellActionsSelector} [data-testid*="edit"]`,
    deleteButton: `${cellActionsSelector} [data-testid*="delete"]`,
    downloadButton: `${cellActionsSelector} [data-testid*="download"]`,
  };
}
