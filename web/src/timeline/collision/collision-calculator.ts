import TimeEventModel from "@/models/time-event-model";
import store from "@/store/store";

/**
 * Calculates zoom-level-dependent expansion states for every time event.
 */
export default class CollisionCalculator {
  public static recalculateCollisions() {
    for (let i = 0; i < store.state.timeEvents.length; i++) {
      store.state.timeEvents[i].expansionZoomLevels[0] = Math.max(
        this.findCollisionLeft(i, TimeEventModel.boxWidth),
        this.findCollisionRight(i, TimeEventModel.boxWidth)
      );

      store.state.timeEvents[i].expansionZoomLevels[1] = Math.max(
        this.findCollisionLeft(i, TimeEventModel.bubbleWidth),
        this.findCollisionRight(i, TimeEventModel.bubbleWidth)
      );
    }
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
        return (
          width /
          (store.state.timeEvents[i].positionCenter -
            store.state.timeEvents[currentTimeEventIndex].positionCenter)
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
        return (
          width /
          (store.state.timeEvents[i].positionCenter -
            store.state.timeEvents[currentTimeEventIndex].positionCenter)
        );
      }
    }

    return 0;
  }
}
