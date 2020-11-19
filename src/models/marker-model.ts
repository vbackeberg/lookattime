export default class MarkerModel {
  positionCenter: number;
  id: number;

  //TODO: Add relative Position (date)
  constructor(positionCenter: number, id: number) {
    this.positionCenter = positionCenter;
    this.id = id;
  }
}
