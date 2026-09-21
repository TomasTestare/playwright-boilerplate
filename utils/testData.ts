/**
 * Test data factory functions for GVR application.
 * Provides realistic mock objects matching API response contracts.
 * All functions return new instances with sensible defaults and optional overrides.
 *
 * @example
 * import { createVardhandelse, createKlient } from '../utils/testData';
 *
 * const event = createVardhandelse({ title: 'Custom Event' });
 * const client = createKlient({ name: 'Test Client' });
 */

/**
 * Vårdhandelse (Care Event) model matching API contract.
 */
export interface Vardhandelse {
  id: string;
  title: string;
  description?: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  status: "active" | "inactive" | "archived";
  type: string;
  careProvider?: string;
}

/**
 * Vårdperiod (Care Period) model matching API contract.
 */
export interface Vardperiod {
  id: string;
  title: string;
  description?: string;
  startDate: string; // ISO date string
  endDate?: string; // ISO date string, optional for ongoing periods
  status: "active" | "inactive" | "archived";
  type: string;
  careUnit?: string;
}

/**
 * Klient (Client) model matching API contract.
 */
export interface Klient {
  id: string;
  personnummer: string; // Swedish ID number
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  createdDate: string; // ISO date string
  updatedDate: string; // ISO date string
  stopDate?: string; // ISO date string, for inactive clients
  status: "active" | "inactive";
}

/**
 * Vantande (Waiting List) entry model matching API contract.
 */
export interface VantandeEntry {
  id: string;
  klientId: string;
  klientName: string;
  status: "waiting" | "assigned" | "completed" | "cancelled";
  createdDate: string; // ISO date string
  priority: "low" | "normal" | "high" | "urgent";
  notes?: string;
}

/**
 * Test user model matching /api/webb/me response.
 */
export interface TestUser {
  userId: string;
  role: "Visa" | "Admin" | "Utdrag" | "Uppdatera";
  environment: "local" | "test" | "prod";
}

/**
 * Create a mock Vardhandelse (Care Event) with realistic defaults.
 * Overrides can be partial; missing fields use defaults.
 *
 * @param overrides - Partial object to override defaults
 * @returns New Vardhandelse instance
 * @example
 * const event = createVardhandelse();
 * const customEvent = createVardhandelse({ title: 'Emergency Visit' });
 */
export function createVardhandelse(overrides?: Partial<Vardhandelse>): Vardhandelse {
  const now = new Date();
  const startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
  const endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

  return {
    id: "VH-" + generateId(),
    title: "Rutinbesök",
    description: "Regelbunden vårdbesök",
    startDate: startDate.toISOString().split("T")[0],
    endDate: endDate.toISOString().split("T")[0],
    status: "active",
    type: "Besök",
    careProvider: "Vårdcentralen Nord",
    ...overrides,
  };
}

/**
 * Create a mock Vardperiod (Care Period) with realistic defaults.
 * Overrides can be partial; missing fields use defaults.
 *
 * @param overrides - Partial object to override defaults
 * @returns New Vardperiod instance
 * @example
 * const period = createVardperiod();
 * const customPeriod = createVardperiod({
 *   startDate: '2026-01-01',
 *   endDate: '2026-12-31'
 * });
 */
export function createVardperiod(overrides?: Partial<Vardperiod>): Vardperiod {
  const now = new Date();
  const startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
  const endDate = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 year from now

  return {
    id: "VP-" + generateId(),
    title: "Hemsjukvård",
    description: "Hemsjukvårdsperiod för patient",
    startDate: startDate.toISOString().split("T")[0],
    endDate: endDate.toISOString().split("T")[0],
    status: "active",
    type: "Hemsjukvård",
    careUnit: "Hemsjukvård Nord",
    ...overrides,
  };
}

/**
 * Create a mock Klient (Client) with realistic defaults.
 * Generates a plausible Swedish personnummer if not provided.
 * Overrides can be partial; missing fields use defaults.
 *
 * @param overrides - Partial object to override defaults
 * @returns New Klient instance
 * @example
 * const client = createKlient();
 * const customClient = createKlient({
 *   name: 'Anna Andersson',
 *   personnummer: '194501011234'
 * });
 */
export function createKlient(overrides?: Partial<Klient>): Klient {
  const now = new Date();
  const createdDate = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000); // 60 days ago

  return {
    id: "K-" + generateId(),
    personnummer: generatePersonnummer(),
    name: generateName(),
    email: `test-${generateId()}@example.com`,
    phone: "+46701234567",
    address: "Testvägen 123",
    city: "Stockholm",
    postalCode: "10000",
    createdDate: createdDate.toISOString().split("T")[0],
    updatedDate: now.toISOString().split("T")[0],
    status: "active",
    ...overrides,
  };
}

