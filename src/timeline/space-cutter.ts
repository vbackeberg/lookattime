import SpacerModel from "@/models/spacer-model";
import store from "@/store";
import Vue from "vue";

/**
 * Cuts expendable space on the left by given distance. Takes care of removing animations during position shifting.
 */
export default class SpaceCutter {
  public static async cutLeftSpace(timelineElement: Element, distance: number) {
    for (let element of document.getElementsByClassName("zoomable")) {
      console.log("Space Extender: Remove zoom-transition class");
      element.classList.remove("zoom-transition");
    }

    console.log("Space Cutter: Cut space left by " + distance);

    store.state.boxes.forEach(box => {
      box.positionCenter -= distance;
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
      console.log("Space Cutter: Re-add zoom-transition class");
      element.classList.add("zoom-transition");
    }
  }
}
