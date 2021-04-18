import TimeEventModel from "@/models/time-event-model";
import store from "@/store/store";
import Zoomer from "../zooming/zoomer";

export default class ViewFocuser {
  private zoomer: Zoomer;
  private timelineElement: HTMLElement;
  private constructor() {
    this.zoomer = Zoomer.Instance;
    this.timelineElement = document.getElementById("timeline") as HTMLElement; // TODO: Redundant. Use timelineElement from store.
  }
  }

  /**
   * Changes zoom and view such that both the relative time positions for
   * left and right are visible including an additional margin on both sides.
   *
   * @param lowerDate Relative start of time range
   * @param higherDate Relative end of time range
   */
  public focusOnDateRange(lowerDate: number, higherDate: number) {
    const absoluteLeft =
      store.state.timelineZero + lowerDate * store.state.zoomLevel;

    const absoluteRight =
      store.state.timelineZero + higherDate * store.state.zoomLevel;

    this.checkOutOfBounds(absoluteLeft, absoluteRight);

    const absoluteDistance = absoluteRight - absoluteLeft;
    const margin = TimeEventModel.expandedWidth + 100;
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
    const position =
      timeEvent.positionCenter - this.timelineElement.clientWidth / 2;
    this.timelineElement.scrollTo({
      left: position
    });
  }

  private checkOutOfBounds(absoluteLeft: number, absoluteRight: number) {
    if (absoluteLeft < 0) {
      console.error("View Focuser: Start is out of bounds!");
    }

    if (
      absoluteRight >
        store.getters.spacerRight.positionLeft +
          store.getters.spacerRight.width &&
      absoluteRight >
        store.state.spacerPageEdge.positionLeft +
          store.state.spacerPageEdge.width
    ) {
      console.error("View Focuser: End is out of bounds!");
    }
  }

  private static instance: ViewFocuser;
  public static get Instance() {
    return this.instance || (this.instance = new this());
  }
}
