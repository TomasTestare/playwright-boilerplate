/**
 * Lightweight console logger. Set LOG_LEVEL=debug to enable debug output.
 */
export const Logger = {
  /** Logs a debug message only when LOG_LEVEL=debug. */
  debug(message: string): void {
    if (process.env.LOG_LEVEL === "debug") {
      console.log(`[DEBUG] [${new Date().toISOString()}] ${message}`);
    }
  },

  /** Logs an informational message. */
  info(message: string): void {
    console.log(`[INFO] [${new Date().toISOString()}] ${message}`);
  },

  /**
   * Logs a warning message.
   * @param message - The warning message to log.
   */
  warn(message: string): void {
    console.warn(`[WARN] [${new Date().toISOString()}] ${message}`);
  },

  /**
   * Logs an error message.
   * @param message - The error message to log.
   * @param error - The error object (optional).
   */
  error(message: string, error?: unknown): void {
    console.error(`[ERROR] [${new Date().toISOString()}] ${message}`);
    if (error) {
      console.error(error);
    }
  },
};
