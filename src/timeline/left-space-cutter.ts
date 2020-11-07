import SpacerModel from "@/models/spacer-model";
import store from "@/store";
import Vue from "vue";

/**
 * Listens to zoom transition ends, then cuts space to the left if there is
 * expendable space to the left.
 */
export default class LeftSpaceCutter {
  private timelineElement: Element;

  constructor(timelineElement: Element, spacerLeftElement: Element) {
    this.timelineElement = timelineElement;

    spacerLeftElement.addEventListener("transitionend", () => {
      const expendableLeftSpace = Math.min(
        store.getters.spacerLeft.positionLeft,
        timelineElement.scrollLeft
      );

      if (expendableLeftSpace > 0) {
        for (let element of document.getElementsByClassName("zoomable")) {
          console.log("Space Cutter: Remove zoom-transition class");
          element.classList.remove("zoom-transition");
        }

        this.cutLeftSpace(expendableLeftSpace);
      }
    });
  }

  private cutLeftSpace(distance: number) {
    console.log("Space Cutter: Cut space left by " + distance);

    store.state.boxes.forEach(box => {
      box.positionCenter -= distance;
    });

    store.commit("setTimelineZero", store.state.timelineZero - distance);

    this.timelineElement.scrollBy(-distance, 0);
    Vue.nextTick(() => {
      store.commit(
        "setSpacerPageEdgePosition",
        this.timelineElement.scrollLeft +
          this.timelineElement.clientWidth -
          store.state.spacerPageEdge.width
      );

      for (let element of document.getElementsByClassName("zoomable")) {
        console.log("Space Cutter: Re-add zoom-transition class");
        element.classList.add("zoom-transition");
      }
    });
  }
}
