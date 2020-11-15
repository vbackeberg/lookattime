import BoxModel from "@/models/box-model";
import store from "@/store";
import Vue from "vue";
import SpaceExtender from "./space-extender";

export default class BoxCreator {
  private timelineElement: Element;
  private spacerLeftElement: HTMLElement;

  constructor(timelineElement: Element) {
    this.timelineElement = timelineElement;
    this.spacerLeftElement = document.getElementById(
      "spacer-left"
    ) as HTMLElement;
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

    const position = box.positionCenter - this.timelineElement.clientWidth / 2;
    this.timelineElement.scrollTo({
      left: position,
      behavior: "smooth"
    });
  }
}
