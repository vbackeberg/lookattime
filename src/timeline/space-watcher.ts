import store from "@/store";
import LeftSpaceCutter from "./left-space-cutter";
import LeftSpaceExtender from "./left-space-extender";

export default class SpaceWatcher {
  constructor(timelineElement: Element, spacerLeftElement: Element) {
    spacerLeftElement.addEventListener("transitionend", () => {
      const expendableLeftSpace = Math.min(
        store.getters.spacerLeft.positionLeft,
        timelineElement.scrollLeft
      );

      if (expendableLeftSpace > 0) {
        console.log("Space Watcher: cut");
        LeftSpaceCutter.cutLeftSpace(timelineElement, expendableLeftSpace);
      } else if (store.getters.spacerLeft.positionLeft < 0) {
        console.log("Space Watcher: extend");
        LeftSpaceExtender.extendLeftSpace(
          timelineElement,
          -store.getters.spacerLeft.positionLeft
        );
      }
    });
  }
}