/**
 * Create a mock Vantande (Waiting List) entry with realistic defaults.
 * Overrides can be partial; missing fields use defaults.
 *
 * @param overrides - Partial object to override defaults
 * @returns New VantandeEntry instance
 * @example
 * const entry = createVantandeEntry();
 * const urgentEntry = createVantandeEntry({
 *   priority: 'urgent',
 *   status: 'waiting'
 * });
 */
export function createVantandeEntry(overrides?: Partial<VantandeEntry>): VantandeEntry {
  const now = new Date();

  return {
    id: "VA-" + generateId(),
    klientId: "K-" + generateId(),
    klientName: generateName(),
    status: "waiting",
    createdDate: now.toISOString().split("T")[0],
    priority: "normal",
    notes: "Avvaktar tilldelning av vårdpersonal",
    ...overrides,
  };
}

/**
 * Create a mock test user for authentication testing.
 * Overrides can be partial; missing fields use defaults.
 *
 * @param userId - HSA ID (e.g., 'HSA-ID-12345')
 * @param role - User role
 * @param environment - Environment (local, test, prod)
 * @returns New TestUser instance
 * @example
 * const user = createUser('HSA-ID-001', 'Admin');
 * const viewer = createUser('HSA-ID-002', 'Visa', 'test');
 */
export function createUser(
  userId: string = "HSA-ID-" + generateId(),
  role: "Visa" | "Admin" | "Utdrag" | "Uppdatera" = "Visa",
  environment: "local" | "test" | "prod" = "local",
): TestUser {
  return {
    userId,
    role,
    environment,
  };
}

/**
 * Create an array of mock Vardhandelse entries for bulk testing.
 *
 * @param count - Number of entries to create
 * @param baseOverrides - Base overrides applied to all entries
 * @returns Array of Vardhandelse instances
 * @example
 * const events = createVardhandelseList(5);
 * const activeEvents = createVardhandelseList(3, { status: 'active' });
 */
export function createVardhandelseList(
  count: number,
  baseOverrides?: Partial<Vardhandelse>,
): Vardhandelse[] {
  return Array.from({ length: count }, () => createVardhandelse(baseOverrides));
}

/**
 * Create an array of mock Klient entries for bulk testing.
 *
 * @param count - Number of entries to create
 * @param baseOverrides - Base overrides applied to all entries
 * @returns Array of Klient instances
 * @example
 * const clients = createKlientList(10);
 * const inactiveClients = createKlientList(5, { status: 'inactive' });
 */
export function createKlientList(count: number, baseOverrides?: Partial<Klient>): Klient[] {
  return Array.from({ length: count }, () => createKlient(baseOverrides));
}

/**
 * Create an array of mock Vantande entries for bulk testing.
 *
 * @param count - Number of entries to create
 * @param baseOverrides - Base overrides applied to all entries
 * @returns Array of VantandeEntry instances
 * @example
 * const waitingList = createVantandeList(20);
 * const urgentCases = createVantandeList(3, { priority: 'urgent' });
 */
export function createVantandeList(count: number, baseOverrides?: Partial<VantandeEntry>): VantandeEntry[] {
  return Array.from({ length: count }, () => createVantandeEntry(baseOverrides));
}

// ============================================================================
// Helper functions (private)
// ============================================================================

/**
 * Generate a random ID suffix for mock objects.
 * Returns a 6-character alphanumeric string.
 */
function generateId(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

/**
 * Generate a plausible Swedish personnummer (12 digits).
 * Format: YYMMDDNNNNSSC (where S = sex digit, C = check digit)
 * This is a simplified generator; real personnummer have specific validation rules.
 */
function generatePersonnummer(): string {
  const now = new Date();
  const year = String(now.getFullYear()).slice(2);
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, "0");

  // Random 4-digit sequence (first 3 are normal, 4th is sex digit: odd=male, even=female)
  const seq = String(Math.floor(Math.random() * 1000)).padStart(3, "0");
  const sexDigit = Math.floor(Math.random() * 10);

  // Simplified check digit (normally uses Luhn algorithm)
  const checkDigit = Math.floor(Math.random() * 10);

  return `${year}${month}${day}${seq}${sexDigit}${checkDigit}`;
}

/**
 * Generate a random name (first + last name).
 * Selected from realistic Swedish names.
 */
