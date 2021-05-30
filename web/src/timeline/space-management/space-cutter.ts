import store from "@/store/store";
import Vue from "vue";

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

    store.state.spacerLeft.positionLeft -= distance;

    store.state.timeEvents.forEach(timeEvent => {
      timeEvent.positionCenter -= distance;
    });

    store.state.timeMarkers.forEach(timeMarker => {
      timeMarker.positionCenter -= distance;
    });

    store.state.spacerRight.positionLeft -= distance;

    store.commit("setTimelineZero", store.state.timelineZero - distance);

    timelineElement.scrollBy(-distance, 0);

    await Vue.nextTick();

    store.commit(
      "setSpacerPageEdgePosition",
      timelineElement.scrollLeft +
        timelineElement.clientWidth -
        store.state.spacerPageEdge.width
    );

    for (const element of elements) {
      element.classList.add("zoom-transition");
    }
  }
}
