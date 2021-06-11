import TimeEventModel from "@/models/time-event-model";
import store from "@/store/store";

export default class Zoomer {
  private timelineElement: HTMLElement;

  private constructor() {
    this.timelineElement = store.state.timelineElement;
  }

  /**
   * Moves all timeEvents towards or away from the reference position by the zoom factor.
   * Re-aligns spacer for right page edge.
   * Moves timeline zero.
   */
  public zoom(zoomFactor: number, referencePosition: number) {
    this.reposition(zoomFactor, referencePosition);
    store.commit("changeZoomLevel", zoomFactor);
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
      store.state.timeEvents[i].positionCenter = referencePosition + distance;
    }
  }

  private repositionSpacerPageEdge() {
    const newPositionLeft =
      this.timelineElement.scrollLeft +
      this.timelineElement.clientWidth -
      store.state.spacerPageEdge.width;

    store.commit("setSpacerPageEdgePosition", newPositionLeft);
  }

  private repositionSpacerLeft() {
    const width =
      store.state.timelineElement.clientWidth / 2 -
      TimeEventModel.expandedWidth / 2;

    store.state.spacerLeft.positionLeft =
      store.state.timeEvents[0].positionCenter -
      TimeEventModel.expandedWidth / 2 -
      width;

    store.state.spacerLeft.width = width;
  }

  private repositionSpacerRight() {
    store.state.spacerRight.positionLeft =
      store.state.timeEvents[store.state.timeEvents.length - 1].positionCenter +
      TimeEventModel.expandedWidth / 2;

    store.state.spacerRight.width =
      store.state.timelineElement.clientWidth / 2 -
      TimeEventModel.expandedWidth / 2;
  }

  private repositionTimelineZero(
    zoomFactor: number,
    referencePosition: number
  ) {
    const distance =
      (store.state.timelineZero - referencePosition) * zoomFactor;
    const newPosition = referencePosition + distance;
    store.commit("setTimelineZero", newPosition); // TODO: exchange commit with regular assignment for performance reasons.
  }

  /**
   *
   * @param zoomFactor The factor by which the distance between time marker and reference position should shrink or grow
   * @param referencePosition The position the time marker should approach to or depart from
   */
  private repositionTimeMarkers(zoomFactor: number, referencePosition: number) {
    for (let i = 0; i < store.state.timeMarkers.length; i++) {
      const distance =
        (store.state.timeMarkers[i].positionCenter - referencePosition) *
        zoomFactor;
      store.state.timeMarkers[i].positionCenter = referencePosition + distance;
    }
  }

  private static instance: Zoomer;
  public static get Instance() {
    return this.instance || (this.instance = new this());
  }
}
