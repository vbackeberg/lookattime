import store from "@/store/store";
import SpaceObserver from "../space-management/space-observer";
import TimeDepth from "../time-depth/time-depth";
import { TimeMarkerCreator } from "./time-marker-creator";
import TimeMarkerRemover from "./time-marker-remover";

export default class TimeMarkerDepthObserver {
  /**
   * When a new zoom level is emitted, time markers should be added to
   * or removed from the timeline.
   */
  public observe() {
    TimeMarkerRemover.removeAllMarkers();

    console.log(`store.state.zoomLevel: ${store.state.zoomLevel}`);

    // May be undefined if not found. (The list is not complete, yet.)
    TimeDepth.currentDepth =
      TimeDepth.zoomLevelToDepthTranslation.find(
        // TODO: do not recalculate if depth has not changed.
        tuple => tuple[0] <= store.state.zoomLevel
      ) ?? TimeDepth.zoomLevelToDepthTranslation[0];

    TimeMarkerCreator.placeTimeMarkers(TimeDepth.currentDepth[1]);
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
