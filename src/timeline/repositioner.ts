import SpacerModel from '@/models/spacer-model';
import store from "@/store";
import Vue from "vue";

export default class Repositioner {

  private timelineElement: Element;

  constructor(timelineElement: Element) {
    this.timelineElement = timelineElement;
  }

  /**
   * Moves all boxes away from the mouse pointer by the zoom factor.
   * Then moves all boxes and the view into the positive space.
   */
  public zoomIn(zoomFactor: number, mousePosition: number) {
    console.log("_________________________________________");
    console.log("zoom factor " + zoomFactor + " mouse pos " + mousePosition);

    this.reposition(zoomFactor, mousePosition);

    this.logPositions();

    store.commit("changeZoomLevel", zoomFactor);
  }

  /**
   * Moves all boxes towards the mouse pointer by the zoom factor.
   * Then moves all boxes and the view to the left by the amount of the minimum of the lowest box' left edge and the views' left edge.
   */
  public zoomOut(zoomFactor: number, mousePosition: number) {
    console.log("_________________________________________");
    console.log("zoom factor " + zoomFactor + " mouse pos " + mousePosition);

    this.reposition(zoomFactor, mousePosition);

    this.logPositions();

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
      SpacerModel.width;

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
