import store from "@/store";

export default class Zoomer {
  private timelineElement: HTMLElement;

  private constructor() {
    this.timelineElement = document.getElementById("timeline") as HTMLElement;
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
    this.repositionTimelineZero(zoomFactor, referencePosition);
    this.repositionTimeMarkers(zoomFactor, referencePosition);
  }

  private repositionTimeEvents(zoomFactor: number, referencePosition: number) {
    store.state.timeEvents.forEach(timeEvent => {
      const distance = (timeEvent.positionCenter - referencePosition) * zoomFactor;
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
