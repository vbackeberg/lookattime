import TimeEventModel from "@/models/time-event-model";
import store from "@/store/store";
import Viewport from "../viewport/viewport";

export default class SpaceAllocator {
  /**
   * Extends space to the left by given distance.
   * Takes care of removing animations during position shifting.
   *
   * The view scrolls right after spacers are repositioned because
   * the browser does not allow scrolling to a position where the
   * views right edge is at a position higher than any element on
   * the screen.
   */
  public static extendLeftSpace(
    timelineElement: HTMLElement,
    distance: number
  ) {
    const elements = document.getElementsByClassName("zoomable");
    this.removeZoomAnimation(elements);

    this.extendSpacerViewportRight(distance);
    this.repositionElements(distance);

    timelineElement.scrollBy(distance, 0);

    this.addZoomAnimation(elements);
  }

  /**
   * Cuts expendable space on the left by given distance.
   * Takes care of removing animations during position shifting.
   *
   * The view scrolls left before spacers are repositioned because
   * the browser might otherwise move the view by itself if the
   * views right edge were at a position higher than any element on
   * the screen.
   */
  public static cutoffLeftSpace(
    timelineElement: HTMLElement,
    distance: number
  ) {
    const elements = document.getElementsByClassName("zoomable");
    this.removeZoomAnimation(elements);

    timelineElement.scrollBy(-distance, 0);

    this.retractSpacerViewportRight();
    this.repositionElements(-distance);

    this.addZoomAnimation(elements);
  }

  private static removeZoomAnimation(elements: HTMLCollectionOf<Element>) {
    for (let i = 0; i < elements.length; i++) {
      elements[i].classList.remove("zoom-transition");
    }
  }

  private static addZoomAnimation(elements: HTMLCollectionOf<Element>) {
    for (let i = 0; i < elements.length; i++) {
      elements[i].classList.add("zoom-transition");
    }
  }

  private static repositionElements(distance: number) {
    this.repositionSpacerLeft(distance);
    this.repositionTimeEvents(distance);
    this.repositionTimeMarkers(distance);
    this.repositionSpacerRight();
    store.state.timelineZero += distance;
  }

  private static repositionSpacerLeft(distance: number) {
    store.state.spacerLeft.positionLeft += distance;
  }

  /**
   *
   * |------------------------- client width / 2 -------------------------|
   * |------ time event width -------|----- time event width offset ----|-|
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

  private static retractSpacerViewportRight() {
    store.state.spacerViewportRight.positionLeft =
      Viewport.rightEdge() - store.state.spacerViewportRight.width;
  }

  private static extendSpacerViewportRight(distance: number) {
    store.state.spacerViewportRight.positionLeft =
      Viewport.rightEdge() + distance - store.state.spacerViewportRight.width;
  }
}
