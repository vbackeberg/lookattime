import store from "@/store";
import Vue from "vue";

class RepositionerInstance {
  private timeline: HTMLElement;

  public constructor() {
    this.timeline = document.getElementById("timeline") as HTMLElement;
  }

  /**
   * Moves all boxes away from the mouse pointer by the zoom factor.
   * Then moves all boxes and the view into the positive space.
   */
  public zoomIn(zoomFactor: number, mousePosition: number) {
    console.log("_________________________________________");
    console.log("zoom factor " + zoomFactor + " mouse pos " + mousePosition);

    this.timeline = document.getElementById("timeline") as HTMLElement;

    this.repositionBoxes(zoomFactor, mousePosition);
    this.repositionSpacerHighestBox(zoomFactor, mousePosition);

    this.logPositions();

    const distance = -store.state.boxes[0].positionLeft;

    if (distance > 0) {
      this.extendLeftSpace(distance);
    }
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
    this.repositionSpacerHighestBox(zoomFactor, mousePosition);

    this.logPositions();

    const distance = Math.min(
      store.state.boxes[0].positionLeft,
      this.timeline.scrollLeft
    );

    if (distance > 0) {
      this.cutLeftSpace(distance);
    }
  }

  /**
   * Repositions boxes by individual distances resulting from zoom and mouse position.
   */
  private repositionBoxes(zoomFactor: number, mousePosition: number) {
    store.state.boxes.forEach(box => {
      const positionCenter = box.positionLeft + box.width / 2;
      const distance = (positionCenter - mousePosition) * zoomFactor;

      box.positionLeft = mousePosition + distance - box.width / 2;
    });
  }

  /**
   * Repositions spacer according to highest box.
   */
  private repositionSpacerHighestBox(zoomFactor: number, mousePosition: number) {
    const boxes = store.state.boxes;
    const highestBox = boxes[boxes.length - 1];

    store.state.spacerHighestBox.positionLeft =
      highestBox.positionLeft + highestBox.width;
  }

  private cutLeftSpace(distance: number) {
    console.log("cut space left by " + distance);

    store.state.boxes.forEach(box => {
      box.positionLeft -= distance;
    });

    store.state.spacerHighestBox.positionLeft -= distance;
    store.state.spacerPageEdge.positionLeft =
      this.timeline.scrollLeft +
      this.timeline.clientWidth -
      distance -
      store.state.spacerPageEdge.width;

    store.commit("changeTimelineZero", -distance);

    this.timeline.scrollBy(-distance, 0);
  }

  private extendLeftSpace(distance: number) {
    console.log("extend space left by " + distance);

    store.state.boxes.forEach(box => {
      box.positionLeft += distance;
    });

    store.state.spacerHighestBox.positionLeft += distance;
    store.state.spacerPageEdge.positionLeft =
      this.timeline.scrollLeft +
      this.timeline.clientWidth +
      distance -
      store.state.spacerPageEdge.width;

    store.commit("changeTimelineZero", distance);

    Vue.nextTick(() => {
      this.timeline.scrollBy(distance, 0);
    });
  }

  private logPositions() {
    store.state.boxes.forEach(box => {
      console.log("box " + box.id + " Pos " + box.positionLeft);
    });

    console.log(
      "spacerHighestBox Pos " +
        store.state.spacerHighestBox.positionLeft +
        " spacerPageEdge Pos " +
        store.state.spacerPageEdge.positionLeft
    );
  }
}
export default new RepositionerInstance();
