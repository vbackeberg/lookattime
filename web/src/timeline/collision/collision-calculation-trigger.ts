import store from "@/store/store";
import Vue from "vue";
import CollisionCalculator from "./collision-calculator";

/**
 * Refocuses the view when a time event is added or updated.
 */
export default class CollisionCalculationTrigger {
  private constructor() {
    store.subscribe(async mutation => {
      if (
        mutation.type === "setTimeEvents" ||
        mutation.type === "addTimeEvent" ||
        mutation.type === "updateTimeEvent"
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
