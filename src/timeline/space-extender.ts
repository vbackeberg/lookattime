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
      console.error("SpacerLeft not found.");
      return;
    }

    const timelineElement = document.getElementById("timeline");

    if (!timelineElement) {
      console.error("Timeline not found");
      return;
    }
    spacerLeftElement.addEventListener("transitionend", () => {
      const requiredLeftSpace = -store.state.SpacerLeft.positionLeft;

      if (requiredLeftSpace > 0) {
        for (let element of document.getElementsByClassName("box")) {
          console.log("remove zoom-transition class");
          element.classList.remove("zoom-transition");
        }

        this.extendLeftSpace(requiredLeftSpace, timelineElement);

        Vue.nextTick(() => {
          for (let element of document.getElementsByClassName("box")) {
            console.log("re-add zoom-transition class");
            element.classList.add("zoom-transition");
          }
        });
      }
    });
  }

  // TODO when having expendable left space and zooming in from the right of the
  // highest box, boxes will jump. Probably an issue with spacer page edge
  private extendLeftSpace(distance: number, timelineElement: HTMLElement) {
    console.log("extend space left by " + distance);

    store.state.boxes.forEach(box => {
      box.positionCenter += distance;
    });

    store.commit(
      "setSpacerLeftPosition",
      store.state.SpacerLeft.positionLeft + distance
    );

    store.commit(
      "setSpacerRightPosition",
      store.state.SpacerRight.positionLeft + distance
    );

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
