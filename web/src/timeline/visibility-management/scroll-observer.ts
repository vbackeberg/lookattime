import store from "@/store";
import TimeEventHider from "./time-event-hider";
import TimeMarkerHider from "./time-marker-hider";

/**
 * Observes scroll events to hide all time markers outside of the viewport.
 */
export default class ScrollObserver {
  private timelineElement: HTMLElement;
  private constructor() {
    this.timelineElement = document.getElementById("timeline") as HTMLElement;
    this.timelineElement.addEventListener("scroll", () => {
      console.log("------------------------------------------------------");

      const viewportLeftEdge = this.timelineElement.scrollLeft;
      const viewportRightEdge =
        viewportLeftEdge + this.timelineElement.clientWidth;

      console.log(
        "viewport from " + viewportLeftEdge + " to " + viewportRightEdge
      );

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
