import SpacerModel from "@/models/spacer-model";
import store from "@/store";
import Vue from "vue";


/**
 * Extends space to the left by given distance. Takes care of removing animations during position shifting.
 */
export default class LeftSpaceExtender {
  public static async extendLeftSpace(
    timelineElement: Element,
    distance: number
  ) {
    for (let element of document.getElementsByClassName("zoomable")) {
      console.log("Space Extender: Remove zoom-transition class");
      element.classList.remove("zoom-transition");
    }

    console.log("Space Extender: Extend space left by " + distance);

    store.state.boxes.forEach(box => {
      box.positionCenter += distance;
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

    for (let element of document.getElementsByClassName("zoomable")) {
      console.log("Space Extender: Re-add zoom-transition class");
      element.classList.add("zoom-transition");
    }
  }
}
