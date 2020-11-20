import store from "@/store";

export default class Zoomer {
  private timelineElement: HTMLElement;

  private constructor() {
    this.timelineElement = document.getElementById("timeline") as HTMLElement;
  }

  /**
   * Moves all boxes towards or away from the mouse pointer by the zoom factor.
   * Re-aligns spacer for right page edge.
   * Moves timeline zero.
   */
  public zoom(zoomFactor: number, mousePosition: number) {
    this.reposition(zoomFactor, mousePosition);
    store.commit("changeZoomLevel", zoomFactor);
  }

  private reposition(zoomFactor: number, mousePosition: number) {
    this.repositionBoxes(zoomFactor, mousePosition);
    this.repositionSpacerPageEdge();
    this.repositionTimelineZero(zoomFactor, mousePosition);
  }

  private repositionBoxes(zoomFactor: number, mousePosition: number) {
    store.state.boxes.forEach(box => {
      const distance = (box.positionCenter - mousePosition) * zoomFactor;
      box.positionCenter = mousePosition + distance;
    });
  }

  private repositionSpacerPageEdge() {
    const newPositionLeft =
      this.timelineElement.scrollLeft +
      this.timelineElement.clientWidth -
      store.state.spacerPageEdge.width;

    store.commit("setSpacerPageEdgePosition", newPositionLeft);
  }

  private repositionTimelineZero(zoomFactor: number, mousePosition: number) {
    const distance = (store.state.timelineZero - mousePosition) * zoomFactor;
    const newPosition = mousePosition + distance;
    store.commit("setTimelineZero", newPosition);
  }
}
