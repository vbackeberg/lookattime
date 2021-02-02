export default class TimeEventModel {
  static expandedWidth = 300;
  static expandedWidthOffset = TimeEventModel.expandedWidth / 2;
  static collapsedWidth = 50;
  positionCenter: number;
  id: string;
  text: string;
  date: number;
  importance: number;
  imageIds: string[];

  title: string;
  show = false;

  constructor(
    positionCenter: number,
    id: string,
    text: string,
    date: number,
    importance: number,
    imageIds: string[],
    title: string
  ) {
    this.positionCenter = positionCenter;
    this.id = id;
    this.text = text;
    this.date = date;
    this.importance = importance;
    this.imageIds = imageIds;
    this.title = title;
  }
}
