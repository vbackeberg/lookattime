import store from "@/store";
import Vue from "vue";

/**
 * Listens to zoom transition ends, then extends space to the left if spacer
 * is in the negative.
 */
export default class SpaceExtender {
  constructor() {
    const spacerLeftElement = document.getElementById("spacer-left");

    if (!spacerLeftElement) {
      console.error("Space Extender: SpacerLeft not found.");
      return;
    }

    const timelineElement = document.getElementById("timeline");

    if (!timelineElement) {
      console.error("Space Extender: Timeline not found");
      return;
    }
    spacerLeftElement.addEventListener("transitionend", () => {
      const requiredLeftSpace = -store.getters.spacerLeft.positionLeft;

      if (requiredLeftSpace > 0) {
        for (let element of document.getElementsByClassName("box")) {
          console.log("Space Extender: Remove zoom-transition class");
          element.classList.remove("zoom-transition");
        }

        this.extendLeftSpace(requiredLeftSpace, timelineElement);

        Vue.nextTick(() => {
          for (let element of document.getElementsByClassName("box")) {
            console.log("Space Extender: Re-add zoom-transition class");
            element.classList.add("zoom-transition");
          }
        });
      }
    });
  }

  private extendLeftSpace(distance: number, timelineElement: HTMLElement) {
    console.log("Space Extender: Extend space left by " + distance);

    store.state.boxes.forEach(box => {
      box.positionCenter += distance;
    });

    store.commit(
      "setSpacerPageEdgePosition",
      timelineElement.scrollLeft +
        timelineElement.clientWidth +
        distance -
        store.state.spacerPageEdge.width
    );

    store.commit("setTimelineZero", store.state.timelineZero + distance);

    Vue.nextTick(() => {
      timelineElement.scrollBy(distance, 0);
    });
  }
}
