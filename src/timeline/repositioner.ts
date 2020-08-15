import BoxModel from "@/models/box-model";

export default class Repositioner {
  static zoomIn(
    boxes: BoxModel[],
    lowestBox: BoxModel,
    zoomFactor: number,
    mousePosition: number
  ) {
    this.reposition(boxes, zoomFactor, mousePosition);

    if (lowestBox.positionLeft < 0) {
      this.extendLeftSpace(boxes, lowestBox);
    }
  }

  static zoomOut(
    boxes: BoxModel[],
    lowestBox: BoxModel,
    zoomFactor: number,
    mousePosition: number
  ) {
    this.reposition(boxes, zoomFactor, mousePosition);

    // TODO After zoom in, scroll right, zoom out. It will cut space so that boxes aren't visible anymore.
    // Most likely, there is an issue with window.screenX unexpectedly taking the value of 0.
    console.log(
      "lowestBox position left: " +
        lowestBox.positionLeft +
        "window screenX: " +
        window.screenX +
        "window pageXOffset" +
        window.pageXOffset
    );
    if (lowestBox.positionLeft > window.screenX && window.pageXOffset > 0) {
      this.cutLeftSpace(boxes);
    }
  }

  static reposition(
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

  static cutLeftSpace(boxes: BoxModel[]) {
    console.log("cut space");

    const distance = window.pageXOffset * -1;

    boxes.forEach((box) => {
      box.positionLeft += distance;
    });

    window.scrollBy(distance, 0);
  }

  static extendLeftSpace(boxes: BoxModel[], lowestBox: BoxModel) {
    const distance = lowestBox.positionLeft;

    console.log("extend space by " + distance);

    boxes.forEach((box) => {
      box.positionLeft -= distance;
    });

    const screenXNew = window.screenX - distance;
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
