import store from "@/store";
import SpaceCutter from "./space-cutter";
import SpaceExtender from "./space-extender";

export default class SpaceObserver {
  private timelineElement: HTMLElement;
  private spacerLeftElement: HTMLElement;

  private constructor() {
    this.timelineElement = document.getElementById("timeline") as HTMLElement;
    this.spacerLeftElement = document.getElementById("spacer-left") as HTMLElement;

    this.spacerLeftElement.addEventListener("transitionend", () => {
      const expendableLeftSpace = Math.min(
        store.getters.spacerLeft.positionLeft,
        this.timelineElement.scrollLeft
      );

      if (expendableLeftSpace > 0) {
        SpaceCutter.cutLeftSpace(this.timelineElement, expendableLeftSpace);
      } else if (store.getters.spacerLeft.positionLeft < 0) {
        SpaceExtender.extendLeftSpace(
          this.timelineElement,
          -store.getters.spacerLeft.positionLeft
        );
      }
    });
  }

  private static instance: SpaceObserver;
  public static get Instance() {
    return this.instance || (this.instance = new this());
  }
}
