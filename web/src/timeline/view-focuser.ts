import TimeEventModel from "@/models/time-event-model";
import store from "@/store";
import Zoomer from "./zoomer";

export default class ViewFocuser {
  private zoomer: Zoomer;
  private timelineElement: HTMLElement;
  private constructor() {
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
    const absoluteLeft =
      store.state.timelineZero + left * store.state.zoomLevel;

    const absoluteRight =
      store.state.timelineZero + right * store.state.zoomLevel;

    this.checkOutOfBounds(absoluteLeft, absoluteRight);

    const absoluteDistance = absoluteRight - absoluteLeft;
    const margin = TimeEventModel.expandedWidth + 32;
    const zoomFactor =
      (this.timelineElement.clientWidth - margin) / absoluteDistance;
    const absoluteCenter = absoluteLeft + absoluteDistance / 2;

    this.zoomer.zoom(zoomFactor, absoluteCenter);

    this.timelineElement.scrollTo({
      left: absoluteCenter - this.timelineElement.clientWidth / 2
    });
  }

  /**
   * Centers the specified timeEvent in the view.
   *
   * @param timeEvent The timeEvent to put focus on
   */
  public focusOnTimeEvent(timeEvent: TimeEventModel) {
    const position = timeEvent.positionCenter - this.timelineElement.clientWidth / 2;
    this.timelineElement.scrollTo({
      left: position,
      behavior: "smooth"
    });
  }

  private checkOutOfBounds(absoluteLeft: number, absoluteRight: number) {
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
