import TimeMarker from "@/models/time-marker";
import { Temporal } from "@js-temporal/polyfill";
import DateTimeFormatOptions from "../date-time-format-options";
import PositionTranslator from "../position-translator";
import TemporalRoundingExtension from "../time-depth/temporal-rounding-extension";
import Viewport from "../viewport/viewport";
import { useLookAtTime } from "@/store/store";

export class TimeMarkerCreator {
  private SECONDS_IN_NANOSECONDS = 1_000_000_000n;
  private eventTarget = new EventTarget();
  private positionTranslator = PositionTranslator.Instance;
  private viewport = Viewport.Instance;

  private constructor(private store = useLookAtTime()) { }
  /**
   * Calculate leftmost and rightmost date and place time markers in
   * between these dates at the given depth.
   *
   * All HTML elements are created separately in one large document
   * fragment for performance reasons.
   *
   * @param depth
   */
  public placeTimeMarkers(depth: Temporal.DurationLike): void {
    try {
      /**
       * Left side of the viewport plus additional margin to the left
       * to minimize elements popping in. Will be 0 if it would exceed
       * the left edge of the timeline.
       */
      const leftmostDate = new Temporal.ZonedDateTime(
        BigInt(
          this.positionTranslator.toDate(
            Math.max(0, this.store.timelineElement!.scrollLeft - 500)
          )
        ) * this.SECONDS_IN_NANOSECONDS,
        DateTimeFormatOptions.TIME_ZONE
      );

      /**
       * Same as leftmost but on the right
       */
      const rightmostDate = new Temporal.ZonedDateTime(
        BigInt(
          this.positionTranslator.toDate(
            Math.min(
              this.store.timelineElement!.scrollWidth,
              this.viewport.rightEdge() + 500
            )
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
        "trunc"
      );

      const timeMarkers = this.createTimeMarkerArray(
        leftmostDateAtTargetDepth,
        rightmostDateAtTargetDepth,
        depth
      );

      this.store.timeMarkers = timeMarkers;

      this.addHTMLElements(timeMarkers.flatMap(t => t.htmlElement));
    } catch (e) {
      console.log(
        "Traveler 🧑‍🚀, you can't go further out in time, yet. Come back to this place, later."
      );
    }

    this.eventTarget.dispatchEvent(new Event("time-marker-creation-end"));
  }

  private addHTMLElements(elements: HTMLElement[]) {
    const documentFragment = document.createDocumentFragment();
    for (let i = 0; i < elements.length; i++) {
      documentFragment.appendChild(elements[i]);
    }

    this.store.timelineElement!
      .querySelector("#time-marker-area")
      ?.appendChild(documentFragment);
  }

  /**
   * Builds and returns an array of time markers that contains
   * all time markers between the leftmost and rightmost date at
   * the given depth.
   */
  private createTimeMarkerArray(
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

  private static instance: TimeMarkerCreator;

  public static get Instance(): TimeMarkerCreator {
    return this.instance || (this.instance = new this());
  }
}
