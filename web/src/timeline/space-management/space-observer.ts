import store from "@/store/store";
import SpaceCutter from "./space-cutter";
import SpaceExtender from "./space-extender";

/**
 * Observes movements of the left spacer and calls space cutter or space extender accordingly.
 */
export default class SpaceObserver {
  private spacerLeftElement: HTMLElement;

  private constructor() {
    this.spacerLeftElement = document.getElementById(
      "spacer-left"
    ) as HTMLElement;

    this.spacerLeftElement.addEventListener("transitionend", () => {
      const expendableLeftSpace = Math.min(
        store.getters.spacerLeft.positionLeft,
        store.state.timelineElement.scrollLeft
      );

      if (expendableLeftSpace > 0) {
        SpaceCutter.cutLeftSpace(
          store.state.timelineElement,
          expendableLeftSpace
        );
      } else if (store.getters.spacerLeft.positionLeft < 0) {
        SpaceExtender.extendLeftSpace(
          store.state.timelineElement,
          -store.getters.spacerLeft.positionLeft
        );
      } else {
        this.notifyVisibilityObserver();
      }
    });
  }

  private notifyVisibilityObserver() {
    store.state.timelineElement.dispatchEvent(new CustomEvent("scroll"));
  }

  private static instance: SpaceObserver;
  public static get Instance() {
    return this.instance || (this.instance = new this());
  }
}
