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
        for (let element of document.getElementsByClassName("box")) {
          console.log("Space Cutter: Remove zoom-transition class");
          element.classList.remove("zoom-transition");
        }

        this.cutLeftSpace(expendableLeftSpace, timelineElement);

        Vue.nextTick(() => {
          for (let element of document.getElementsByClassName("box")) {
            console.log("Space Cutter: Re-add zoom-transition class");
            element.classList.add("zoom-transition");
          }
        });
      }
    });
  }

  // TODO when having expendable left space and zooming in from the right of the
  // highest box, boxes will jump. Probably an issue with spacer page edge
  private cutLeftSpace(distance: number, timelineElement: HTMLElement) {
    console.log("Space Cutter: Cut space left by " + distance);

    store.state.boxes.forEach(box => {
      box.positionCenter -= distance;
    });
    
    store.commit(
      "setSpacerPageEdgePosition",
      timelineElement.scrollLeft +
        timelineElement.clientWidth -
        distance -
        store.state.spacerPageEdge.width
    );

    store.commit("setTimelineZero", store.state.timelineZero - distance);

    Vue.nextTick(() => {
      timelineElement.scrollBy(-distance, 0);
    });
  }
}
