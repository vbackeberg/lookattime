// Pre-define which date granularity to show at which zoom level.

import TimeMarker from "@/models/time-marker";
import store from "@/store/store";
import { Temporal } from "@js-temporal/polyfill";
import PositionTranslator from "../position-translator";
import Viewport from "../viewport/viewport";
import { Constants } from "../zooming/constants";
import TemporalRoundingExtension, {
  DateRoundingUnit
} from "./temporal-rounding-extension";

// const zoomLevelToDateGranularity = new Map<number, string>();

// zoomLevelToDateGranularity.set(key, value);

/* SECONDS left edge
 * find first date corresponding to granularity.
 * examples:
 * left edge = 12123123
 * field = "seconds"
 * granularity = 120
 * instant of (12123123) round to seconds
 *
 *
 */

/* DAYS left edge
 * find first date corresponding to granularity.
 * examples:
 * left edge = 12123123
 * field = "days"
 * granularity = 1
 * instant of (12123123) round to day
 *
 */

/* YEARS left edge
 * find first date corresponding to granularity.
 * examples:
 * left edge = 12123123
 * field = "years"
 * granularity = 1
 * instant of (12123123) round to years
 *
 */

// new Temporal.PlainDateTime(2020, 1, 1, 0, 0, 0).round("day");
// new Temporal.PlainDateTime(2020, 1, 1, 0, 0, 0).toPlainYearMonth();
// new Temporal.PlainDateTime(2020, 1, 1, 0, 0, 0).year;

export class Ti {
  private static SECONDS_IN_NANOSECONDS = 1000000000n;

  public static placeTimeMarkers(granularity: string) {
    const leftmostDate = new Temporal.ZonedDateTime(
      BigInt(PositionTranslator.toDate(0)) * this.SECONDS_IN_NANOSECONDS,
      Constants.TIME_ZONE
    );

    const leftmostDateAtTargetGranularity = TemporalRoundingExtension.round(
      leftmostDate,
      store.state.zoomLevel
    );
  }

  public static setMarkersHalfHours() {
    const left = PositionTranslator.toDate(0);
    const leftAsInstant = Temporal.Instant.fromEpochSeconds(left);
    const leftAsDateTime = leftAsInstant.toZonedDateTimeISO(
      Constants.TIME_ZONE
    );
    let leftmostHour = leftAsDateTime.round({
      smallestUnit: "hour",
      roundingMode: "trunc"
    });

    const right = PositionTranslator.toDate(Viewport.rightEdge());
    const rightAsInstant = Temporal.Instant.fromEpochSeconds(right);
    const rightAsDateTime = rightAsInstant.toZonedDateTimeISO(
      Constants.TIME_ZONE
    );

    const rightmostHour = rightAsDateTime.round({
      smallestUnit: "hour",
      roundingMode: "ceil"
    });

    const timeMarkers = [];

    while (Temporal.ZonedDateTime.compare(leftmostHour, rightmostHour) <= 0) {
      console.log("hour: " + leftmostHour.hour);
      const instant = leftmostHour.toInstant().epochSeconds;
      timeMarkers.push(
        new TimeMarker(
          PositionTranslator.toAbsolutePosition(instant),
          instant.toString(),
          instant,
          1
        )
      );
      leftmostHour = leftmostHour.add(Temporal.Duration.from({ minutes: 30 }));
    }

    console.log("zl translation set markers: ");
    timeMarkers.forEach(marker => console.log(marker));
    store.state.timeMarkers = timeMarkers;
  }

