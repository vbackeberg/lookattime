import ImageReferenceModel from "./image-reference-model";
import ExpansionState from "./time-event/expansion-state";

export default class TimeEventModel {
  static boxWidth = 300;
  static bubbleWidth = 50;
  static boxWidthOffset = 150;
  private _positionCenter!: number;
  id: string;
  text: string;
  date: number;
  importance: number;
  imageReferences: ImageReferenceModel[];
  title: string;
  htmlElement?: HTMLElement;
  expansionState = ExpansionState.Dot;

  /*
   * Marks the lower bounds of expansion states.
   */
  expansionStateMap: { expansionState: ExpansionState; zoomLevel: number }[] = [
    { expansionState: ExpansionState.Box, zoomLevel: 20 },
    { expansionState: ExpansionState.Bubble, zoomLevel: 10 },
    { expansionState: ExpansionState.Dot, zoomLevel: 0 },
    { expansionState: ExpansionState.Flat, zoomLevel: 0 }
  ];

  constructor(
    positionCenter: number,
    id: string,
    text: string,
    date: number,
    importance: number,
    imageReferences: ImageReferenceModel[],
    title: string
  ) {
    this.positionCenter = positionCenter;
    this.id = id;
    this.text = text;
    this.date = date;
    this.importance = importance;
    this.imageReferences = imageReferences;
    this.title = title;
  }
  public set positionCenter(newPositionCenter: number) {
    this._positionCenter = newPositionCenter;
    if (this.htmlElement) {
      this.htmlElement.style.transform =
        "translateX(" + newPositionCenter + "px)";
    }
  }

  public get positionCenter(): number {
    return this._positionCenter;
  }
}
