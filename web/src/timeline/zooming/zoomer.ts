import TimeEventModel from "@/models/time-event/time-event-model";
import PositionTranslator from "../position-translator";
import { Constants } from "./constants";
import { useLookAtTime } from "@/store/store";

export default class Zoomer {
  private positionTranslator = PositionTranslator.Instance;
  private constructor(private store = useLookAtTime()) { }

  /**
   * Moves all timeEvents towards or away from the reference position by the zoom factor.
   * Re-aligns spacer for right page edge.
   * Moves timeline zero.
   */
  public zoom(zoomFactor: number, referencePosition: number) {
    const newZoomLevel = this.store.zoomLevel * zoomFactor;
    if (this.zoomLevelInBounds(newZoomLevel)) {
      this.store.zoomLevel = newZoomLevel;
      this.reposition(zoomFactor, referencePosition);
    }
  }

  private reposition(zoomFactor: number, referencePosition: number) {
    this.repositionTimelineZero(zoomFactor, referencePosition);
    this.repositionTimeEvents();
    this.repositionSpacerLeft();
    this.repositionTimeMarkers();

    document.dispatchEvent(new Event("update-expansion-states"));
  }

  private repositionTimeEvents() {
    for (let i = 0; i < this.store.timeEvents.length; i++) {
      const newPositionCenter = this.positionTranslator.toAbsolutePosition(
        this.store.timeEvents[i].date
      );

      this.store.timeEvents[i].positionCenter = newPositionCenter;
    }
  }

  /**
   *
   * |------------------------- client width / 2 -------------------------|
   * |-|----------------------------------|--- time event width offset ---|
   * ↑                                                                    ↑
   * spacer position                             time event position center
   */
  private repositionSpacerLeft() {
    const width =
      this.store.timelineElement!.clientWidth / 2 -
      TimeEventModel.boxWidthOffset;

    this.store.spacerLeft!.positionLeft =
      this.store.timeEvents[0].positionCenter -
      TimeEventModel.boxWidthOffset -
      width;
  }

  /**
   * Calculates the new position of `timelineZero` taking into account
   * its current distance to the reference point (mouse pointer location)
   * and the zoom factor.
   *
   * `TimelineZero` is the basis for every other repositioning.
   *
   * @example
   * zoomFactor: 1.1
   * timelineZero: 270 (current position)
   * referencePosition: 50
   *
   * distance = (270 - 50) / 1.1 = 220 / 1.1 = 200
   * newPosition = 50 + 200 = 250
   *
   * @param zoomFactor a number (slightly) below or above 1 that indicates how strong to zoom in / out
   * @param referencePosition the location of the mouse pointer
   */
  private repositionTimelineZero(
    zoomFactor: number,
    referencePosition: number
  ) {
    const distance =
      (this.store.timelineZero - referencePosition) / zoomFactor;
    const newPosition = referencePosition + distance;

    this.store.timelineZero = newPosition;
  }

  private repositionTimeMarkers() {
    for (let i = 0; i < this.store.timeMarkers.length; i++) {
      const newPosition = this.positionTranslator.toAbsolutePosition(
        this.store.timeMarkers[i].date
      );

      this.store.timeMarkers[i].positionCenter = newPosition;
    }
  }
  private zoomLevelInBounds(newZoomLevel: number) {
    if (
      Math.abs(newZoomLevel) < Constants.MAX_ZOOM_LEVEL &&
      Math.abs(newZoomLevel) >= Constants.MIN_ZOOM_LEVEL
    )
      return true;
  }

  private static instance: Zoomer;
  public static get Instance() {
    return this.instance || (this.instance = new this());
  }
}
