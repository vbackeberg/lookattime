import TimeEventModel from "@/models/time-event-model";
import store from "@/store/store";
import Vue from "vue";
import ViewFocuser from "./viewport/view-focuser";
import PositionTranslator from "./position-translator";
import { v4 as uuid } from "uuid";

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
    id: string,
    text: string,
    date: number,
    importance: number,
    imageIds: string[],
    title: string
  ): Promise<TimeEventModel> {
    const timeEvent = new TimeEventModel(
      PositionTranslator.toAbsolutePosition(date),
      id,
      text,
      date,
      importance,
      imageIds,
      title
    );

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
