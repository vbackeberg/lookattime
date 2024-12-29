import TimeEventModel from "@/models/time-event/time-event-model";
import { Constants } from "../zooming/constants";
import { useLookAtTime } from "@/store/store";

/**
 * Calculates zoom-level-dependent expansion states for every time event.
 */
export default class CollisionCalculator {
  private constructor(private store = useLookAtTime()) {}

  public recalculateCollisions() {
    for (let i = 0; i < this.store.timeEvents.length; i++) {
      const newExpansionZoomlevels = [
        Constants.MAX_ZOOM_LEVEL,
        Constants.MAX_ZOOM_LEVEL,
        Constants.MAX_ZOOM_LEVEL,
        Constants.MAX_ZOOM_LEVEL
      ];

      newExpansionZoomlevels[0] = Math.min(
        this.findCollisionLeft(i, TimeEventModel.boxWidth),
        this.findCollisionRight(i, TimeEventModel.boxWidth)
      );

      newExpansionZoomlevels[1] = Math.min(
        this.findCollisionLeft(i, TimeEventModel.bubbleWidth),
        this.findCollisionRight(i, TimeEventModel.bubbleWidth)
      );

      this.store.timeEvents[i].expansionZoomLevels = newExpansionZoomlevels;
    }

    document.dispatchEvent(new Event("update-expansion-states"));
  }

  /**
   * Finds the nearest time event to the right, which has higher importance
   * and should thus make this time event shrink.
   *
   * If no collision is found, it returns the maximum zoom level,
   * which represents the maximum zoomed out view.
   */
  private findCollisionRight(
    currentTimeEventIndex: number,
    width: number
  ): number {
    for (
      let i = currentTimeEventIndex + 1;
      i < this.store.timeEvents.length;
      i++
    ) {
      if (
        this.store.timeEvents[i].importance >
        this.store.timeEvents[currentTimeEventIndex].importance
      ) {
        return this.calculateCollisionZoomLevel(
          this.store.timeEvents[i],
          this.store.timeEvents[currentTimeEventIndex],
          width
        );
      }
    }

    return Constants.MAX_ZOOM_LEVEL;
  }

  private findCollisionLeft(
    currentTimeEventIndex: number,
    width: number
  ): number {
    for (let i = currentTimeEventIndex - 1; i > -1; i--) {
      if (
        this.store.timeEvents[i].importance >
        this.store.timeEvents[currentTimeEventIndex].importance
      ) {
        return this.calculateCollisionZoomLevel(
          this.store.timeEvents[i],
          this.store.timeEvents[currentTimeEventIndex],
          width
        );
      }
    }

    return Constants.MAX_ZOOM_LEVEL;
  }

  /**
   * Calculates the zoom level at which the given time events
   * would collide.
   */
  private calculateCollisionZoomLevel(
    collidingTimeEvent: TimeEventModel,
    currentTimeEvent: TimeEventModel,
    width: number
  ) {
    return (
      this.store.zoomLevel *
      (Math.abs(
        collidingTimeEvent.positionCenter - currentTimeEvent.positionCenter
      ) /
        width)
    );
  }
}
