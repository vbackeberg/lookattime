import BoxModel from "@/models/box-model";
import TimeMarkerModel from "@/models/marker-model";
import store from "@/store";
import Vue from "vue";
import SpaceExtender from "./space-extender";

export default class BoxCreator {
  private timelineElement: HTMLElement;
  private spacerLeftElement: HTMLElement;

  constructor() {
    this.timelineElement = document.getElementById("timeline") as HTMLElement;
    this.spacerLeftElement = document.getElementById(
      "spacer-left"
    ) as HTMLElement;
  }

  public async addBox(box: BoxModel) {
    this.spacerLeftElement.classList.remove("zoom-transition");

    store.commit("addBox", box);

    this.addTimeMarkers();

    await Vue.nextTick();

    await SpaceExtender.extendLeftSpace(
      this.timelineElement,
      -store.getters.spacerLeft.positionLeft
    );

    this.spacerLeftElement.classList.add("zoom-transition");

    const position = box.positionCenter - this.timelineElement.clientWidth / 2;
    this.timelineElement.scrollTo({
      left: position,
      behavior: "smooth"
    });
  }
  addTimeMarkers() {
    // TOOD: If new box is new heighest or lowest,
    // fill space up to new box with new time markers.
    
    // For highest: Determine distance highest to second highest
    
    // extend time markers with new markers each with distance of timeMarkerDistance
    // to the previous one:
    // (positionCenter = previousPositionCenter + timeMarkerDistance)


  private static instance: BoxCreator;
  public static get Instance() {
    return this.instance || (this.instance = new this());
  }
}
