import store from "@/store/store";
import Vue from "vue";
import ViewFocuser from "./viewport/view-focuser";
import VisibilityObserver from "./visibility-management/visibility-observer";

/**
 * Adds timeEvent to store. Handles possible space extension. Scrolls to new timeEvent.
 * Adds time new markers.
 */
export default class TimeEventCreator {
  private viewFocuser: ViewFocuser;

  private constructor() {
    this.viewFocuser = ViewFocuser.Instance;

    store.subscribe(async mutation => {
      if (mutation.type === "addTimeEvent") {
        console.log("addTimeEvent");

        await Vue.nextTick();

        if (store.state.timeEvents.length === 1) {
          this.viewFocuser.focusOnPosition(mutation.payload.positionCenter);
        } else {
          this.viewFocuser.extendFocus(mutation.payload.positionCenter);
        }
      }

      if (mutation.type === "updateTimeEvent") {
        console.log("updateTimeEvent");

        await Vue.nextTick();

        this.viewFocuser.extendFocus(mutation.payload.positionCenter);
      }

      VisibilityObserver.Instance.notify();
    });
  }

  private static instance: TimeEventCreator;
  public static get Instance() {
    return this.instance || (this.instance = new this());
  }
}
