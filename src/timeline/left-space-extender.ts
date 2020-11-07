import SpacerModel from "@/models/spacer-model";
import store from "@/store";
import Vue from "vue";

/**
 * Listens to zoom transition ends, then extends space to the left if spacer
 * is in the negative.
 */
export default class LeftSpaceExtender {
  private timelineElement: Element;

  constructor(timelineElement: Element, spacerLeftElement: Element) {
    this.timelineElement = timelineElement;

    spacerLeftElement.addEventListener("transitionend", () => {
      const requiredLeftSpace = -store.getters.spacerLeft.positionLeft;

      if (requiredLeftSpace > 0) {
        for (let element of document.getElementsByClassName("zoomable")) {
          console.log("Space Extender: Remove zoom-transition class");
          element.classList.remove("zoom-transition");
        }

        this.extendLeftSpace(requiredLeftSpace);

        Vue.nextTick(() => {
          for (let element of document.getElementsByClassName("zoomable")) {
            console.log("Space Extender: Re-add zoom-transition class");
            element.classList.add("zoom-transition");
          }
        });
      }
    });
  }

  private extendLeftSpace(distance: number) {
    console.log("Space Extender: Extend space left by " + distance);

    store.state.boxes.forEach(box => {
      box.positionCenter += distance;
    });

    store.commit(
      "setSpacerPageEdgePosition",
      this.timelineElement.scrollLeft +
        this.timelineElement.clientWidth +
        distance -
        store.state.spacerPageEdge.width
    );

    store.commit("setTimelineZero", store.state.timelineZero + distance);

    Vue.nextTick(() => {
      this.timelineElement.scrollBy(distance, 0);
    });
  }
}
