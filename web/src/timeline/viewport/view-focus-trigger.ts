import store from "@/store/store";
import Vue from "vue";
import { MutationPayload } from "vuex";
import ViewFocuser from "./view-focuser";
import ViewResetter from "./view-resetter";

/**
 * Refocuses the view when time events are set, added or updated.
 */
export default class ViewFocusTrigger {
  private viewFocuser: ViewFocuser;

  private constructor() {
    this.viewFocuser = ViewFocuser.Instance;

    store.subscribe(async (mutation: MutationPayload) => {
      if (mutation.type === "setTimeEvents") {
        await Vue.nextTick();

        if (mutation.payload.length > 0) {
          await ViewResetter.Instance.initiateView();
        }
      }

      /* TODO
      Since zoom level in store is set to max at start, the second
      event will always be inside view, thus view will stay max zoomed out.

      Either set zoom level to min zoom level and fix the repositioning which
      seems to be broken for an unknown reason.


      Or: Change the view focuser logic such that it zooms in as much
      as needed such that the time event is well visible (fully expanded).
      */

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
