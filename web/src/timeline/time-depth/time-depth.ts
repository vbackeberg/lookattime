import { LOCALE } from "@/localization/locale";
import { Temporal } from "@js-temporal/polyfill";
import DateTimeFormatOptions from "../date-time-format-options";
import { Constants } from "../zooming/constants";

/**
 * A function converting the date to a string representation
 * that is adequate for the given depth.
 *
 * E.g. 12:00 for "hours" or 06-24 for "days".
 */
type DateStringConversion = {
  (_: Temporal.Instant): string;
};

export default class TimeDepth {
  public static zoomLevelToDepthTranslation = Array<
    [number, Temporal.DurationLike, DateStringConversion]
  >(
    [
      5000000,
      { years: 100 },
      (date: Temporal.Instant) =>
        date.toZonedDateTimeISO(DateTimeFormatOptions.TIME_ZONE).year.toString()
    ],
    [
      300000,
      { years: 10 },
      (date: Temporal.Instant) =>
        date.toZonedDateTimeISO(DateTimeFormatOptions.TIME_ZONE).year.toString()
    ],
    [
      20000,
      { years: 1 },
      (date: Temporal.Instant) =>
        date.toZonedDateTimeISO(DateTimeFormatOptions.TIME_ZONE).year.toString()
    ],
    [
      1000,
      { months: 1 },
      (date: Temporal.Instant) =>
        date
          .toZonedDateTimeISO(DateTimeFormatOptions.TIME_ZONE)
          .toPlainYearMonth()
          .toString()
    ],
    // TODO: Add weeks:
    // Use `weekOfYear` maybe
    [
      300,
      { days: 1 },
      (date: Temporal.Instant) => {
        return date
          .toZonedDateTimeISO(DateTimeFormatOptions.TIME_ZONE)
          .toPlainMonthDay()
          .toLocaleString(LOCALE, {
            calendar: DateTimeFormatOptions.CALENDAR
          });
      }
    ],
    [
      70,
      { hours: 6 },
      (date: Temporal.Instant) =>
        date
          .toZonedDateTimeISO(DateTimeFormatOptions.TIME_ZONE)
          .toPlainTime()
          .toString({ smallestUnit: "minutes" })
    ],
    [
      1,
      { hours: 1 },
      (date: Temporal.Instant) =>
        date
          .toZonedDateTimeISO(DateTimeFormatOptions.TIME_ZONE)
          .toPlainTime()
          .toString({ smallestUnit: "minutes" })
    ],
    [
      Constants.MIN_ZOOM_LEVEL,
      { minutes: 1 },
      (date: Temporal.Instant) =>
        date
          .toZonedDateTimeISO(DateTimeFormatOptions.TIME_ZONE)
          .toPlainTime()
          .toString()
    ]
  );

  public static currentDepth: [
    number,
    Temporal.DurationLike,
    { (_: Temporal.Instant): string }
  ] = TimeDepth.zoomLevelToDepthTranslation[0];
}
