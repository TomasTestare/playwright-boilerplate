import { TestInfo } from "@playwright/test";

/**
 * Add Xray test key annotation to link test with Jira test case
 * @param testInfo - Playwright TestInfo object
 * @param key - Jira test case key (e.g., 'PROJ-123')
 */
export function addTestKey(testInfo: TestInfo, key: string) {
  testInfo.annotations.push({ type: "test_key", description: key });
}

/**
 * Add test description annotation for Xray
 * @param testInfo - Playwright TestInfo object
 * @param description - Test description
 */
export function addTestDescription(testInfo: TestInfo, description: string) {
  testInfo.annotations.push({ type: "test_description", description });
}

/**
 * Add requirement key annotation to link test with Jira requirement
 * @param testInfo - Playwright TestInfo object
 * @param key - Jira requirement key (e.g., 'PROJ-456')
 */
export function addRequirementKey(testInfo: TestInfo, key: string) {
  testInfo.annotations.push({ type: "requirement_key", description: key });
}

/**
 * Add test summary annotation for Xray
 * @param testInfo - Playwright TestInfo object
 * @param summary - Test summary
 */
export function addTestSummary(testInfo: TestInfo, summary: string) {
  testInfo.annotations.push({ type: "test_summary", description: summary });
}
