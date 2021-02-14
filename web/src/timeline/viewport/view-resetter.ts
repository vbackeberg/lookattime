import store from "@/store/store";
import SpaceCutter from "../space-management/space-cutter";
import SpaceExtender from "../space-management/space-extender";
import ViewFocuser from "./view-focuser";
import Vue from "vue";

/**
 * Resets the viewport when loading a new timeline.
 */
export default class ViewResetter {
  private viewFocuser: ViewFocuser;
  constructor() {
    this.viewFocuser = ViewFocuser.Instance;
  }

  public async initiate() {
    const expendableLeftSpace = Math.min(
      store.getters.spacerLeft.positionLeft,
      store.state.timelineElement.scrollLeft
    );

    if (expendableLeftSpace > 0) {
      SpaceCutter.cutLeftSpace(
        store.state.timelineElement,
        expendableLeftSpace
      );
    } else if (store.getters.spacerLeft.positionLeft < 0) {
      SpaceExtender.extendLeftSpace(
        store.state.timelineElement,
        -store.getters.spacerLeft.positionLeft
      );
    }

    await Vue.nextTick();

    if (store.state.timeEvents.length === 0) {
      store.state.timelineElement.scrollTo({ left: 0 });
    } else if (store.state.timeEvents.length === 1) {
      this.viewFocuser.focusOnTimeEvent(store.state.timeEvents[0]);
    } else {
      this.viewFocuser.focusOnDateRange(
        store.state.timeEvents[0].date,
        store.state.timeEvents[store.state.timeEvents.length - 1].date
      );
    }

    this.notifyVisibilityObserver();
  }

  private notifyVisibilityObserver() {
    store.state.timelineElement.dispatchEvent(new CustomEvent("scroll"));
  }

  private static instance: ViewResetter;
  public static get Instance() {
    return this.instance || (this.instance = new this());
  }
}
