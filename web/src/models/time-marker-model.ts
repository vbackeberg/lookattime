export default class TimeMarkerModel {
  positionCenter: number;
  id: string;
  date: number;
  depth: number;
  show = false;
  static width = 4;
  constructor(positionCenter: number, id: string, date: number, depth: number) {
    this.positionCenter = positionCenter;
    this.id = id;
    this.date = date;
    this.depth = depth;
  }
}
