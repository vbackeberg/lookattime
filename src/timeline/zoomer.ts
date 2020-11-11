import store from "@/store";

export default class Zoomer {
  private timelineElement: Element;

  constructor(timelineElement: Element) {
    this.timelineElement = timelineElement;
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

  private logPositions() {
    store.state.boxes.forEach(box => {
      console.log("box " + box.id + " Pos center " + box.positionCenter);
    });

    console.log(
      "SpacerRight Pos " +
        store.getters.spacerRight.positionLeft +
        " SpacerLeft Pos " +
        store.getters.spacerLeft.positionLeft +
        " spacerPageEdge Pos " +
        store.state.spacerPageEdge.positionLeft +
        " timelineZero " +
        store.state.timelineZero
    );
  }
}
