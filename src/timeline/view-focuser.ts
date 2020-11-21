import BoxModel from "@/models/box-model";
import store from "@/store";
import Zoomer from "./zoomer";

export default class ViewFocuser {
  private zoomer: Zoomer;
  private timelineElement: HTMLElement;
  constructor() {
    this.zoomer = Zoomer.Instance;
    this.timelineElement = document.getElementById("timeline") as HTMLElement;
  }

  /**
   * Changes zoom and view such that both the relative time positions for
   * left and right are visible including an additional margin on both sides.
   *
   * @param left Relative start of time range
   * @param right Relative end of time range
   */
  public focusOnRange(left: number, right: number) {
    // TODO: Add a margin left and right, so that boxes are inside view after zoom.
    const absoluteLeft =
      store.state.timelineZero + left * store.state.zoomLevel;

    const absoluteRight =
      store.state.timelineZero + right * store.state.zoomLevel;

    this.checkOutOfBounds(absoluteLeft, absoluteRight);

    const absoluteDistance = absoluteRight - absoluteLeft;
    const zoomFactor = this.timelineElement.clientWidth / absoluteDistance;
    const absoluteCenter = absoluteLeft + absoluteDistance / 2;

    this.zoomer.zoom(zoomFactor, absoluteCenter);

    this.timelineElement.scrollTo({
      left: absoluteCenter - this.timelineElement.clientWidth / 2
    });
  }

  /**
   * Centers the specified box in the view.
   *
   * @param box The box to put focus
   */
  public focusOnBox(box: BoxModel) {
    const position = box.positionCenter - this.timelineElement.clientWidth / 2;
    this.timelineElement.scrollTo({
      left: position,
      behavior: "smooth"
    });
  }

  private checkOutOfBounds(absoluteLeft: number, absoluteRight: number) {
    //TODO: Change this to check if below 0.
    if (absoluteLeft < 0) {
      console.error("View Focuser: Start is out of bounds");
    }

    if (
      absoluteRight >
        store.getters.spacerRight.positionLeft +
          store.getters.spacerRight.width ||
      absoluteRight >
        store.state.spacerPageEdge.positionLeft +
          store.state.spacerPageEdge.width
    ) {
      console.error("View Focuser: End is out of bounds");
    }
  }

  private static instance: ViewFocuser;
  public static get Instance() {
    return this.instance || (this.instance = new this());
  }
}
