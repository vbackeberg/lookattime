import store from "@/store/store";
import { Temporal } from "@js-temporal/polyfill";
import SpaceObserver from "../space-management/space-observer";
import { Constants } from "../zooming/constants";
import { TimeMarkerCreator } from "./time-marker-creator";
import TimeMarkerRemover from "./time-marker-remover";

export default class TimeMarkerDepthObserver {
  // [zoom level, (representing hours, half hours, minutes, seconds,etc.)]
  private zoomLevelMarkerDepthTranslation = Array<
    [number, Temporal.DurationLike]
  >(
    [100000, { years: 100 }],
    [10000, { years: 10 }],
    [5000, { years: 1 }],
    [1000, { months: 1 }],
    // TODO: Add weeks:
    // If using 7 day intervals, we need to place the markers
    // on the right days (mondays).
    [300, { days: 1 }],
    [70, { hours: 6 }],
    [1, { hours: 1 }],
    [Constants.MIN_ZOOM_LEVEL, { minutes: 1 }]
  );

  /**
   * When a new zoom level is emitted, time markers should be added to
   * or removed from the timeline.
   */
  public observe() {
    TimeMarkerRemover.removeAllMarkers();

    console.log(`store.state.zoomLevel: ${store.state.zoomLevel}`);

    // May be undefined if not found. (The list is not complete, yet.)
    const depth = this.zoomLevelMarkerDepthTranslation.find(
      // TODO: do not recalculate if depth has not changed.
      tuple => tuple[0] <= store.state.zoomLevel
    );

    if (depth) {
      TimeMarkerCreator.placeTimeMarkers(depth[1]);
    }
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
