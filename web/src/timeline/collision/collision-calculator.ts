import TimeEventModel from "@/models/time-event-model";
import store from "@/store/store";
import { Constants } from "../zooming/constants";

/**
 * Calculates zoom-level-dependent expansion states for every time event.
 */
export default class CollisionCalculator {
  public static recalculateCollisions() {
    for (let i = 0; i < store.state.timeEvents.length; i++) {
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

      store.state.timeEvents[i].expansionZoomLevels = newExpansionZoomlevels;
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
  private static findCollisionRight(
    currentTimeEventIndex: number,
    width: number
  ): number {
    for (
      let i = currentTimeEventIndex + 1;
      i < store.state.timeEvents.length;
      i++
    ) {
      if (
        store.state.timeEvents[i].importance >
        store.state.timeEvents[currentTimeEventIndex].importance
      ) {
        return this.calculateCollisionZoomLevel(
          store.state.timeEvents[i],
          store.state.timeEvents[currentTimeEventIndex],
          width
        );
      }
    }

    return Constants.MAX_ZOOM_LEVEL;
  }

  private static findCollisionLeft(
    currentTimeEventIndex: number,
    width: number
  ): number {
    for (let i = currentTimeEventIndex - 1; i > -1; i--) {
      if (
        store.state.timeEvents[i].importance >
        store.state.timeEvents[currentTimeEventIndex].importance
      ) {
        return this.calculateCollisionZoomLevel(
          store.state.timeEvents[i],
          store.state.timeEvents[currentTimeEventIndex],
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
  private static calculateCollisionZoomLevel(
    collidingTimeEvent: TimeEventModel,
    currentTimeEvent: TimeEventModel,
    width: number
  ) {
    return (
      store.state.zoomLevel *
      (Math.abs(
        collidingTimeEvent.positionCenter - currentTimeEvent.positionCenter
      ) /
        width)
    );
  }
}
