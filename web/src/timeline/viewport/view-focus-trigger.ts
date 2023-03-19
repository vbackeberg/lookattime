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
  private viewResetter: ViewResetter;

  private constructor() {
    this.viewFocuser = ViewFocuser.Instance;
    this.viewResetter = ViewResetter.Instance;

    store.subscribe(async (mutation: MutationPayload) => {
      if (mutation.type === "setTimeEvents") {
        await Vue.nextTick();

        if (mutation.payload.length > 0) {
          await this.viewResetter.initiateView();
        }
      }

      if (mutation.type === "addTimeEvent") {
        await Vue.nextTick();

        if (store.state.timeEvents.length < 3) {
          await this.viewResetter.initiateView();
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
