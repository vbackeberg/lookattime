import store from "@/store/store";
import TimeDepth from "../time-depth/time-depth";
import { TimeMarkerCreator } from "./time-marker-creator";
import TimeMarkerRemover from "./time-marker-remover";

/**
 * Triggers the recreation of time markers whenever the
 * viewport or zoom changes such that only elements that
 * are on screen are rendered. This allows keeping the
 * performance stable.
 */
export default class TimeMarkerRecreationTrigger {
  private timelineElement: HTMLElement;
  private scrollEndTimer: number | undefined;

  constructor() {
    this.timelineElement = store.state.timelineElement;
    this.observe();
  }

  /**
   * Observes the scroll event which gets emitted when the
   * user zooms or scrolls along the timeline and then
   * triggers recreation of time markers.
   *
   * This event is debounced by 100 ms.
   */
  private observe() {
    this.timelineElement.addEventListener("scroll", () => {
      clearTimeout(this.scrollEndTimer);
      this.scrollEndTimer = setTimeout(this.recreateTimeMarkers, 100);
    });
  }

  /**
   * Triggers removal of all time markers and re-creation of new
   * ones within the changed viewport.
   */
  private recreateTimeMarkers = () => {
    TimeMarkerRemover.removeAllMarkers();

    TimeDepth.currentDepth = this.getNewDepth();

    TimeMarkerCreator.placeTimeMarkers(TimeDepth.currentDepth[1]);

    store.state.timeMarkers.forEach(timeMarker => {
      timeMarker.htmlElement.classList.add("zoom-transition");
    });
  };

  /**
   * First depth to be lower or equal current zoom level.
   * Assumes translation table to be sorted from highest to lowest
   * zoom level.
   */
  private getNewDepth() {
    return (
      TimeDepth.zoomLevelToDepthTranslation.find(
        tuple => tuple[0] <= store.state.zoomLevel
      ) ?? TimeDepth.zoomLevelToDepthTranslation[0]
    );
  }

  private static instance: TimeMarkerRecreationTrigger;

  public static get Instance(): TimeMarkerRecreationTrigger {
    return this.instance || (this.instance = new this());
  }
}
