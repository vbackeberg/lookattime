import BoxModel from "@/models/box-model";
import SpacerModel from "@/models/spacer-model";

export default class Repositioner {
  /**
   * Moves all boxes away from the mouse pointer by the zoom factor.
   * Then moves all boxes and the view into the positive space.
   */
  static zoomIn(
    boxes: BoxModel[],
    lowestBox: BoxModel,
    zoomFactor: number,
    mousePosition: number,
    spacerHighestBox: SpacerModel,
    spacerPageEdge: SpacerModel
  ) {
    console.log("_________________________________________");
    console.log("zoom factor " + zoomFactor + " mouse pos " + mousePosition);

    this.reposition(boxes, spacerHighestBox, zoomFactor, mousePosition);

    this.logPositions(boxes, spacerHighestBox, spacerPageEdge);

    const distance = -lowestBox.positionLeft;
    if (distance > 0) {
      this.extendLeftSpace(boxes, distance, spacerHighestBox, spacerPageEdge);
    }

    this.logPositions(boxes, spacerHighestBox, spacerPageEdge);
  }

  /**
   * Moves all boxes towards the mouse pointer by the zoom factor.
   * Then moves all boxes and the view to the left by the amount of the minimum of the lowest box' left edge and the views' left edge.
   */
  static zoomOut(
    boxes: BoxModel[],
    lowestBox: BoxModel,
    zoomFactor: number,
    mousePosition: number,
    spacerHighestBox: SpacerModel,
    spacerPageEdge: SpacerModel
  ) {
    console.log("_________________________________________");
    console.log("zoom factor " + zoomFactor + " mouse pos " + mousePosition);

    this.reposition(boxes, spacerHighestBox, zoomFactor, mousePosition);

    this.logPositions(boxes, spacerHighestBox, spacerPageEdge);

    const distance = Math.min(lowestBox.positionLeft, window.pageXOffset);
    if (distance > 0) {
      this.cutLeftSpace(boxes, distance, spacerHighestBox, spacerPageEdge);
    }

    this.logPositions(boxes, spacerHighestBox, spacerPageEdge);
  }

  /**
   * Repositions boxes by individual distances resulting from zoom and mouse position.
   * Repositions spacer according to highest box.
   */
  private static reposition(
    boxes: BoxModel[],
    spacerHighestBox: SpacerModel,
    zoomFactor: number,
    mousePosition: number
  ) {
    boxes.forEach(box => {
      const positionCenter = box.positionLeft + box.width / 2;

      const distance = (positionCenter - mousePosition) * zoomFactor;

      box.positionLeft = mousePosition + distance - box.width / 2;
    });

    spacerHighestBox.positionLeft = boxes[2].positionLeft + boxes[2].width;
  }

  private static cutLeftSpace(
    boxes: BoxModel[],
    distance: number,
    spacerHighestBox: SpacerModel,
    spacerPageEdge: SpacerModel
  ) {
    console.log("cut space left by " + distance);

    boxes.forEach(box => {
      box.positionLeft -= distance;
    });

    spacerHighestBox.positionLeft -= distance;
    spacerPageEdge.positionLeft =
      window.pageXOffset + window.innerWidth - distance - spacerPageEdge.width;

    window.scrollBy(-distance, 0);
  }

  private static extendLeftSpace(
    boxes: BoxModel[],
    distance: number,
    spacerHighestBox: SpacerModel,
    spacerPageEdge: SpacerModel
  ) {
    console.log("extend space left by " + distance);

    boxes.forEach(box => {
      box.positionLeft += distance;
    });

    // TODO: Wrong behaviour: highest box will move towards mouse pointer.
    // Maybe, on extending space left, Window can still not scroll as much to the right as needed.

    spacerHighestBox.positionLeft += distance;
    spacerPageEdge.positionLeft =
      window.pageXOffset + window.innerWidth + distance - spacerPageEdge.width;

    window.scrollBy(distance, 0);
  }

  private static logPositions(
    boxes: BoxModel[],
    spacerHighestBox: SpacerModel,
    spacerPageEdge: SpacerModel
  ) {
    boxes.forEach(box => {
      console.log("box " + box.id + " Pos " + box.positionLeft);
    });

    console.log(
      "spacerHighestBox Pos " +
        spacerHighestBox.positionLeft +
        " spacerPageEdge Pos " +
        spacerPageEdge.positionLeft
    );
  }
}
