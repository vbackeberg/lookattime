export default class SpacerModel {
  positionLeft: number;
  color: string;

  static width = 200;

  constructor(positionLeft: number, color: string) {
    this.positionLeft = positionLeft;
    this.color = color;
  }
}
