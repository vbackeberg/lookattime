export default class BoxModel {
  positionCenter: number;
  width: number;
  id: number;
  text: string;

  constructor(positionCenter: number, width: number, id: number, text: string) {
    this.positionCenter = positionCenter;
    this.width = width;
    this.id = id;
    this.text = text;
  }
}
