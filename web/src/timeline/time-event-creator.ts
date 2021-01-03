import TimeEventModel from "@/models/time-event-model";
import store from "@/store";
import Vue from "vue";
import ViewFocuser from "./view-focuser";
import TimeMarkerCreator from "./time-marker-management/time-marker-creator";
import SpaceExtender from "./space-management/space-extender";
import PositionTranslator from "./position-translator";
import { v4 as uuid } from "uuid";

/**
 * Adds timeEvent to store. Handles possible space extension. Scrolls to new timeEvent.
 * Adds time new markers.
 */
export default class TimeEventCreator {
  private timelineElement: HTMLElement;
  private viewFocuser: ViewFocuser;
  private timeMarkerCreator: TimeMarkerCreator;

  private constructor() {
    this.timelineElement = document.getElementById("timeline") as HTMLElement;
    this.viewFocuser = ViewFocuser.Instance;
    this.timeMarkerCreator = TimeMarkerCreator.Instance;
  }

  public async addTimeEvent(text: string, date: number, importance: number, imageIds: number[], title: string) {
    const timeEvent = new TimeEventModel(
      PositionTranslator.toAbsolutePosition(date),
      uuid(),
      text,
      date,
      importance,
      imageIds,
      title
    );

    store.dispatch("addTimeEvent", timeEvent);
      

    await Vue.nextTick();

    await SpaceExtender.extendLeftSpace(
      this.timelineElement,
      -store.getters.spacerLeft.positionLeft
    );

    this.focusView(timeEvent);

    if (
      store.state.timeEvents.length === 2 &&
      store.state.timeMarkers.length === 0
    ) {
      this.timeMarkerCreator.initiateTimeMarkers();
    }
  }

  private focusView(timeEvent: TimeEventModel) {
    if (store.state.timeEvents.length === 2) {
      this.viewFocuser.focusOnRange(
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
