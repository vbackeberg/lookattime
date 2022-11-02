import { Temporal } from "@js-temporal/polyfill";

/**
 * The application-wide calendar and time zone we use for all dates.
 */
export default class DateTimeFormatOptions {
  public static TIME_ZONE = "UTC";
  public static CALENDAR = new Temporal.ZonedDateTime(0n, this.TIME_ZONE)
    .calendar;
}
