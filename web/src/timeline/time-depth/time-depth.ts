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
    // Obsolete, since outside of supported date range for Temporal.
    // [
    //   90_000_000_000,
    //   { years: 1_000_000 },
    //   (date: Temporal.Instant) =>
    //     date.toZonedDateTimeISO(DateTimeFormatOptions.TIME_ZONE).year.toString()
    // ],
    // [
    //   25_000_000_000,
    //   { years: 500_000 },
    //   (date: Temporal.Instant) =>
    //     date.toZonedDateTimeISO(DateTimeFormatOptions.TIME_ZONE).year.toString()
    // ],
    [
      9_000_000_000,
      { years: 100_000 },
      (date: Temporal.Instant) =>
        date.toZonedDateTimeISO(DateTimeFormatOptions.TIME_ZONE).year.toString()
    ],
    [
      2_500_000_000,
      { years: 50_000 },
      (date: Temporal.Instant) =>
        date.toZonedDateTimeISO(DateTimeFormatOptions.TIME_ZONE).year.toString()
    ],
    [
      900_000_000,
      { years: 10000 },
      (date: Temporal.Instant) =>
        date.toZonedDateTimeISO(DateTimeFormatOptions.TIME_ZONE).year.toString()
    ],
    [
      250_000_000,
      { years: 5000 },
      (date: Temporal.Instant) =>
        date.toZonedDateTimeISO(DateTimeFormatOptions.TIME_ZONE).year.toString()
    ],
    [
      90_000_000,
      { years: 1000 },
      (date: Temporal.Instant) =>
        date.toZonedDateTimeISO(DateTimeFormatOptions.TIME_ZONE).year.toString()
    ],
    [
      25_000_000,
      { years: 500 },
      (date: Temporal.Instant) =>
        date.toZonedDateTimeISO(DateTimeFormatOptions.TIME_ZONE).year.toString()
    ],
    [
      9_000_000,
      { years: 100 },
      (date: Temporal.Instant) =>
        date.toZonedDateTimeISO(DateTimeFormatOptions.TIME_ZONE).year.toString()
    ],
    [
      2_500_000,
      { years: 50 },
      (date: Temporal.Instant) =>
        date.toZonedDateTimeISO(DateTimeFormatOptions.TIME_ZONE).year.toString()
    ],
    [
      900_000,
      { years: 10 },
      (date: Temporal.Instant) =>
        date.toZonedDateTimeISO(DateTimeFormatOptions.TIME_ZONE).year.toString()
    ],
    [
      200_000,
      { years: 5 },
      (date: Temporal.Instant) =>
        date.toZonedDateTimeISO(DateTimeFormatOptions.TIME_ZONE).year.toString()
    ],
    [
      20_000,
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
