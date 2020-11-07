export default class SpacerModel {
  positionLeft: number;
  color: string;

  width: number;
  constructor(positionLeft: number, color: string, width: number) {
    this.positionLeft = positionLeft;
    this.color = color;
    this.width = width;
  }
}
