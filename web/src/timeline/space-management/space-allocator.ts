import TimeEventModel from "@/models/time-event/time-event-model";
import { useLookAtTime } from "@/store/store";
import Viewport from "../viewport/viewport";

export default class SpaceAllocator {
  private constructor(private store = useLookAtTime()) { }

  private viewport = Viewport.Instance;

  /**
   * Extends space to the left by given distance.
   * Takes care of removing animations during position shifting.
   *
   * The view scrolls right after spacers are repositioned because
   * the browser does not allow scrolling to a position where the
   * views right edge is at a position higher than any element on
   * the screen.
   */
  public extendLeftSpace(
    timelineElement: HTMLElement,
    distance: number
  ) {
    this.removeZoomAnimation();

    this.extendSpacerViewportRight(distance);
    this.repositionElements(distance);

    timelineElement.scrollBy(distance, 0);

    this.addZoomAnimation();
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
  public cutoffLeftSpace(
    timelineElement: HTMLElement,
    distance: number
  ) {
    this.removeZoomAnimation();

    timelineElement.scrollBy(-distance, 0);

    this.retractSpacerViewportRight();
    this.repositionElements(-distance);

    this.addZoomAnimation();
  }

  private removeZoomAnimation() {
    const root = document.documentElement;
    root.style.setProperty("--transition-property", "none");
  }

  private addZoomAnimation() {
    const root = document.documentElement;
    root.style.setProperty("--transition-property", "transform");
  }

  private repositionElements(distance: number) {
    this.repositionSpacerLeft(distance);
    this.repositionTimeEvents(distance);
    this.repositionTimeMarkers(distance);
    this.repositionSpacerRight();
    this.store.timelineZero += distance;
  }

  private repositionSpacerLeft(distance: number) {
    this.store.spacerLeft!.positionLeft += distance;
  }

  /**
   *
   * |------------------------- client width / 2 -------------------------|
   * |------ time event width -------|----- time event width offset ----|-|
   * ↑                                                                  ↑
   * time event position center                           spacer position
   */
  private repositionSpacerRight() {
    const width =
      this.store.timelineElement!.clientWidth / 2 -
      TimeEventModel.boxWidthOffset;

    this.store.spacerRight!.positionLeft =
      this.store.timeEvents[this.store.timeEvents.length - 1].positionCenter +
      TimeEventModel.boxWidthOffset +
      width -
      this.store.spacerRight!.width;
  }

  private repositionTimeEvents(distance: number) {
    for (let i = 0; i < this.store.timeEvents.length; i++) {
      this.store.timeEvents[i].positionCenter += distance;
    }
  }

  private repositionTimeMarkers(distance: number) {
    for (let i = 0; i < this.store.timeMarkers.length; i++) {
      this.store.timeMarkers[i].positionCenter += distance;
    }
  }

  private retractSpacerViewportRight() {
    this.store.spacerViewportRight!.positionLeft =
      this.viewport.rightEdge() - this.store.spacerViewportRight!.width;
  }

  private extendSpacerViewportRight(distance: number) {
    this.store.spacerViewportRight!.positionLeft =
      this.viewport.rightEdge() + distance - this.store.spacerViewportRight!.width;
  }

  private static instance: SpaceAllocator;
  public static get Instance() {
    return this.instance || (this.instance = new this());
  }
}
