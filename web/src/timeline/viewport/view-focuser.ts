import TimeEventModel from "@/models/time-event/time-event-model";
import store from "@/store/store";
import Zoomer from "../zooming/zoomer";

export default class ViewFocuser {
  private zoomer: Zoomer;
  private timelineElement: HTMLElement;
  private constructor() {
    this.zoomer = Zoomer.Instance;
    this.timelineElement = store.state.timelineElement;
  }

  /**
   * Centers the specified timeEvent in the view.
   *
   * @param timeEvent The timeEvent to put focus on
   */
  public focusOnPosition(position: number) {
    this.timelineElement.scrollTo({
      left: position - this.timelineElement.clientWidth / 2
    });
  }

  /**
   * Changes zoom and view such that the specified timeEvent is visible including
   * an additional margin on both sides.
   *
   * @param timeEvent The timeEvent to move into the view.
   */
  public extendFocus(position: number) {
    if (position < this.timelineElement.scrollLeft) {
      this.focusOnRange(position, this.timelineElement.scrollWidth);
    } else if (position > this.timelineElement.scrollWidth) {
      this.focusOnRange(this.timelineElement.scrollLeft, position);
    } else {
      console.debug(
        "View Focuser: ExtendFocus did not extend view as timeEvent is within view."
      );
    }
  }

  /**
   * Changes zoom and view such that both the positions for left and right
   * are visible including an additional margin on both sides.
   *
   * @param left Absolute start of time range
   * @param right Absolute end of time range
   */
  public focusOnRange(left: number, right: number) {
    this.validate(left, right);

    const absoluteDistance = right - left;
    const margin = TimeEventModel.boxWidth + 100;
    const zoomFactor =
      1 / ((this.timelineElement.clientWidth - margin) / absoluteDistance);
    const absoluteCenter = left + absoluteDistance / 2;

    // TODO: Set distance to a minimum if events are too close
    // to each other and desired zoom level would be below
    // minimum zoom level. (Probably same for maximum case)
    this.zoomer.zoom(zoomFactor, absoluteCenter);

    this.timelineElement.scrollTo({
      left: absoluteCenter - this.timelineElement.clientWidth / 2
    });
  }

  private validate(left: number, right: number) {
    if (left - right === 0) {
      console.error("View Focuser: Absolute distance is 0!");
    }
  }

  private static instance: ViewFocuser;
  public static get Instance() {
    return this.instance || (this.instance = new this());
  }
}
