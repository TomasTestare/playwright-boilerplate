import date from "date-and-time";

/**
 * Utility class for date-related operations.
 */
export class DateUtils {
  /**
   * Gets today's date in YYYY-MM-DD format.
   * @returns A string representing today's date.
   */
  getTodaysDate(): string {
    const now = new Date();
    return date.format(now, "YYYY-MM-DD");
  }

  /**
   * Gets the last day of the next month in YYYY-MM-DD format.
   * @returns A string representing the last day of the next month.
   */
  getNextMonthsLastDay(): string {
    const now = new Date();
    // Set the date to the first day of the next month
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    // Set the date to the last day of that month by going back one day from the next month's first day
    const lastDayOfNextMonth = new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 0);
    return date.format(lastDayOfNextMonth, "YYYY-MM-DD");
  }

  /**
   * Gets yesterday's date in YYYY-MM-DD format.
   * @returns A string representing yesterday's date.
   */
  getYesterdaysDate(): string {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    return date.format(yesterday, "YYYY-MM-DD");
  }

  getThreeMonthsAgo(): string {
    const now = new Date();
    const threeMonthsAgo = new Date(now);
    threeMonthsAgo.setMonth(now.getMonth() - 3);
    return date.format(threeMonthsAgo, "YYYY-MM-DD");
  }
}
