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
    this.repositionTimelineZero(zoomFactor, referencePosition);
    this.repositionTimeMarkers(zoomFactor, referencePosition);
  }

  private repositionTimeEvents(zoomFactor: number, referencePosition: number) {
    store.state.timeEvents.forEach(timeEvent => {
      const distance =
        (timeEvent.positionCenter - referencePosition) * zoomFactor;
      timeEvent.positionCenter = referencePosition + distance;
    });
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

    console.log("store.state.timelineElement.clientWidth: ", store.state.timelineElement.clientWidth);
    console.log("width: ", width);

    store.state.spacerLeft.positionLeft =
      store.state.timeEvents[0].positionCenter -
      TimeEventModel.expandedWidth / 2 -
      width;

    store.state.spacerLeft.width = width;
  }

  private repositionTimelineZero(
    zoomFactor: number,
    referencePosition: number
  ) {
    const distance =
      (store.state.timelineZero - referencePosition) * zoomFactor;
    const newPosition = referencePosition + distance;
    store.commit("setTimelineZero", newPosition);
  }

  private repositionTimeMarkers(zoomFactor: number, referencePosition: number) {
    store.state.timeMarkers.forEach(timeMarker => {
      const distance =
        (timeMarker.positionCenter - referencePosition) * zoomFactor;
      timeMarker.positionCenter = referencePosition + distance;
    });
  }

  private static instance: Zoomer;
  public static get Instance() {
    return this.instance || (this.instance = new this());
  }
}
