import TimeMarker from "@/models/time-marker";
import store from "@/store/store";
import { Temporal } from "@js-temporal/polyfill";
import DateTimeFormatOptions from "../date-time-format-options";
import PositionTranslator from "../position-translator";
import TemporalRoundingExtension from "../time-depth/temporal-rounding-extension";

export class TimeMarkerCreator {
  private static SECONDS_IN_NANOSECONDS = 1000000000n;
  public static eventTarget = new EventTarget();

  public static placeTimeMarkers(depth: Temporal.DurationLike): void {
    try {
      const leftmostDate = new Temporal.ZonedDateTime(
        BigInt(
          PositionTranslator.toDate(store.state.timelineElement.scrollLeft)
        ) * this.SECONDS_IN_NANOSECONDS,
        DateTimeFormatOptions.TIME_ZONE
      );

      const rightmostDate = new Temporal.ZonedDateTime(
        BigInt(
          PositionTranslator.toDate(
            store.state.spacerViewportRight.positionLeft +
              store.state.spacerViewportRight.width
          )
        ) * this.SECONDS_IN_NANOSECONDS,
        DateTimeFormatOptions.TIME_ZONE
      );

      const leftmostDateAtTargetDepth = TemporalRoundingExtension.round(
        leftmostDate,
        depth,
        "trunc"
      );

      const rightmostDateAtTargetDepth = TemporalRoundingExtension.round(
        rightmostDate,
        depth,
        "ceil"
      );

      const timeMarkers = this.createTimeMarkerArray(
        leftmostDateAtTargetDepth,
        rightmostDateAtTargetDepth,
        depth
      );

      store.state.timeMarkers = timeMarkers;

      this.addHTMLElements(timeMarkers.flatMap(t => t.htmlElement));
    } catch (e) {
      console.log(
        "Traveler 🧑‍🚀, you can't go further out in time, yet. Come back to this place, later."
      );
    }

    this.eventTarget.dispatchEvent(new Event("time-marker-creation-end"));
  }

  private static addHTMLElements(elements: HTMLElement[]) {
    const documentFragment = document.createDocumentFragment();
    for (let i = 0; i < elements.length; i++) {
      documentFragment.appendChild(elements[i]);
    }

    store.state.timelineElement
      .querySelector("#time-marker-area")
      ?.appendChild(documentFragment);
  }

  /**
   * Builds and returns an array of time markers that contains
   * all time markers between the leftmost and rightmost date at
   * the given depth.
   */
  private static createTimeMarkerArray(
    dateLeft: Temporal.ZonedDateTime,
    dateRight: Temporal.ZonedDateTime,
    depth: Temporal.DurationLike
  ): TimeMarker[] {
    const timeMarkers = [] as TimeMarker[];

    while (Temporal.ZonedDateTime.compare(dateLeft, dateRight) === -1) {
      timeMarkers.push(new TimeMarker(dateLeft.epochSeconds));
      dateLeft = dateLeft.add(depth);
    }
    timeMarkers.push(new TimeMarker(dateRight.epochSeconds));
    return timeMarkers;
  }
}
