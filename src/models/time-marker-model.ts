export default class TimeMarkerModel {
  positionCenter: number;
  id: string;
  date: number;
  constructor(positionCenter: number, id: string, date: number) {
    this.positionCenter = positionCenter;
    this.id = id;
    this.date = date;
  }
}
