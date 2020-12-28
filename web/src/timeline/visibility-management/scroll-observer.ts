import store from "@/store";
import TimeEventHider from "./time-event-hider";
import TimeMarkerHider from "./time-marker-hider";

/**
 * Observes scroll events, determines viewport boundaries and calls element hiders.
 */
export default class ScrollObserver {
  private timelineElement: HTMLElement;
  private constructor() {
    this.timelineElement = document.getElementById("timeline") as HTMLElement;
    this.timelineElement.addEventListener("scroll", () => {

      const viewportLeftEdge = this.timelineElement.scrollLeft;
      const viewportRightEdge =
        viewportLeftEdge + this.timelineElement.clientWidth;

      if (store.state.timeMarkers.length > 0) {
        TimeMarkerHider.changeTimeMarkerVisibility(
          viewportLeftEdge,
          viewportRightEdge
        );
      }

      if (store.state.timeEvents.length > 0) {
        TimeEventHider.changeTimeEventVisibility(
          viewportLeftEdge,
          viewportRightEdge
        );
      }
    });
  }

  private static instance: ScrollObserver;
  public static get Instance() {
    return this.instance || (this.instance = new this());
  }
}
