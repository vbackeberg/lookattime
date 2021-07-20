export default class TimeMarkerModel {
  static width = 2;
  static widthOffset = TimeMarkerModel.width / 2;
  positionCenter: number;
  id: string;
  date: number;
  depth: number;
  htmlElement: HTMLElement;
  constructor(positionCenter: number, id: string, date: number, depth: number, htmlElement: HTMLElement) {
    this.positionCenter = positionCenter;
    this.id = id;
    this.date = date;
    this.depth = depth;
    this.htmlElement = htmlElement;
  }
}
