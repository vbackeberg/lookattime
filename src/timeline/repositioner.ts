import store from "@/store";
import Vue from "vue";

class Repositioner {
  //TODO: only retrieve timeline element once.
  private timeline = document.getElementById("timeline") as HTMLElement;

  /**
   * Moves all boxes away from the mouse pointer by the zoom factor.
   * Then moves all boxes and the view into the positive space.
   */
  public zoomIn(zoomFactor: number, mousePosition: number) {
    console.log("_________________________________________");
    console.log("zoom factor " + zoomFactor + " mouse pos " + mousePosition);

    this.timeline = document.getElementById("timeline") as HTMLElement;

    this.repositionBoxes(zoomFactor, mousePosition);
    this.repositionSpacerHighestBox();
    this.repositionSpacerLowestBox();
    this.repositionTimelineZero(zoomFactor, mousePosition);

    this.logPositions();

    const distance = -store.state.spacerLowestBox.positionLeft;

    if (distance > 0) {
      this.extendLeftSpace(distance);
    }

    store.commit("changeZoomLevel", zoomFactor);
  }

  /**
   * Moves all boxes towards the mouse pointer by the zoom factor.
   * Then moves all boxes and the view to the left by the amount of the minimum of the lowest box' left edge and the views' left edge.
   */
  public zoomOut(zoomFactor: number, mousePosition: number) {
    console.log("_________________________________________");
    console.log("zoom factor " + zoomFactor + " mouse pos " + mousePosition);

    this.timeline = document.getElementById("timeline") as HTMLElement;

    this.repositionBoxes(zoomFactor, mousePosition);
    this.repositionSpacerHighestBox();
    this.repositionSpacerLowestBox();
    this.repositionTimelineZero(zoomFactor, mousePosition);

    this.logPositions();

    //TODO: 1. add spacer lowest box.
    const distance = Math.min(
      store.state.spacerLowestBox.positionLeft,
      this.timeline.scrollLeft
    );

    // TODO: 2. distance will never be <0 and rarely = 0. Remove this if block.
    if (distance > 0) {
      this.cutLeftSpace(distance);
    }

    store.commit("changeZoomLevel", zoomFactor);
  }

  private repositionBoxes(zoomFactor: number, mousePosition: number) {
    store.state.boxes.forEach(box => {
      const distance = (box.positionCenter - mousePosition) * zoomFactor;
      box.positionCenter = mousePosition + distance;
    });
  }

  private repositionSpacerLowestBox() {
    const lowestBox = store.state.boxes[0];
    const spacerLowestBox = store.state.spacerLowestBox;

    spacerLowestBox.positionLeft =
      lowestBox.positionCenter - lowestBox.width / 2 - spacerLowestBox.width;
  }

  private repositionSpacerHighestBox() {
    const boxes = store.state.boxes;
    const highestBox = boxes[boxes.length - 1];

    store.state.spacerHighestBox.positionLeft =
      highestBox.positionCenter + highestBox.width / 2;
  }

  private repositionTimelineZero(zoomFactor: number, mousePosition: number) {
    const distance = (store.state.timelineZero - mousePosition) * zoomFactor;
    const timelineZero = mousePosition + distance;
    store.commit("setTimelineZero", timelineZero);
  }

  private cutLeftSpace(distance: number) {
    console.log("cut space left by " + distance);

    store.state.boxes.forEach(box => {
      box.positionCenter -= distance;
    });

    store.state.spacerHighestBox.positionLeft -= distance;
    store.state.spacerLowestBox.positionLeft -= distance;

    store.state.spacerPageEdge.positionLeft =
      this.timeline.scrollLeft +
      this.timeline.clientWidth -
      distance -
      store.state.spacerPageEdge.width;

    store.commit("setTimelineZero", store.state.timelineZero - distance);

    this.timeline.scrollBy(-distance, 0);
  }

  private extendLeftSpace(distance: number) {
    console.log("extend space left by " + distance);

    store.state.boxes.forEach(box => {
      box.positionCenter += distance;
    });

    store.state.spacerHighestBox.positionLeft += distance;
    store.state.spacerLowestBox.positionLeft += distance;

    store.state.spacerPageEdge.positionLeft =
      this.timeline.scrollLeft +
      this.timeline.clientWidth +
      distance -
      store.state.spacerPageEdge.width;

    store.commit("setTimelineZero", store.state.timelineZero + distance);

    Vue.nextTick(() => {
      this.timeline.scrollBy(distance, 0);
    });
  }

  private logPositions() {
    store.state.boxes.forEach(box => {
      console.log("box " + box.id + " Pos center " + box.positionCenter);
    });

    console.log(
      "spacerHighestBox Pos " +
        store.state.spacerHighestBox.positionLeft +
        " spacerLowestBox Pos " +
        store.state.spacerLowestBox.positionLeft +
        " spacerPageEdge Pos " +
        store.state.spacerPageEdge.positionLeft +
        " timelineZero " +
        store.state.timelineZero
    );
  }
}
export default new Repositioner();
