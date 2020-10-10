import store from "@/store";
import Vue from "vue";

class Repositioner {
  private timeline = document.getElementById("timeline") as HTMLElement;

  /**
   * Moves all boxes away from the mouse pointer by the zoom factor.
   * Then moves all boxes and the view into the positive space.
   */
  public zoomIn(zoomFactor: number, mousePosition: number) {
    console.log("_________________________________________");
    console.log("zoom factor " + zoomFactor + " mouse pos " + mousePosition);

    this.timeline = document.getElementById("timeline") as HTMLElement;

    this.reposition(zoomFactor, mousePosition);

    this.logPositions();

    const requiredLeftSpace = -store.state.spacerLowestBox.positionLeft;

    if (requiredLeftSpace > 0) {
      this.extendLeftSpace(requiredLeftSpace);
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
    
    this.reposition(zoomFactor, mousePosition);
    
    this.logPositions();

    const expendableLeftSpace = Math.min(
      store.state.spacerLowestBox.positionLeft,
      this.timeline.scrollLeft
    );

    if (expendableLeftSpace > 0) {
      this.cutLeftSpace(expendableLeftSpace);
    }

    store.commit("changeZoomLevel", zoomFactor);
  }

  private reposition(zoomFactor: number, mousePosition: number) {
    this.repositionBoxes(zoomFactor, mousePosition);
    this.repositionSpacerHighestBox();
    this.repositionSpacerLowestBox();
    this.repositionTimelineZero(zoomFactor, mousePosition);
  }

  private repositionBoxes(zoomFactor: number, mousePosition: number) {
    store.state.boxes.forEach(box => {
      const distance = (box.positionCenter - mousePosition) * zoomFactor;
      box.positionCenter = mousePosition + distance;
    });
  }

  private repositionSpacerLowestBox() {
    const lowestBox = store.state.boxes[0];
    const newPositionLeft =
      lowestBox.positionCenter -
      lowestBox.width / 2 -
      store.state.spacerLowestBox.width;

    store.commit("setSpacerLowestBoxPosition", newPositionLeft);
  }

  private repositionSpacerHighestBox() {
    const highestBox = store.state.boxes[store.state.boxes.length - 1];
    const newPositionLeft = highestBox.positionCenter + highestBox.width / 2;

    store.commit("setSpacerHighestBoxPosition", newPositionLeft);
  }

  private repositionTimelineZero(zoomFactor: number, mousePosition: number) {
    const distance = (store.state.timelineZero - mousePosition) * zoomFactor;
    const newPosition = mousePosition + distance;
    store.commit("setTimelineZero", newPosition);
  }

  private cutLeftSpace(distance: number) {
    console.log("cut space left by " + distance);

    store.state.boxes.forEach(box => {
      box.positionCenter -= distance;
    });

    store.commit(
      "setSpacerLowestBoxPosition",
      store.state.spacerLowestBox.positionLeft - distance
    );

    store.commit(
      "setSpacerHighestBoxPosition",
      store.state.spacerHighestBox.positionLeft - distance
    );

    store.commit(
      "setSpacerPageEdgePosition",
      this.timeline.scrollLeft +
        this.timeline.clientWidth -
        distance -
        store.state.spacerPageEdge.width
    );

    store.commit("setTimelineZero", store.state.timelineZero - distance);

    this.timeline.scrollBy(-distance, 0);
  }

  private extendLeftSpace(distance: number) {
    console.log("extend space left by " + distance);

    store.state.boxes.forEach(box => {
      box.positionCenter += distance;
    });

    store.commit(
      "setSpacerLowestBoxPosition",
      store.state.spacerLowestBox.positionLeft + distance
    );

    store.commit(
      "setSpacerHighestBoxPosition",
      store.state.spacerHighestBox.positionLeft + distance
    );

    store.commit(
      "setSpacerPageEdgePosition",
      this.timeline.scrollLeft +
        this.timeline.clientWidth +
        distance -
        store.state.spacerPageEdge.width
    );

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
