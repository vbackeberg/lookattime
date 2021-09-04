import store from "@/store/store";
import Vue from "vue";
import ViewFocuser from "./view-focuser";

/**
 * Refocuses the view when a time event is added or updated. 
 */
export default class ViewFocusTrigger {
  private viewFocuser: ViewFocuser;

  private constructor() {
    this.viewFocuser = ViewFocuser.Instance;

    store.subscribe(async mutation => {
      if (mutation.type === "addTimeEvent") {
        await Vue.nextTick();

        if (store.state.timeEvents.length === 1) {
          this.viewFocuser.focusOnPosition(mutation.payload.positionCenter);
        } else {
          this.viewFocuser.extendFocus(mutation.payload.positionCenter);
        }
      }

      if (mutation.type === "updateTimeEvent") {
        await Vue.nextTick();

        this.viewFocuser.extendFocus(mutation.payload.positionCenter);
      }
    });
  }

  private static instance: ViewFocusTrigger;
  public static get Instance() {
    return this.instance || (this.instance = new this());
  }
}
