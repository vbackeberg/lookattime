import ImageReferenceModel from "./image-reference-model";

export default class TimeEventModel {
  static expandedWidth = 300;
  static expandedWidthOffset = TimeEventModel.expandedWidth / 2;
  static collapsedWidth = 50;
  positionCenter: number;
  id: string;
  text: string;
  date: number;
  importance: number;
  imageReferences: ImageReferenceModel[];
  title: string;
  show = false;

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
}
