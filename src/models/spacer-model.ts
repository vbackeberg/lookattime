export default class SpacerModel {
  positionLeft: number;
  width: number;
  height: number;
  color: string;

  constructor(positionLeft: number, width: number, height: number, color: string) {
    this.positionLeft = positionLeft;
    this.width = width;
    this.height = height;
    this.color = color;
  }
}
