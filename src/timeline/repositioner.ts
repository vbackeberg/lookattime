import BoxModel from "@/models/box-model";

export default class Repositioner {
  /**
   * Moves all boxes away from the mouse pointer by the zoom factor.
   * Then translates all box positions and the view into the positive space.
   */
  static zoomIn(
    boxes: BoxModel[],
    lowestBox: BoxModel,
    zoomFactor: number,
    mousePosition: number
  ) {
    this.reposition(boxes, zoomFactor, mousePosition);

    const distance = -lowestBox.positionLeft;
    if (distance > 0) {
      this.extendLeftSpace(boxes, distance);
    }
  }

  /**
   * Moves all boxes towards the mouse pointer by the zoom factor.
   * Moves all boxes and view to the left by the amount of the minimum of the lowest box' left edge and the views' left edge.
   */
  static zoomOut(
    boxes: BoxModel[],
    lowestBox: BoxModel,
    zoomFactor: number,
    mousePosition: number
  ) {
    this.reposition(boxes, zoomFactor, mousePosition);

    const distance = Math.min(lowestBox.positionLeft, window.pageXOffset);
    if (distance > 0) {
      this.cutLeftSpace(boxes, distance);
    }
  }

  private static reposition(
    boxes: BoxModel[],
    zoomFactor: number,
    mousePosition: number
  ) {
    boxes.forEach((box) => {
      const oldPositionLeft = box.positionLeft;

      const positionCenter = box.positionLeft + box.width / 2;

      const distance = (positionCenter - mousePosition) * zoomFactor;

      box.positionLeft = mousePosition + distance - box.width / 2;

      this.logPositions(
        box.id,
        zoomFactor,
        mousePosition,
        oldPositionLeft,
        box.positionLeft,
        distance
      );
    });
  }

  // TODO: On Zoom out, space on the right has to be preserved when right end of viewport would otherwise be moved to the left.
  // Currently, zooming out near the highest box does not move the highest box closer to the mouse which would be expected behaviour.
  private static cutLeftSpace(boxes: BoxModel[], distance: number) {
    console.log("cut space by " + distance);

    boxes.forEach((box) => {
      box.positionLeft -= distance;
    });

    window.scrollBy(-distance, 0);
  }

  private static extendLeftSpace(boxes: BoxModel[], distance: number) {
    console.log("extend space by " + distance);

    boxes.forEach((box) => {
      box.positionLeft += distance;
    });

    window.scrollBy(distance, 0);
  }

  private static logPositions(
    boxId: number,
    zoomFactor: number,
    mousePosition: number,
    oldPositionLeft: number,
    positionLeft: number,
    distance: number
  ) {
    console.log(
      "box " +
        boxId +
        " zoom factor " +
        zoomFactor +
        " mouse pos " +
        mousePosition +
        " old pos: " +
        oldPositionLeft +
        " new Pos: " +
        positionLeft +
        " distance: " +
        distance
    );
  }
}
