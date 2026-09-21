import { readCSV, CsvRow } from "./csvReader";
import * as path from "path";

/**
 * Generic CSV-backed test data helper.
 * Loads a CSV once, then lets you read whole columns or a random value.
 * Replace `data/example.csv` and column names with your own.
 */
export const TestData = {
  rows: <CsvRow[]>[],

  /** Loads the example CSV. Call once before reading values. */
  async initialize(file = "../../data/example.csv"): Promise<void> {
    this.rows = await readCSV(path.resolve(__dirname, file));
  },

  /** Returns all values for a given column. */
  column(name: string): string[] {
    return this.rows.map((row) => row[name]).filter(Boolean);
  },

  /** Returns a random value from a given column. */
  random(name: string): string {
    const values = this.column(name);
    if (values.length === 0) throw new Error(`No data for column: ${name}`);
    return values[Math.floor(Math.random() * values.length)];
  },
};
