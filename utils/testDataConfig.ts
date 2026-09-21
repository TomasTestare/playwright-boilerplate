import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";

import type { GvrEnhet } from "./gvrTestConfig";

export interface TestDataProfile {
  bffUrl: string;
  servicesUrl: string;
  webUser: string;
  defaultPatientId: string;
  patientIdPrefix: string;
  enhet: GvrEnhet;
  transferTargetEnhet: GvrEnhet;
  initialDiagnosGrupp: string;
  kontaktdatum: string;
  legacyPeriodStart: string;
  inskrivningTime: string;
  besokTime: string;
  flyttTime: string;
  flyttSearchStart: string;
  apiDefaults: {
    inskrivningKod: string;
    besokTyp: string;
    vardgivare: string[];
    taxa: string;
    avtal: string;
    utskrivningKod: string;
    vardperiodSystem: string;
    kontakt: string;
    patientKategori: string;
    dubbelDiagnosBer: string;
    dubbelDiagnosPer: string;
    slutDiagnosGrupp: string;
  };
}

interface TestDataFile {
  [environment: string]: unknown;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requireString(value: unknown, name: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Invalid test data: "${name}" must be a non-empty string`);
  }
  return value;
}

function requireEnhet(value: unknown, name: string): GvrEnhet {
  if (!isRecord(value)) {
    throw new Error(`Invalid test data: "${name}" must be an object`);
  }

  return {
    inr: requireString(value.inr, `${name}.inr`),
    klin: requireString(value.klin, `${name}.klin`),
    avd: requireString(value.avd, `${name}.avd`),
    hsaId: requireString(value.hsaId, `${name}.hsaId`),
  };
}

function parseProfile(value: unknown, environment: string): TestDataProfile {
  if (!isRecord(value)) {
    throw new Error(`Invalid test data: environment "${environment}" must be an object`);
  }

  const patientIdPrefix = requireString(value.patientIdPrefix, "patientIdPrefix");
  if (!/^\d{8}$/.test(patientIdPrefix)) {
    throw new Error('Invalid test data: "patientIdPrefix" must contain exactly 8 digits');
  }

  if (!isRecord(value.apiDefaults)) {
    throw new Error('Invalid test data: "apiDefaults" must be an object');
  }

  const vardgivare = value.apiDefaults.vardgivare;
  if (!Array.isArray(vardgivare) || vardgivare.some((item) => typeof item !== "string" || item.trim() === "")) {
    throw new Error('Invalid test data: "apiDefaults.vardgivare" must be a non-empty string array');
  }

  return {
    bffUrl: requireString(value.bffUrl, "bffUrl"),
    servicesUrl: requireString(value.servicesUrl, "servicesUrl"),
    webUser: requireString(value.webUser, "webUser"),
    defaultPatientId: requireString(value.defaultPatientId, "defaultPatientId"),
    patientIdPrefix,
    enhet: requireEnhet(value.enhet, "enhet"),
    transferTargetEnhet: requireEnhet(value.transferTargetEnhet, "transferTargetEnhet"),
    initialDiagnosGrupp: requireString(value.initialDiagnosGrupp, "initialDiagnosGrupp"),
    kontaktdatum: requireString(value.kontaktdatum, "kontaktdatum"),
    legacyPeriodStart: requireString(value.legacyPeriodStart, "legacyPeriodStart"),
    inskrivningTime: requireString(value.inskrivningTime, "inskrivningTime"),
    besokTime: requireString(value.besokTime, "besokTime"),
    flyttTime: requireString(value.flyttTime, "flyttTime"),
    flyttSearchStart: requireString(value.flyttSearchStart, "flyttSearchStart"),
    apiDefaults: {
      inskrivningKod: requireString(value.apiDefaults.inskrivningKod, "apiDefaults.inskrivningKod"),
      besokTyp: requireString(value.apiDefaults.besokTyp, "apiDefaults.besokTyp"),
      vardgivare,
      taxa: requireString(value.apiDefaults.taxa, "apiDefaults.taxa"),
      avtal: requireString(value.apiDefaults.avtal, "apiDefaults.avtal"),
      utskrivningKod: requireString(value.apiDefaults.utskrivningKod, "apiDefaults.utskrivningKod"),
      vardperiodSystem: requireString(value.apiDefaults.vardperiodSystem, "apiDefaults.vardperiodSystem"),
      kontakt: requireString(value.apiDefaults.kontakt, "apiDefaults.kontakt"),
      patientKategori: requireString(value.apiDefaults.patientKategori, "apiDefaults.patientKategori"),
      dubbelDiagnosBer: requireString(value.apiDefaults.dubbelDiagnosBer, "apiDefaults.dubbelDiagnosBer"),
      dubbelDiagnosPer: requireString(value.apiDefaults.dubbelDiagnosPer, "apiDefaults.dubbelDiagnosPer"),
      slutDiagnosGrupp: requireString(value.apiDefaults.slutDiagnosGrupp, "apiDefaults.slutDiagnosGrupp"),
    },
  };
}

export function loadTestData(): TestDataProfile {
  const environment = process.env.GVR_TEST_ENV || "dev";
  const configuredFile = process.env.GVR_TEST_DATA_FILE;
  const filePath = configuredFile ? resolve(process.cwd(), configuredFile) : join(process.cwd(), "data", "test-data.json");

  let file: TestDataFile;
  try {
    file = JSON.parse(readFileSync(filePath, "utf8")) as TestDataFile;
  } catch (error) {
    throw new Error(`Unable to load test data file "${filePath}": ${error instanceof Error ? error.message : String(error)}`);
  }

  if (!(environment in file)) {
    throw new Error(`No test data environment "${environment}" found in "${filePath}"`);
  }

  return parseProfile(file[environment], environment);
}
