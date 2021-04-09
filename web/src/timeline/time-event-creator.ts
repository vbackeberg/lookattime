import TimeEventModel from "@/models/time-event-model";
import store from "@/store/store";
import Vue from "vue";
import ViewFocuser from "./viewport/view-focuser";
import PositionTranslator from "./position-translator";
import { v4 as uuid } from "uuid";
import ImageReferenceModel from "@/models/image-reference-model";

/**
 * Adds timeEvent to store. Handles possible space extension. Scrolls to new timeEvent.
 * Adds time new markers.
 */
export default class TimeEventCreator {
  private viewFocuser: ViewFocuser;

  private constructor() {
    this.viewFocuser = ViewFocuser.Instance;
  }

  public async addTimeEvent(
    timeEvent: TimeEventModel
  ): Promise<TimeEventModel> {
    await store.dispatch("addTimeEvent", timeEvent);

    await Vue.nextTick();

    this.focusView(timeEvent);

    return timeEvent;
  }

  private focusView(timeEvent: TimeEventModel) {
    if (store.state.timeEvents.length === 2) {
      this.viewFocuser.focusOnDateRange(
        store.state.timeEvents[0].date,
        store.state.timeEvents[1].date
      );
    } else {
      this.viewFocuser.focusOnTimeEvent(timeEvent);
    }
  }

  private static instance: TimeEventCreator;
  public static get Instance() {
    return this.instance || (this.instance = new this());
  }
}
