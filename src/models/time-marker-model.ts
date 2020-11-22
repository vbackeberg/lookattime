export default class TimeMarkerModel {
  positionCenter: number;
  id: string;

  //TODO: Add date
  constructor(positionCenter: number, id: string) {
    this.positionCenter = positionCenter;
    this.id = id;
  }
}
