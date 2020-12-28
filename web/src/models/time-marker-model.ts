export default class TimeMarkerModel {
  static width = 4;
  positionCenter: number;
  id: string;
  date: number;
  depth: number;
  show = false;
  constructor(positionCenter: number, id: string, date: number, depth: number) {
    this.positionCenter = positionCenter;
    this.id = id;
    this.date = date;
    this.depth = depth;
  }
}
