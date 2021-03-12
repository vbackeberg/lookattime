export default class TimeMarkerModel {
  static width = 2;
  static widthOffset = TimeMarkerModel.width / 2;
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
