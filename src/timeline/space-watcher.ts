import store from "@/store";
import SpaceCutter from "./space-cutter";
import SpaceExtender from "./space-extender";

export default class SpaceWatcher {
  constructor(timelineElement: Element, spacerLeftElement: Element) {
    spacerLeftElement.addEventListener("transitionend", () => {
      const expendableLeftSpace = Math.min(
        store.getters.spacerLeft.positionLeft,
        timelineElement.scrollLeft
      );

      if (expendableLeftSpace > 0) {
        console.log("Space Watcher: cut");
        SpaceCutter.cutLeftSpace(timelineElement, expendableLeftSpace);
      } else if (store.getters.spacerLeft.positionLeft < 0) {
        console.log("Space Watcher: extend");
        SpaceExtender.extendLeftSpace(
          timelineElement,
          -store.getters.spacerLeft.positionLeft
        );
      }
    });
  }
}
