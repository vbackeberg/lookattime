import store from "@/store/store";
import SpaceCutter from "../space-management/space-cutter";
import SpaceExtender from "../space-management/space-extender";
import ViewFocuser from "./view-focuser";
import Vue from "vue";
import TimeMarkerRemover from "../time-marker-management/time-marker-remover";

/**
 * Resets the viewport when loading a new timeline.
 */
export default class ViewResetter {
  private viewFocuser: ViewFocuser;
  constructor() {
    this.viewFocuser = ViewFocuser.Instance;
  }

  public resetView() {
    store.state.timelineZero = store.state.timelineElement.clientWidth / 2;
    TimeMarkerRemover.Instance.removeAllMarkers();
    store.state.timeMarkerDepth = 1;
    store.state.zoomLevel = 1;
    this.repositionSpacerViewportRight();
  }

  public async initiateView() {
    const expendableLeftSpace = Math.min(
      store.state.spacerLeft.positionLeft,
      store.state.timelineElement.scrollLeft
    );

    if (expendableLeftSpace > 0) {
      SpaceCutter.cutLeftSpace(
        store.state.timelineElement,
        expendableLeftSpace
      );
    } else if (store.state.spacerLeft.positionLeft < 0) {
      SpaceExtender.extendLeftSpace(
        store.state.timelineElement,
        -store.state.spacerLeft.positionLeft
      );
    }

    await Vue.nextTick();
    this.focusView();
  }

  private focusView() {
    if (store.state.timeEvents.length === 0) {
      store.state.timelineElement.scrollTo({ left: 0 });
    } else if (store.state.timeEvents.length === 1) {
      this.viewFocuser.focusOnPosition(
        store.state.timeEvents[0].positionCenter
      );
    } else {
      this.viewFocuser.focusOnRange(
        store.state.timeEvents[0].positionCenter,
        store.state.timeEvents[store.state.timeEvents.length - 1].positionCenter
      );
    }
  }

  private repositionSpacerViewportRight() {
    store.state.spacerViewportRight.positionLeft = 0;
  }

  private static instance: ViewResetter;
  public static get Instance() {
    return this.instance || (this.instance = new this());
  }
}
