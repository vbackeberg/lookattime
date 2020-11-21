import BoxModel from "@/models/box-model";
import TimeMarkerModel from "@/models/marker-model";
import store from "@/store";
import Vue from "vue";
import SpaceExtender from "./space-extender";
import ViewFocuser from "./view-focuser";

export default class BoxCreator {
  private timelineElement: HTMLElement;
  private spacerLeftElement: HTMLElement;
  private viewFocuser: ViewFocuser;

  constructor() {
    this.timelineElement = document.getElementById("timeline") as HTMLElement;
    this.spacerLeftElement = document.getElementById(
      "spacer-left"
    ) as HTMLElement;
    this.viewFocuser = ViewFocuser.Instance;
  }

  public async addBox(box: BoxModel) {
    this.spacerLeftElement.classList.remove("zoom-transition");

    store.commit("addBox", box);

    await Vue.nextTick();

    await SpaceExtender.extendLeftSpace(
      this.timelineElement,
      -store.getters.spacerLeft.positionLeft
    );

    this.spacerLeftElement.classList.add("zoom-transition");

    this.focusView(box);
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
