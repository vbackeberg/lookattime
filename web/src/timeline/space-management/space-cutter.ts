import TimeEventModel from "@/models/time-event-model";
import store from "@/store/store";
import Vue from "vue";

/**
 * Cuts expendable space on the left by given distance. Takes care of removing animations during position shifting.
 */
export default class SpaceCutter {
  //TODO: Use store timeline element
  public static async cutLeftSpace(
    timelineElement: HTMLElement,
    distance: number
  ) {
    const elements = document.getElementsByClassName("zoomable");
    for (const element of elements) {
      element.classList.remove("zoom-transition");
    }

    this.repositionSpacerLeft(distance);
    this.repositionTimeEvents(distance);
    this.repositionTimerMarkers(distance);
    this.repositionSpacerRight(distance);

    store.state.timelineZero -= distance;

    console.log("scroll by distance: ", -distance);

    timelineElement.scrollBy(-distance, 0);

    this.repositionSpacerPageEdge(timelineElement);

    for (const element of elements) {
      element.classList.add("zoom-transition");
    }
  }

  private static repositionSpacerLeft(distance: number) {
    store.state.spacerLeft.positionLeft -= distance;

    console.log("cutter new pos: ", store.state.spacerLeft.positionLeft);

    store.state.spacerLeft.htmlElement.style.transform =
      "translateX(" + store.state.spacerLeft.positionLeft + "px)";
  }

  private static repositionTimeEvents(distance: number) {
    for (let i = 0; i < store.state.timeEvents.length; i++) {
      
      store.state.timeEvents[i].positionCenter -= distance;
      store.state.timeEvents[i].htmlElement.style.transform =
        "translateX(" + store.state.timeEvents[i].positionCenter + "px)";
      
      console.log("cutter: te: " + i + ", new pos center: " + store.state.timeEvents[i].positionCenter);
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
      timelineElement.scrollLeft +
      timelineElement.clientWidth -
      store.state.spacerPageEdge.width;

    store.state.spacerPageEdge.htmlElement.style.transform =
      "translateX(" + newPositionLeft + "px)";
  }
}
