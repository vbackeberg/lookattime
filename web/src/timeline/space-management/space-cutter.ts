import store from "@/store/store";

/**
 * Cuts expendable space on the left by given distance. Takes care of removing animations during position shifting.
 */
export default class SpaceCutter {
  public static async cutLeftSpace(
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
    this.repositionTimerMarkers(distance);

    store.state.timelineZero -= distance;

    timelineElement.scrollBy(-distance, 0);

    this.repositionSpacerPageEdge(timelineElement);

    for (const element of elements) {
      element.classList.add("zoom-transition");
    }
  }

  private static repositionSpacerLeft(distance: number) {
    store.state.spacerLeft.positionLeft -= distance;

    store.state.spacerLeft.htmlElement.style.transform =
      "translateX(" + store.state.spacerLeft.positionLeft + "px)";
  }

  private static repositionTimeEvents(distance: number) {
    for (let i = 0; i < store.state.timeEvents.length; i++) {
      store.state.timeEvents[i].positionCenter -= distance;
      store.state.timeEvents[i].htmlElement.style.transform =
        "translateX(" + store.state.timeEvents[i].positionCenter + "px)";
    }
  }

  private static repositionTimerMarkers(distance: number) {
    store.state.timeMarkers.forEach(timeMarker => {
      timeMarker.positionCenter -= distance;

      if (timeMarker.htmlElement) {
        timeMarker.htmlElement.style.transform =
          "translateX(" + timeMarker.positionCenter + "px)";
      }
    });
  }

  private static repositionSpacerRight(distance: number) {
    store.state.spacerRight.positionLeft -= distance;

    store.state.spacerRight.htmlElement.style.transform =
      "translateX(" + store.state.spacerRight.positionLeft + "px)";
  }

  private static repositionSpacerPageEdge(timelineElement: HTMLElement) {
    const newPositionLeft =
      timelineElement.scrollWidth - store.state.spacerPageEdge.width;

    store.state.spacerPageEdge.htmlElement.style.transform =
      "translateX(" + newPositionLeft + "px)";
  }
}
