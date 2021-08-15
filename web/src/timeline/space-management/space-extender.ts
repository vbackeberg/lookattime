import store from "@/store/store";

/**
 * Extends space to the left by given distance. Takes care of removing animations during position shifting.
 */
export default class SpaceExtender {
  public static async extendLeftSpace(
    timelineElement: HTMLElement,
    distance: number
  ) {
    const elements = document.getElementsByClassName("zoomable");
    for (const element of elements) {
      element.classList.remove("zoom-transition");
    }

    this.repositionSpacerLeft(distance);
    this.repositionSpacerRight(distance);
    this.repositionSpacerPageEdge(distance, timelineElement);
    this.repositionTimeEvents(distance);
    this.repositionTimeMarkers(distance);

    store.state.timelineZero += distance;

    timelineElement.scrollBy(distance, 0);

    for (const element of elements) {
      element.classList.add("zoom-transition");
    }
  }

  private static repositionSpacerLeft(distance: number) {
    store.state.spacerLeft.positionLeft += distance;
  }

  private static repositionSpacerRight(distance: number) {
    store.state.spacerRight.positionLeft += distance;
  }

  private static repositionSpacerPageEdge(
    distance: number,
    timelineElement: HTMLElement
  ) {
    store.state.spacerPageEdge.positionLeft =
      timelineElement.scrollWidth + distance - store.state.spacerPageEdge.width;
  }

  private static repositionTimeEvents(distance: number) {
    for (let i = 0; i < store.state.timeEvents.length; i++) {
      store.state.timeEvents[i].positionCenter += distance;
    }
  }

  private static repositionTimeMarkers(distance: number) {
    for (let i = 0; i < store.state.timeMarkers.length; i++) {
      store.state.timeMarkers[i].positionCenter += distance;
    }
  }
}
