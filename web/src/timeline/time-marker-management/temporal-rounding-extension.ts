import { Temporal } from "@js-temporal/polyfill";

export default class TemporalRoundingExtension {
  private static depthForRoundingTimeUnit = [
    "hour",
    "minute",
    "second",
    "millisecond",
    "microsecond",
    "nanosecond"
  ];

  private static depthForRoundingHalfTimeUnits = new Map<string, string>([
    ["half-hour", "minute"],
    ["half-minute", "second"]
  ]);

  private static depthForRoundingDateUnit = new Map<string, string>([
    ["year", "month"],
    ["month", "day"]
  ]);

  public static round(
    date: Temporal.ZonedDateTime,
    depth: string,
    roundingMode: "trunc" | "ceil"
  ) {
    if (roundingMode === "trunc") return this.roundTrunc(date, depth);
    else return this.roundCeil(date, depth);
  }

  public static roundTrunc(
    date: Temporal.ZonedDateTime,
    depth: string
  ): Temporal.ZonedDateTime {
    if (this.depthForRoundingTimeUnit.includes(depth)) {
      return date.round({
        smallestUnit: depth as Temporal.SmallestUnit<Temporal.TimeUnit>,
        roundingMode: "trunc"
      });
    }

    const halfTimeUnitValue = this.depthForRoundingHalfTimeUnits.get(depth);

    if (halfTimeUnitValue) {
      return date.round({
        smallestUnit: halfTimeUnitValue as Temporal.SmallestUnit<Temporal.TimeUnit>,
        roundingMode: "trunc",
        roundingIncrement: 30
      });
    }

    const dateValue = this.depthForRoundingDateUnit.get(depth);

    if (dateValue) {
      return Temporal.ZonedDateTime.from({
        ...date,
        [dateValue]: 1
      });
    }

    throw new Error(`Unsupported depth: ${depth}`);
  }

  static roundCeil(date: Temporal.ZonedDateTime, depth: string) {}
}
