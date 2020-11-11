export default class BoxModel {
  positionCenter: number;
  width: number;
  id: number;
  text: string;
  date: number;
  importance: number;

  constructor(
    positionCenter: number,
    width: number,
    id: number,
    text: string,
    date: number,
    importance: number
  ) {
    this.positionCenter = positionCenter;
    this.width = width;
    this.id = id;
    this.text = text;
    this.date = date;
    this.importance = importance;
  }
}