  public static setMarkersHours() {
    const left = PositionTranslator.toDate(0);
    const leftAsInstant = Temporal.Instant.fromEpochSeconds(left);
    const leftAsDateTime = leftAsInstant.toZonedDateTimeISO(
      Constants.TIME_ZONE
    );
    let leftmostHour = leftAsDateTime.round({
      smallestUnit: "hour",
      roundingMode: "trunc"
    });

    const right = PositionTranslator.toDate(Viewport.rightEdge());
    const rightAsInstant = Temporal.Instant.fromEpochSeconds(right);
    const rightAsDateTime = rightAsInstant.toZonedDateTimeISO(
      Constants.TIME_ZONE
    );

    const rightmostHour = rightAsDateTime.round({
      smallestUnit: "hour",
      roundingMode: "ceil"
    });

    const timeMarkers = [];

    while (Temporal.ZonedDateTime.compare(leftmostHour, rightmostHour) <= 0) {
      console.log("hour: " + leftmostHour.hour);
      const instant = leftmostHour.toInstant().epochSeconds;
      timeMarkers.push(
        new TimeMarker(
          PositionTranslator.toAbsolutePosition(instant),
          instant.toString(),
          instant,
          1
        )
      );
      leftmostHour = leftmostHour.add(Temporal.Duration.from({ hours: 1 }));
    }

    console.log("zl translation set markers: ");
    timeMarkers.forEach(marker => console.log(marker));
    store.state.timeMarkers = timeMarkers;
  }

  public static createMarkerArrayForDays(): TimeMarker[] {
    const left = PositionTranslator.toDate(0);
    const leftAsInstant = Temporal.Instant.fromEpochSeconds(left);
    const leftAsDateTime = leftAsInstant.toZonedDateTimeISO(
      Constants.TIME_ZONE
    );
    let leftmostDay = leftAsDateTime.round({
      smallestUnit: "day",
      roundingMode: "trunc"
    });

    const right = PositionTranslator.toDate(Viewport.rightEdge());
    const rightAsInstant = Temporal.Instant.fromEpochSeconds(right);
    const rightAsDateTime = rightAsInstant.toZonedDateTimeISO(
      Constants.TIME_ZONE
    );

    const rightmostDay = rightAsDateTime.round({
      smallestUnit: "day",
      roundingMode: "ceil"
    });

    const timeMarkers = [];

    while (Temporal.ZonedDateTime.compare(leftmostDay, rightmostDay) <= 0) {
      console.log("days: " + leftmostDay);
      const instant = leftmostDay.toInstant().epochSeconds;
      timeMarkers.push(
        new TimeMarker(
          PositionTranslator.toAbsolutePosition(instant),
          instant.toString(),
          instant,
          1
        )
      );
      leftmostDay = leftmostDay.add(Temporal.Duration.from({ days: 1 }));
    }

    return timeMarkers;
  }

  public static createMarkerArrayMonths(): TimeMarker[] {
    const left = PositionTranslator.toDate(0);
    const leftAsInstant = Temporal.Instant.fromEpochSeconds(left);
    const leftAsDateTime = leftAsInstant.toZonedDateTimeISO(
      Constants.TIME_ZONE
    );
    let leftmostMonth = Temporal.ZonedDateTime.from({
      ...leftAsDateTime,
      day: 1
    }).round({ smallestUnit: "day", roundingMode: "trunc" });

    const right = PositionTranslator.toDate(Viewport.rightEdge());
    const rightAsInstant = Temporal.Instant.fromEpochSeconds(right);
    const rightAsDateTime = rightAsInstant.toZonedDateTimeISO(
      Constants.TIME_ZONE
    );

    const rightmostMonth = Temporal.ZonedDateTime.from({
      ...rightAsDateTime,
      day: 1
    })
      .round({ smallestUnit: "day", roundingMode: "trunc" })
      .add(Temporal.Duration.from({ months: 1 }));

    const timeMarkers = [];

    while (Temporal.ZonedDateTime.compare(leftmostMonth, rightmostMonth) <= 0) {
      console.log("month: " + leftmostMonth);
      const instant = leftmostMonth.toInstant().epochSeconds;
      timeMarkers.push(
        new TimeMarker(
          PositionTranslator.toAbsolutePosition(instant),
          instant.toString(),
          instant,
          1
        )
      );
      leftmostMonth = leftmostMonth.add(Temporal.Duration.from({ months: 1 }));
    }

    return timeMarkers;
  }
}
