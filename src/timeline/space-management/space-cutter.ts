import store from "@/store";
import Vue from "vue";

/**
 * Cuts expendable space on the left by given distance. Takes care of removing animations during position shifting.
 */
export default class SpaceCutter {
  public static async cutLeftSpace(timelineElement: Element, distance: number) {
    for (let element of document.getElementsByClassName("zoomable")) {
      element.classList.remove("zoom-transition");
    }

    store.state.boxes.forEach(box => {
      box.positionCenter -= distance;
    });

    store.state.timeMarkers.forEach(timeMarker => {
      timeMarker.positionCenter -= distance;
    });

    store.commit("setTimelineZero", store.state.timelineZero - distance);

    timelineElement.scrollBy(-distance, 0);

    await Vue.nextTick();

    store.commit(
      "setSpacerPageEdgePosition",
      timelineElement.scrollLeft +
        timelineElement.clientWidth -
        store.state.spacerPageEdge.width
    );

    for (let element of document.getElementsByClassName("zoomable")) {
      element.classList.add("zoom-transition");
    }
  }
}
