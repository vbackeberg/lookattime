export default class BoxModel {
  positionLeft: number;
  width: number;
  id: number;

  constructor(positionCenter: number, width: number, id: number) {
    this.positionLeft = positionCenter;
    this.width = width;
    this.id = id;
  }
}
