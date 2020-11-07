import BoxModel from "@/models/box-model";
import store from "@/store";
import Vue from "vue";

export default class BoxCreator {
  private timelineElement: Element;

  constructor(timelineElement: Element) {
    this.timelineElement = timelineElement as Element;
  }

  public addBox(box: BoxModel) {
    store.commit("addBox", box);

    const position = box.positionCenter - this.timelineElement.clientWidth / 2;
    console.log("Box Creator: Scroll to " + position);
    console.log("Client width: " + this.timelineElement.clientWidth);


    // TODO Wait for space extender to extend before scroll onto new box.
    Vue.nextTick(() => {
      this.timelineElement.scrollTo({
        left: position,
        behavior: "smooth"
      });
    });
  }
}
