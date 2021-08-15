import store from "@/store/store";
import Viewport from "../viewport/viewport-right";

/**
 * Cuts expendable space on the left by given distance. Takes care of removing animations during position shifting.
 */
export default class SpaceCutter {
  public static cutLeftSpace(
    timelineElement: HTMLElement,
    distance: number
  ) {
    const elements = document.getElementsByClassName("zoomable");
    for (const element of elements) {
      element.classList.remove("zoom-transition");
    }

    this.repositionSpacerLeft(distance);
    this.repositionSpacerRight(distance);
    this.repositionTimeEvents(distance);
    this.repositionTimeMarkers(distance);

    store.state.timelineZero -= distance;

    timelineElement.scrollBy(-distance, 0);

    this.repositionSpacerViewportRight();

    for (const element of elements) {
      element.classList.add("zoom-transition");
    }
  }

  private static repositionSpacerLeft(distance: number) {
    store.state.spacerLeft.positionLeft -= distance;
  }

  private static repositionTimeEvents(distance: number) {
    for (let i = 0; i < store.state.timeEvents.length; i++) {
      store.state.timeEvents[i].positionCenter -= distance;
    }
  }

  private static repositionTimeMarkers(distance: number) {
    for (let i = 0; i < store.state.timeMarkers.length; i++) {
      store.state.timeMarkers[i].positionCenter -= distance;
    }
  }

  private static repositionSpacerRight(distance: number) {
    store.state.spacerRight.positionLeft -= distance;
  }

  private static repositionSpacerViewportRight() {
    store.state.spacerViewportRight.positionLeft =
      Viewport.rightEdge() - store.state.spacerViewportRight.width;
  }
}