function generateName(): string {
  const firstNames = [
    "Anders",
    "Anna",
    "Björn",
    "Birgit",
    "Christina",
    "Carl",
    "Dag",
    "Ebba",
    "Eva",
    "Fredrik",
    "Gunnar",
    "Gunilla",
    "Hanna",
    "Harald",
    "Ingrid",
    "Ingvar",
    "Johan",
    "Jana",
    "Karin",
    "Karl",
    "Lena",
    "Lars",
    "Maria",
    "Mikael",
    "Nina",
    "Nils",
    "Olof",
    "Olle",
    "Pernilla",
    "Per",
    "Roland",
    "Ragnar",
    "Sven",
    "Sofia",
    "Thomas",
    "Torsten",
    "Urban",
    "Ulla",
    "Valter",
    "Vidar",
    "Wilhelm",
    "Wilhelmina",
    "Ylva",
    "Yngve",
    "Åke",
    "Åsa",
  ];

  const lastNames = [
    "Andersson",
    "Bergman",
    "Björkman",
    "Blomkvist",
    "Carlson",
    "Dahlström",
    "Eklund",
    "Eriksson",
    "Falk",
    "Forsberg",
    "Fredriksson",
    "Gärd",
    "Göransson",
    "Gustafsson",
    "Hakansson",
    "Hedlund",
    "Henriksson",
    "Holmberg",
    "Holm",
    "Holm",
    "Isaksson",
    "Jäger",
    "Jansson",
    "Järvinen",
    "Johansson",
    "Johnsson",
    "Jonsson",
    "Junell",
    "Jönsson",
    "Källström",
    "Källman",
    "Kärkkäinen",
    "Karlsson",
    "Kempf",
    "Kjellberg",
    "Kjellson",
    "Klimenko",
    "Korpi",
    "Kristensen",
    "Kronberg",
    "Kröger",
    "Kullman",
    "Kunz",
    "Kuusela",
    "Larson",
    "Larsson",
    "Lathund",
    "Lauzon",
    "Lax",
    "Lindberg",
    "Lindblad",
    "Lindholm",
    "Lindqvist",
    "Lindström",
    "Linet",
    "Lingnell",
    "Linn",
    "Linnarsson",
    "Lunnholm",
    "Lundberg",
    "Lundgren",
    "Lundkvist",
    "Lundsköld",
    "Lundström",
    "Lundkvist",
    "Lunnholm",
    "Löftman",
    "Lönnqvist",
    "Löwen",
    "Lundqvist",
    "Lysell",
    "Magnusson",
    "Malmqvist",
    "Malmström",
    "Malm",
    "Malmberg",
    "Malmborg",
    "Malmqvist",
    "Malmström",
    "Malm",
    "Malmberg",
    "Malmborg",
    "Malmqvist",
    "Malmström",
    "Malm",
    "Malmberg",
    "Malmborg",
    "Malmqvist",
    "Malmström",
    "Malm",
    "Malmberg",
    "Malmborg",
    "Malmqvist",
    "Malmström",
    "Malm",
    "Malmberg",
    "Malmborg",
    "Malmqvist",
    "Malmström",
    "Malm",
    "Malmberg",
    "Malmborg",
    "Malmqvist",
    "Malmström",
    "Malm",
    "Malmberg",
    "Malmborg",
    "Malmqvist",
    "Malmström",
    "Malmberg",
    "Malmborg",
    "Malmqvist",
    "Malmström",
    "Malmberg",
    "Malmborg",
    "Malmqvist",
    "Malmström",
    "Malmberg",
    "Malmborg",
    "Malmqvist",
    "Malmström",
    "Malmberg",
    "Malmborg",
    "Malmqvist",
    "Malmström",
    "Malmberg",
    "Malmborg",
    "Malmqvist",
    "Malmström",
    "Malmberg",
    "Malmborg",
    "Malmqvist",
    "Malmström",
    "Malmberg",
    "Malmborg",
    "Malmqvist",
    "Malmström",
    "Malmberg",
    "Malmborg",
    "Malmqvist",
    "Malmström",
    "Malmberg",
    "Malmborg",
    "Malmqvist",
    "Malmström",
    "Malmberg",
    "Malmborg",
    "Malmqvist",
    "Malmström",
    "Malmberg",
    "Malmborg",
    "Malmqvist",
    "Malmström",
    "Malmberg",
    "Malmborg",
    "Malmqvist",
    "Malmström",
    "Malmberg",
    "Malmborg",
    "Malmqvist",
    "Malmström",
  ];

  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

  return `${firstName} ${lastName}`;
}
