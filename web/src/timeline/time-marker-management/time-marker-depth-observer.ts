import store from "@/store/store";
import { Temporal } from "@js-temporal/polyfill";
import SpaceObserver from "../space-management/space-observer";
import { Constants } from "../zooming/constants";
import { TimeMarkerCreator } from "./time-marker-creator";

export default class TimeMarkerDepthObserver {
  // [zoom level, (representing hours, half hours, minutes, seconds,etc.)]
  private zoomLevelMarkerDepthTranslation = Array<
    [number, Temporal.DurationLike]
  >(
    [Constants.MAX_ZOOM_LEVEL, { years: 100 }],
    [100000, { years: 10 }],
    [5000, { years: 1 }],
    [2000, { months: 1 }],
    // TODO: Add weeks:
    // If using 7 day intervals, we need to place the markers
    // on the right days (mondays).
    [700, { days: 1 }],
    [90, { hours: 12 }],
    [30, { hours: 6 }],
    [10, { hours: 1 }],
    [Constants.MIN_ZOOM_LEVEL, { minutes: 1 }]
  );

  /**
   * When a new zoom level is emitted, time markers should be added to
   * or removed from the timeline.
   */
  public observe() {
    this.removeAllMarkers();

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

  /**
   * First removes the HTML element of each marker, then removes the
   * marker itself.
   */
  public removeAllMarkers() {
    store.state.timeMarkers.forEach(marker => {
      marker.htmlElement.remove();
    });

    store.state.timeMarkers = [];
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
