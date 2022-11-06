import DateTimeFormatOptions from "@/timeline/date-time-format-options";
import { Temporal } from "@js-temporal/polyfill";

export default class TemporalConversion {
  public static plainTime(epochSeconds: number): string {
    return Temporal.Instant.fromEpochSeconds(epochSeconds)
      .toZonedDateTimeISO(DateTimeFormatOptions.TIME_ZONE)
      .toPlainTime()
      .toString();
  }

  /**
   * Converts the given seconds into a `PlainDate` with the
   * default `TIME_ZONE` and ISO calendar and returns it
   * as a string.
   */
  public static plainDate(epochSeconds: number): string {
    return Temporal.Instant.fromEpochSeconds(epochSeconds)
      .toZonedDateTimeISO(DateTimeFormatOptions.TIME_ZONE)
      .toPlainDate()
      .toString();
  }

  /**
   * Converts existing date into a ZonedDateTime and changes date to `plainDate` and time to `plainTime`.
   */
  public static epochSeconds(
    plainDate: string,
    plainTime: string | null
  ): number {
    const date = Temporal.Instant.from(
      `${plainDate}T${plainTime ? plainTime : "00:00:00"}+0000`
    ).epochSeconds;
    return date;
  }
}
