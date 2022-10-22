import { Temporal } from "@js-temporal/polyfill";
import { Constants } from "../zooming/constants";

export default class TemporalRoundingExtension {
  private static timeUnits = [
    "days",
    "hours",
    "minutes",
    "seconds",
    "milliseconds",
    "microseconds",
    "nanoseconds"
  ];

  /**
   * Rounding works differently depending on the time unit.
   *
   *
   * @param date
   * @param depth
   * @param roundingMode
   * @returns
   */
  public static round(
    date: Temporal.ZonedDateTime,
    depth: Temporal.DurationLike,
    roundingMode: "trunc" | "ceil"
  ): Temporal.ZonedDateTime {
    if (this.timeUnits.includes(Object.keys(depth)[0])) {
      return date.round({
        smallestUnit: Object.keys(depth)[0] as Temporal.SmallestUnit<
          Temporal.TimeUnit
        >,
        roundingIncrement: Object.values(depth)[0],
        roundingMode: roundingMode
      });
    }

    // Rounding date units

    // TODO: For rounding date units there is redundancy. It might be resolved
    // by referring to the Object key here, too, but it's unclear how
    // to determine which properties to set in the object created in from({}).

    if ("months" in depth) {
      if (roundingMode === "trunc") {
        return Temporal.ZonedDateTime.from({
          timeZone: Constants.TIME_ZONE,
          year: date.year,
          month: date.month,
          day: 1
        });
      } else {
        return Temporal.ZonedDateTime.from({
          timeZone: Constants.TIME_ZONE,
          year: date.year,
          month: date.month,
          day: 1
        }).add({ months: 1 });
      }
    }

    // TODO: Round to decades, centuries and so on.

    if ("years" in depth) {
      if (roundingMode === "trunc") {
        return Temporal.ZonedDateTime.from({
          timeZone: Constants.TIME_ZONE,
          year: date.year,
          month: 1,
          day: 1
        });
      } else {
        return Temporal.ZonedDateTime.from({
          timeZone: Constants.TIME_ZONE,
          year: date.year,
          month: 1,
          day: 1
        }).add({ years: 1 });
      }
    }

    // const halfTimeUnitValue = this.depthForRoundingHalfTimeUnits.get(depth);

    // if (halfTimeUnitValue) {
    //   return date.round({
    //     smallestUnit: halfTimeUnitValue as Temporal.SmallestUnit<
    //       Temporal.TimeUnit
    //     >,
    //     roundingMode: roundingMode,
    //     roundingIncrement: 30
    //   });
    // }

    throw new Error(`Unsupported depth: ${depth}`);
  }
}
