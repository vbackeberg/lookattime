import store from "@/store/store";
import SpaceCutter from "./space-cutter";
import SpaceExtender from "./space-extender";

/**
 * Observes movements of the left spacer to keep all elements in the positive position space.
 * It calls the space extender when the left spacer is at a negative position.
 * It calls the space cutter when the left spacer and scroll left are at a positive position.
 */
export default class SpaceObserver {
  private spacerLeftElement: HTMLElement;

  private constructor() {
    this.spacerLeftElement = document.getElementById(
      "spacer-left"
    ) as HTMLElement;

    this.spacerLeftElement.addEventListener("transitionend", () => {
      const expendableLeftSpace = Math.min(
        store.state.spacerLeft.positionLeft,
        store.state.timelineElement.scrollLeft
      );

      if (expendableLeftSpace > 0) {
        SpaceCutter.cutLeftSpace(
          store.state.timelineElement,
          expendableLeftSpace
        );
      } else if (store.state.spacerLeft.positionLeft < 0) {
        SpaceExtender.extendLeftSpace(
          store.state.timelineElement,
          -store.state.spacerLeft.positionLeft
        );
      }
    });
  }

  private static instance: SpaceObserver;
  public static get Instance() {
    return this.instance || (this.instance = new this());
  }
}
