import store from "@/store/store";
import Vue from "vue";

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

    store.state.spacerLeft.positionLeft += distance;
    store.state.timeEvents.forEach(timeEvent => {
      timeEvent.positionCenter += distance;
    });

    store.state.timeMarkers.forEach(timeMarker => {
      timeMarker.positionCenter += distance;
    });

    store.commit("setTimelineZero", store.state.timelineZero + distance);

    store.commit(
      "setSpacerPageEdgePosition",
      timelineElement.scrollLeft +
        timelineElement.clientWidth +
        distance -
        store.state.spacerPageEdge.width
    );

    await Vue.nextTick();

    timelineElement.scrollBy(distance, 0);

    for (const element of elements) {
      element.classList.add("zoom-transition");
    }
  }
}
