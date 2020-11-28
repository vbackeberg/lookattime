import BoxModel from "@/models/box-model";
import TimeMarkerModel from "@/models/marker-model";
import store from "@/store";
import Vue from "vue";
import SpaceExtender from "./space-extender";
import ViewFocuser from "./view-focuser";
import TimeMarkerCreator from "./time-marker-creator";

/**
 * Adds box to store. Handles possible space extension. Scrolls to new box.
 * Adds time new markers.
 */
export default class BoxCreator {
  private timelineElement: HTMLElement;
  private spacerLeftElement: HTMLElement;
  private viewFocuser: ViewFocuser;
  private timeMarkerCreator: TimeMarkerCreator;

  private constructor() {
    this.timelineElement = document.getElementById("timeline") as HTMLElement;
    this.spacerLeftElement = document.getElementById(
      "spacer-left"
    ) as HTMLElement;
    this.viewFocuser = ViewFocuser.Instance;
    this.timeMarkerCreator = TimeMarkerCreator.Instance;
  }

  public async addBox(box: BoxModel) {
    store.commit("addBox", box);

    await Vue.nextTick();

    await SpaceExtender.extendLeftSpace(
      this.timelineElement,
      -store.getters.spacerLeft.positionLeft
    );

    this.focusView(box);

    if (store.state.boxes.length > 1) {
      this.timeMarkerCreator.createTimeMarkers();
    }
  }

  private focusView(box: BoxModel) {
    if (store.state.boxes.length === 2) {
      this.viewFocuser.focusOnRange(
        store.state.boxes[0].date,
        store.state.boxes[1].date
      );
    } else {
      this.viewFocuser.focusOnBox(box);
    }
  }

 

  private static instance: BoxCreator;
  public static get Instance() {
    return this.instance || (this.instance = new this());
  }
}
