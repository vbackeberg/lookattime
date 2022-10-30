import store from "@/store/store";
import { Temporal } from "@js-temporal/polyfill";
import SpaceObserver from "../space-management/space-observer";
import { Constants } from "../zooming/constants";
import { TimeMarkerCreator } from "./time-marker-creator";
import TimeMarkerRemover from "./time-marker-remover";

/**
 * A function converting the date to a string representation
 * that is adequate for the given depth.
 *
 * E.g. 12:00 for "hours" or 06-24 for "days".
 */
type DateStringConversion = {
  (_: Temporal.Instant): string;
};

export default class TimeMarkerDepthObserver {
  // [zoom level, (representing hours, half hours, minutes, seconds,etc.)]
  public static zoomLevelToDepth = Array<
    [number, Temporal.DurationLike, DateStringConversion]
  >(
    [
      5000000,
      { years: 100 },
      (date: Temporal.Instant) =>
        date.toZonedDateTimeISO(Constants.TIME_ZONE).year.toString()
    ],
    [
      300000,
      { years: 10 },
      (date: Temporal.Instant) =>
        date.toZonedDateTimeISO(Constants.TIME_ZONE).year.toString()
    ],
    [
      20000,
      { years: 1 },
      (date: Temporal.Instant) =>
        date.toZonedDateTimeISO(Constants.TIME_ZONE).year.toString()
    ],
    [
      1000,
      { months: 1 },
      (date: Temporal.Instant) =>
        date
          .toZonedDateTimeISO(Constants.TIME_ZONE)
          .toPlainYearMonth()
          .toString()
    ],
    // TODO: Add weeks:
    // Use `weekOfYear` maybe
    [
      300,
      { days: 1 },
      (date: Temporal.Instant) =>
        date
          .toZonedDateTimeISO(Constants.TIME_ZONE)
          .toPlainMonthDay()
          .toString()
    ],
    [
      70,
      { hours: 6 },
      (date: Temporal.Instant) =>
        date
          .toZonedDateTimeISO(Constants.TIME_ZONE)
          .toPlainTime()
          .toString({ smallestUnit: "minutes" })
    ],
    [
      1,
      { hours: 1 },
      (date: Temporal.Instant) =>
        date
          .toZonedDateTimeISO(Constants.TIME_ZONE)
          .toPlainTime()
          .toString({ smallestUnit: "minutes" })
    ],
    [
      Constants.MIN_ZOOM_LEVEL,
      { minutes: 1 },
      (date: Temporal.Instant) =>
        date
          .toZonedDateTimeISO(Constants.TIME_ZONE)
          .toPlainTime()
          .toString()
    ]
  );

  public static currentDepth: [
    number,
    Temporal.DurationLike,
    { (_: Temporal.Instant): string }
  ] = TimeMarkerDepthObserver.zoomLevelToDepth[0];

  /**
   * When a new zoom level is emitted, time markers should be added to
   * or removed from the timeline.
   */
  public observe() {
    TimeMarkerRemover.removeAllMarkers();

    console.log(`store.state.zoomLevel: ${store.state.zoomLevel}`);

    // May be undefined if not found. (The list is not complete, yet.)
    TimeMarkerDepthObserver.currentDepth =
      TimeMarkerDepthObserver.zoomLevelToDepth.find(
        // TODO: do not recalculate if depth has not changed.
        tuple => tuple[0] <= store.state.zoomLevel
      ) ?? TimeMarkerDepthObserver.zoomLevelToDepth[0];

    TimeMarkerCreator.placeTimeMarkers(TimeMarkerDepthObserver.currentDepth[1]);
  }

  constructor() {
    SpaceObserver.Instance.eventTarget.addEventListener(
      "space-management-end",
      () => {
        this.observe();
      }
    );
  }

  private static instance: TimeMarkerDepthObserver;

  public static get Instance(): TimeMarkerDepthObserver {
    return this.instance || (this.instance = new this());
  }
}
