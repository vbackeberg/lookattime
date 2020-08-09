import BoxModel from "@/models/box-model";

export default class Repositioner {
  static zoomIn(
    boxes: BoxModel[],
    lowestBox: BoxModel,
    zoomFactor: number,
    mousePosition: number
  ) {
    this.reposition(boxes, lowestBox, zoomFactor, mousePosition);
    this.extendSpace(boxes, lowestBox);
  }

  static zoomOut(
    boxes: BoxModel[],
    lowestBox: BoxModel,
    zoomFactor: number,
    mousePosition: number
  ) {
    this.reposition(boxes, lowestBox, zoomFactor, mousePosition);
    this.cutSpace(boxes);
  }

  static reposition(
    boxes: BoxModel[],
    lowestBox: BoxModel,
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

  static cutSpace(boxes: BoxModel[]) {
    const distance = window.pageXOffset * -1;

    boxes.forEach((box) => {
      box.positionLeft += distance;
    });

    window.scrollBy(distance, 0);
  }

  static extendSpace(boxes: BoxModel[], lowestBox: BoxModel) {
    const lowestBoxPositionLeft = lowestBox.positionLeft;

    boxes.forEach((box) => {
      box.positionLeft -= lowestBoxPositionLeft;
    });

    const screenXNew = window.screenX - lowestBoxPositionLeft;
    window.scrollBy(screenXNew, 0);
  }

  static logPositions(
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
