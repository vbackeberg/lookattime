import store from "@/store/store";
import Vue from "vue";
import CollisionCalculator from "./collision-calculator";

/**
 * Recalculates collision zoom levels for all time events when
 * time events are set, added or updated.
 */
export default class CollisionCalculationTrigger {
  private constructor() {
    store.subscribe(async mutation => {
      if (
        mutation.type === "setTimeEvents" ||
        mutation.type === "addTimeEvent" ||
        mutation.type === "updateTimeEvent" ||
        mutation.type === "deleteTimeEvent"
      ) {
        await Vue.nextTick();

        CollisionCalculator.recalculateCollisions();
      }
    });
  }

  private static instance: CollisionCalculationTrigger;
  public static get Instance() {
    return this.instance || (this.instance = new this());
  }
}
