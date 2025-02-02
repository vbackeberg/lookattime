import { useLookAtTime } from "@/store/store";
import SpaceAllocator from "./space-allocator";
import DebugLogger from "../debug-logger";

/**
 * Observes movements of the left spacer to keep all elements in the positive position space.
 * It calls the space extender when the left spacer is at a negative position.
 * It calls the space cutter when the left spacer and scroll left are at a positive position.
 */
export default class SpaceObserver {
  private spacerLeftElement: HTMLElement;
  public eventTarget = new EventTarget();
  private spaceAllocator = SpaceAllocator.Instance;

  private constructor(private store = useLookAtTime()) {
    this.spacerLeftElement = document.getElementById(
      "spacer-left"
    ) as HTMLElement;

    this.spacerLeftElement.addEventListener("transitionend", () => {
      const expendableLeftSpace = Math.min(
        this.store.spacerLeft!.positionLeft,
        this.store.timelineElement!.scrollLeft
      );

      if (expendableLeftSpace > 0) {
        this.spaceAllocator.cutoffLeftSpace(
          this.store.timelineElement!,
          expendableLeftSpace
        );
      } else if (this.store.spacerLeft!.positionLeft < 0) {
        this.spaceAllocator.extendLeftSpace(
          this.store.timelineElement!,
          -this.store.spacerLeft!.positionLeft
        );
      }

      console.debug("Space management end")
      DebugLogger.Instance.logTimelineState(this.constructor.name)

      this.eventTarget.dispatchEvent(new Event("space-management-end"));
    });
  }

  private static instance: SpaceObserver;
  public static get Instance() {
    return this.instance || (this.instance = new this());
  }
}
