import { useLookAtTime } from "@/store/store";
import CollisionCalculator from "./collision-calculator";
import { nextTick } from "vue";

/**
 * Recalculates collision zoom levels for all time events when
 * time events are set, added or updated.
 */
export default class CollisionCalculationTrigger {
  private constructor(private store = useLookAtTime()) {
    this.store.$onAction(async ({ name }) => {
      if (
        name === "setTimeEvents" ||
        name === "addTimeEvent" ||
        name === "updateTimeEvent" ||
        name === "deleteTimeEvent"
      ) {
        await nextTick();

        CollisionCalculator.recalculateCollisions();
      }
    });
  }

  private static instance: CollisionCalculationTrigger;
  public static get Instance() {
    return this.instance || (this.instance = new this());
  }
}
