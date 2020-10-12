import store from "@/store";
import Vue from "vue";

//TODO: rename to zoomer
class Repositioner {
  //TODO: move this to space extender
  /**
   * Extends space based on new spacer positions.
   * Separately called when adding new boxes.
   */
  public extendSpaceOnInsert() {
    this.repositionSpacerRight();
    this.repositionSpacerLeft();

    const requiredLeftSpace = -store.state.SpacerLeft.positionLeft;
    if (requiredLeftSpace > 0) {
      this.extendLeftSpace(requiredLeftSpace);
    }
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

    const timeline = document.getElementById("timeline") as HTMLElement;

    this.reposition(zoomFactor, mousePosition);

    this.logPositions();

    store.commit("changeZoomLevel", zoomFactor);
  }

  private reposition(zoomFactor: number, mousePosition: number) {
    this.repositionBoxes(zoomFactor, mousePosition);
    this.repositionSpacerRight();
    this.repositionSpacerLeft();
    this.repositionTimelineZero(zoomFactor, mousePosition);
  }

  private repositionBoxes(zoomFactor: number, mousePosition: number) {
    store.state.boxes.forEach(box => {
      const distance = (box.positionCenter - mousePosition) * zoomFactor;
      box.positionCenter = mousePosition + distance;
    });
  }

  private repositionSpacerLeft() {
    const lowestBox = store.state.boxes[0];
    const newPositionLeft =
      lowestBox.positionCenter -
      lowestBox.width / 2 -
      store.state.SpacerLeft.width;

    store.commit("setSpacerLeftPosition", newPositionLeft);
  }

  private repositionSpacerRight() {
    const highestBox = store.state.boxes[store.state.boxes.length - 1];
    const newPositionLeft = highestBox.positionCenter + highestBox.width / 2;

    store.commit("setSpacerRightPosition", newPositionLeft);
  }

  private repositionTimelineZero(zoomFactor: number, mousePosition: number) {
    const distance = (store.state.timelineZero - mousePosition) * zoomFactor;
    const newPosition = mousePosition + distance;
    store.commit("setTimelineZero", newPosition);
  }

  private extendLeftSpace(distance: number) {
    console.log("extend space left by " + distance);

    store.state.boxes.forEach(box => {
      box.positionCenter += distance;
    });

    store.commit(
      "setSpacerLeftPosition",
      store.state.SpacerLeft.positionLeft + distance
    );

    store.commit(
      "setSpacerRightPosition",
      store.state.SpacerRight.positionLeft + distance
    );

    const timelineElement = document.getElementById("timeline") as HTMLElement;
    store.commit(
      "setSpacerPageEdgePosition",
      timelineElement.scrollLeft +
        timelineElement.clientWidth +
        distance -
        store.state.spacerPageEdge.width
    );

    store.commit("setTimelineZero", store.state.timelineZero + distance);

    Vue.nextTick(() => {
      timelineElement.scrollBy(distance, 0);
    });
  }

  private logPositions() {
    store.state.boxes.forEach(box => {
      console.log("box " + box.id + " Pos center " + box.positionCenter);
    });

    console.log(
      "SpacerRight Pos " +
        store.state.SpacerRight.positionLeft +
        " SpacerLeft Pos " +
        store.state.SpacerLeft.positionLeft +
        " spacerPageEdge Pos " +
        store.state.spacerPageEdge.positionLeft +
        " timelineZero " +
        store.state.timelineZero
    );
  }
}
export default new Repositioner();
