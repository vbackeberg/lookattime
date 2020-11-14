export default class BoxModel {
  positionCenter: number;
  static expandedWidth = 300;
  static collapsedWidth = 50;
  id: number;
  text: string;
  date: number;
  importance: number;

  constructor(
    positionCenter: number,
    id: number,
    text: string,
    date: number,
    importance: number
  ) {
    this.positionCenter = positionCenter;
    this.id = id;
    this.text = text;
    this.date = date;
    this.importance = importance;
  }
}
