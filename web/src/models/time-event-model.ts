export default class TimeEventModel {
  static expandedWidth = 300;
  static collapsedWidth = 50;
  positionCenter: number;
  id: number;
  text: string;
  date: number;
  importance: number;
  imageIds: number[];
  show = false;

  constructor(
    positionCenter: number,
    id: number,
    text: string,
    date: number,
    importance: number,
    imageIds: number[]
  ) {
    this.positionCenter = positionCenter;
    this.id = id;
    this.text = text;
    this.date = date;
    this.importance = importance;
    this.imageIds = imageIds;
  }
}
