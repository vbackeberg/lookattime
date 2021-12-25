import TimeEventModel from "@/models/time-event-model";
import store from "@/store/store";
import BigUtils from "@/util/big-utils";
import max from "@/util/big-utils";
import Big from "big.js";

/**
 * Calculates zoom-level-dependent expansion states for every time event.
 */
export default class CollisionCalculator {
  public static recalculateCollisions() {
    for (let i = 0; i < store.state.timeEvents.length; i++) {
      const newExpansionZoomlevels = [
        new Big(0),
        new Big(0),
        new Big(0),
        new Big(0)
      ];

      newExpansionZoomlevels[0] = BigUtils.max(
        this.findCollisionLeft(i, TimeEventModel.boxWidth),
        this.findCollisionRight(i, TimeEventModel.boxWidth)
      );

      newExpansionZoomlevels[1] = BigUtils.max(
        this.findCollisionLeft(i, TimeEventModel.bubbleWidth),
        this.findCollisionRight(i, TimeEventModel.bubbleWidth)
      );

      store.state.timeEvents[i].expansionZoomLevels = newExpansionZoomlevels;
    }

    document.dispatchEvent(new Event("update-expansion-states"));
  }

  private static findCollisionRight(
    currentTimeEventIndex: number,
    width: number
  ): Big {
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

    return new Big(0);
  }

  private static findCollisionLeft(
    currentTimeEventIndex: number,
    width: number
  ): Big {
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

    return new Big(0);
  }

  /**
   * Calculates the zoom level at which a collision between two time events will occur
   * at the given width.
   *
   * Divides the width by the current absolute distance between the two time events.
   * The width is adjusted to the current zoom level.
   *
   * @param collidingTimeEvent
   * @param currentTimeEvent
   * @param width
   * @returns the zoom level at which the collision will occur
   */
  private static calculateCollisionZoomLevel(
    collidingTimeEvent: TimeEventModel,
    currentTimeEvent: TimeEventModel,
    width: number
  ) {
    return store.state.zoomLevel
      .mul(width)
      .div(
        Math.abs(
          collidingTimeEvent.positionCenter - currentTimeEvent.positionCenter
        )
      );
  }
}
