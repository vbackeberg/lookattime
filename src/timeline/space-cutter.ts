import SpacerModel from '@/models/spacer-model';
import store from "@/store";
import Vue from "vue";

/**
 * Listens to zoom transition ends, then cuts space to the left if there is
 * expendable space to the left.
 */
export default class SpaceCutter {
  constructor() {
    const spacerLeftElement = document.getElementById("spacer-left");

    if (!spacerLeftElement) {
      console.error("Space Cutter: SpacerLeft not found.");
      return;
    }

    const timelineElement = document.getElementById("timeline");

    if (!timelineElement) {
      console.error("Space Cutter: Timeline not found");
      return;
    }

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

        this.cutLeftSpace(expendableLeftSpace, timelineElement);

        Vue.nextTick(() => {
          for (let element of document.getElementsByClassName("zoomable")) {
            console.log("Space Cutter: Re-add zoom-transition class");
            element.classList.add("zoom-transition");
          }
        });
      }
    });
  }

  private cutLeftSpace(distance: number, timelineElement: HTMLElement) {
    console.log("Space Cutter: Cut space left by " + distance);

    store.state.boxes.forEach(box => {
      box.positionCenter -= distance;
    });

    store.commit("setTimelineZero", store.state.timelineZero - distance);

    timelineElement.scrollBy(-distance, 0);
    Vue.nextTick(() => {
      store.commit(
        "setSpacerPageEdgePosition",
        timelineElement.scrollLeft +
          timelineElement.clientWidth -
          SpacerModel.width
      );
    });
  }
}
