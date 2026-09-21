import { parse } from "csv-parse";
import * as fs from "fs";

/**
 * A single CSV row keyed by column name. Adjust columns to match your file.
 */
export interface CsvRow {
  [column: string]: string;
}

/**
 * Reads a tab-delimited CSV file into an array of row objects.
 * @param filePath - Path to the CSV file.
 * @param delimiter - Column delimiter (defaults to tab).
 */
export const readCSV = (filePath: string, delimiter = "\t"): Promise<CsvRow[]> => {
  return new Promise((resolve, reject) => {
    const results: CsvRow[] = [];
    fs.createReadStream(filePath)
      .pipe(parse({ columns: true, delimiter }))
      .on("data", (row) => results.push(row as CsvRow))
      .on("end", () => resolve(results))
      .on("error", reject);
  });
};
