import TimeEventModel from "@/models/time-event-model";
import store from "@/store/store";

/**
 * Calculates zoom-level-dependent expansion states for every time event.
 */
export default class CollisionCalculator {
  public static recalculateCollisions() {
    for (let i = 0; i < store.state.timeEvents.length; i++) {
      const newExpansionZoomlevels = [0, 0, 0, 0];

      newExpansionZoomlevels[0] = Math.max(
        this.findCollisionLeft(i, TimeEventModel.boxWidth),
        this.findCollisionRight(i, TimeEventModel.boxWidth)
      );

      newExpansionZoomlevels[1] = Math.max(
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

    return 0;
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

    return 0;
  }

  private static calculateCollisionZoomLevel(
    collidingTimeEvent: TimeEventModel,
    currentTimeEvent: TimeEventModel,
    width: number
  ) {
    return (
      (store.state.zoomLevel * width) /
      Math.abs(
        collidingTimeEvent.positionCenter - currentTimeEvent.positionCenter
      )
    );
  }
}
