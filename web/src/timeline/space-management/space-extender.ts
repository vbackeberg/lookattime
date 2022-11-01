import store from "@/store/store";
import Viewport from "../viewport/viewport";

/**
 * Extends space to the left by given distance. Takes care of removing animations during position shifting.
 */
export default class SpaceExtender {
  public static extendLeftSpace(
    timelineElement: HTMLElement,
    distance: number
  ) {
    const elements = document.getElementsByClassName("zoomable");
    for (let i = 0; i < elements.length; i++) {
      elements[i].classList.remove("zoom-transition");
    }

    this.repositionSpacerLeft(distance);
    this.repositionSpacerRight(distance);
    this.repositionSpacerViewportRight(distance);
    this.repositionTimeEvents(distance);
    this.repositionTimeMarkers(distance);

    store.state.timelineZero += distance;

    timelineElement.scrollBy(distance, 0);

    for (let i = 0; i < elements.length; i++) {
      elements[i].classList.add("zoom-transition");
    }
  }

  private static repositionSpacerLeft(distance: number) {
    store.state.spacerLeft.positionLeft += distance;
  }

  /**
   *
   * |------------------------- client width / 2 -------------------------|
   * |--- time event width offset ---|----------------------------------|-|
   * ↑                                                                  ↑
   * time event position center                           spacer position
   */
  private static repositionSpacerRight() {
    const width =
      store.state.timelineElement.clientWidth / 2 -
      TimeEventModel.boxWidthOffset;

    store.state.spacerRight.positionLeft =
      store.state.timeEvents[store.state.timeEvents.length - 1].positionCenter +
      TimeEventModel.boxWidthOffset +
      width -
      store.state.spacerRight.width;
  }

  private static repositionSpacerViewportRight(distance: number) {
    store.state.spacerViewportRight.positionLeft =
      Viewport.rightEdge() + distance - store.state.spacerViewportRight.width;
  }

  private static repositionTimeEvents(distance: number) {
    for (let i = 0; i < store.state.timeEvents.length; i++) {
      store.state.timeEvents[i].positionCenter += distance;
    }
  }

  private static repositionTimeMarkers(distance: number) {
    for (let i = 0; i < store.state.timeMarkers.length; i++) {
      store.state.timeMarkers[i].positionCenter += distance;
    }
  }
}
