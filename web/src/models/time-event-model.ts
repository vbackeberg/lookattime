import ImageReferenceModel from "./image-reference-model";

export default class TimeEventModel {
  static expandedWidth = 300;
  static expandedWidthOffset = 150;
  static collapsedWidth = 50;
  private _positionCenter!: number;
  id: string;
  text: string;
  date: number;
  importance: number;
  imageReferences: ImageReferenceModel[];
  title: string;
  htmlElement?: HTMLElement;

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
