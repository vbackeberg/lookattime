import TimeEventModel from "@/models/time-event-model";
import TimeMarkerModel from "@/models/time-marker-model";
import store from "@/store/store";

export default class Zoomer {
  private constructor() {}

  /**
   * Moves all timeEvents towards or away from the reference position by the zoom factor.
   * Re-aligns spacer for right page edge.
   * Moves timeline zero.
   */
  public zoom(zoomFactor: number, referencePosition: number) {
    this.reposition(zoomFactor, referencePosition);
    store.state.zoomLevel *= zoomFactor;
  }

  private reposition(zoomFactor: number, referencePosition: number) {
    this.repositionTimeEvents(zoomFactor, referencePosition);
    this.repositionSpacerPageEdge();
    this.repositionSpacerLeft();
    this.repositionSpacerRight();
    this.repositionTimelineZero(zoomFactor, referencePosition);
    this.repositionTimeMarkers(zoomFactor, referencePosition);
  }

  /**
   *
   * @param zoomFactor The factor by which the distance between time event and reference position should shrink or grow
   * @param referencePosition The position the time event should approach to or depart from
   */
  private repositionTimeEvents(zoomFactor: number, referencePosition: number) {
    for (let i = 0; i < store.state.timeEvents.length; i++) {
      const distance =
        (store.state.timeEvents[i].positionCenter - referencePosition) *
        zoomFactor;

      const newPosition = referencePosition + distance;

      store.state.timeEvents[i].positionCenter = newPosition;

      store.state.timeEvents[i].htmlElement.style.transform =
        "translateX(" + newPosition + "px)";
    }
  }

  private repositionSpacerPageEdge() {
    const newPositionLeft =
      store.state.timelineElement.scrollLeft +
      store.state.timelineElement.clientWidth -
      store.state.spacerPageEdge.width;

    store.state.spacerPageEdge.htmlElement.style.transform =
      "translateX(" + newPositionLeft + "px)";
  }

  private repositionSpacerLeft() {
    const width =
      store.state.timelineElement.clientWidth / 2 -
      TimeEventModel.expandedWidthOffset;

    const newPositionLeft =
      store.state.timeEvents[0].positionCenter -
      TimeEventModel.expandedWidthOffset -
      width;

    store.state.spacerLeft.positionLeft = newPositionLeft;

    store.state.spacerLeft.htmlElement.style.transform =
      "translateX(" + newPositionLeft + "px)";
  }

  private repositionSpacerRight() {
    const width =
      store.state.timelineElement.clientWidth / 2 -
      TimeEventModel.expandedWidthOffset;

    const newPositionLeft =
      store.state.timeEvents[store.state.timeEvents.length - 1].positionCenter +
      TimeEventModel.expandedWidthOffset +
      width -
      store.state.spacerRight.width;

    store.state.spacerRight.positionLeft = newPositionLeft;

    store.state.spacerRight.htmlElement.style.transform =
      "translateX(" + newPositionLeft + "px)";
  }

  private repositionTimelineZero(
    zoomFactor: number,
    referencePosition: number
  ) {
    const distance =
      (store.state.timelineZero - referencePosition) * zoomFactor;
    const newPosition = referencePosition + distance;

    store.state.timelineZero = newPosition;
  }

  /**
   *
   * @param zoomFactor The factor by which the distance between time marker and reference position should shrink or grow
   * @param referencePosition The position the time marker should approach to or depart from
   */
  private repositionTimeMarkers(zoomFactor: number, referencePosition: number) {
    for (let i = 0; i < store.state.timeMarkers.length; i++) {
      // TODO: Try limit calculation to visible time markers only to increase performance.
      const distance =
        (store.state.timeMarkers[i].positionCenter - referencePosition) *
        zoomFactor;

      const newPosition = referencePosition + distance;

      store.state.timeMarkers[i].positionCenter = newPosition;

      const element = store.state.timeMarkers[i].htmlElement;
      element.style.transform =
        "translateX(" + (newPosition - TimeMarkerModel.widthOffset) + "px)";
    }
  }

  private static instance: Zoomer;
  public static get Instance() {
    return this.instance || (this.instance = new this());
  }
}
