import TimeMarker from "@/models/time-marker";
import store from "@/store/store";
import { Temporal } from "@js-temporal/polyfill";
import PositionTranslator from "../position-translator";
import { Constants } from "../zooming/constants";
import TemporalRoundingExtension from "./temporal-rounding-extension";

export class TimeMarkerCreator {
  private static SECONDS_IN_NANOSECONDS = 1000000000n;

  public static placeTimeMarkers(depth: Temporal.DurationLike) {
    const leftmostDate = new Temporal.ZonedDateTime(
      BigInt(PositionTranslator.toDate(0)) * this.SECONDS_IN_NANOSECONDS,
      Constants.TIME_ZONE
    );
    console.log(`rounding left date: ${leftmostDate}`);

    const r =
      BigInt(
        PositionTranslator.toDate(
          Math.trunc(store.state.spacerRight.positionLeft) +
            store.state.spacerRight.width
        )
      ) * this.SECONDS_IN_NANOSECONDS;
    const rightmostDate = new Temporal.ZonedDateTime(r, Constants.TIME_ZONE);

    console.log(`rounding right date: ${rightmostDate}`);

    console.log(`rounding to depth: ${JSON.stringify(depth)}`);

    const leftmostDateAtTargetDepth = TemporalRoundingExtension.round(
      leftmostDate,
      depth,
      "trunc"
    );
    console.log(`left rounded date: ${leftmostDateAtTargetDepth}`);

    const rightmostDateAtTargetDepth = TemporalRoundingExtension.round(
      rightmostDate,
      depth,
      "ceil"
    );
    console.log(`right rounded date: ${rightmostDateAtTargetDepth}`);

    const timeMarkers = this.createTimeMarkerArray(
      leftmostDateAtTargetDepth,
      rightmostDateAtTargetDepth,
      depth
    );

    store.state.timeMarkers = timeMarkers;

    this.addHTMLElements(timeMarkers.flatMap(t => t.htmlElement));
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
    const timeMarkers = [];
    let i = dateLeft;

    while (Temporal.ZonedDateTime.compare(i, dateRight) === -1) {
      timeMarkers.push(new TimeMarker(i.epochSeconds));
      i = i.add(depth);
    }
    timeMarkers.push(new TimeMarker(dateRight.epochSeconds));
    return timeMarkers;
  }
}
