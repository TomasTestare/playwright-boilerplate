import type { FullConfig } from "@playwright/test";

/**
 * The starter deliberately performs no navigation or authentication.
 * Projects may add an explicit, documented setup after completing the project
 * configuration contract and confirming the approved authentication flow.
 */
async function globalSetup(_config: FullConfig): Promise<void> {
  return Promise.resolve();
}

export default globalSetup;
