import { CDPSession, Page } from "@playwright/test";

export interface NetworkConditions {
  offline: boolean;
  downloadThroughput: number;
  uploadThroughput: number;
  latency: number;
}

/**
 * Predefined network profiles matching Chrome DevTools.
 * Used to simulate different network conditions in tests.
 */
export const NetworkProfiles = {
  /** No network */
  offline: {
    offline: true,
    downloadThroughput: 0,
    uploadThroughput: 0,
    latency: 0,
  },
  /** Slow 3G: 400 Kbps, 2000ms latency */
  slow3G: {
    offline: false,
    downloadThroughput: (400 * 1024) / 8,
    uploadThroughput: (400 * 1024) / 8,
    latency: 2000,
  },
  /** Fast 3G: 1.6 Mbps down, 750 Kbps up, ~563ms latency */
  fast3G: {
    offline: false,
    downloadThroughput: (1.6 * 1024 * 1024) / 8,
    uploadThroughput: (750 * 1024) / 8,
    latency: 562.5,
  },
  /** Slow 4G: 4 Mbps down, 3 Mbps up, 20ms latency */
  slow4G: {
    offline: false,
    downloadThroughput: (4 * 1024 * 1024) / 8,
    uploadThroughput: (3 * 1024 * 1024) / 8,
    latency: 20,
  },
} as const;

export type NetworkProfileName = keyof typeof NetworkProfiles;

/**
 * Helper class for managing network simulation via the Chrome DevTools Protocol.
 * Works only with Chromium-based browsers (Chrome, Edge).
 */
export class NetworkThrottler {
  private cdpSession: CDPSession | null = null;
  private page: Page;
  private isActive = false;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Enables network simulation with the given profile.
   * @param profile - Name of a predefined profile or custom NetworkConditions
   */
  async enable(profile: NetworkProfileName | NetworkConditions): Promise<void> {
    if (!this.cdpSession) {
      this.cdpSession = await this.page.context().newCDPSession(this.page);
    }

    const conditions = typeof profile === "string" ? NetworkProfiles[profile] : profile;

    await this.cdpSession.send("Network.emulateNetworkConditions", conditions);
    this.isActive = true;
  }

  /**
   * Disables network simulation and restores normal conditions.
   */
  async disable(): Promise<void> {
    if (!this.cdpSession) return;

    await this.cdpSession.send("Network.emulateNetworkConditions", {
      offline: false,
      downloadThroughput: -1,
      uploadThroughput: -1,
      latency: 0,
    });
    this.isActive = false;
  }

  /**
   * Returns whether network simulation is active.
   */
  get active(): boolean {
    return this.isActive;
  }

  /**
   * Closes the CDP session. Called automatically when the fixture tears down.
   */
  async close(): Promise<void> {
    if (this.isActive) {
      await this.disable();
    }
    if (this.cdpSession) {
      await this.cdpSession.detach();
      this.cdpSession = null;
    }
  }
}
