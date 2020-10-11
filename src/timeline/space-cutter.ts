import store from "@/store";
import Vue from "vue";
export default class SpaceCutter {
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
      const expendableLeftSpace = Math.min(
        store.state.SpacerLeft.positionLeft,
        timelineElement.scrollLeft
      );

      if (expendableLeftSpace > 0) {
        for (let element of document.getElementsByClassName("box")) {
          console.log("remove zoom-transition class");
          element.classList.remove("zoom-transition");
        }

        this.cutLeftSpace(expendableLeftSpace, timelineElement);

        Vue.nextTick(() => {
          for (let element of document.getElementsByClassName("box")) {
            console.log("re-add zoom-transition class");
            element.classList.add("zoom-transition");
          }
        });
      }
    });
  }

  private cutLeftSpace(distance: number, timelineElement: HTMLElement) {
    console.log("cut space left by " + distance);

    store.state.boxes.forEach(box => {
      box.positionCenter -= distance;
    });

    store.commit(
      "setSpacerLeftPosition",
      store.state.SpacerLeft.positionLeft - distance
    );

    store.commit(
      "setSpacerRightPosition",
      store.state.SpacerRight.positionLeft - distance
    );

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
