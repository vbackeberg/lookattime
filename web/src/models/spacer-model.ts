export default class SpacerModel {
  name: string;
  positionLeft: number;
  width: number;
  htmlElement!: HTMLElement;
  constructor(positionLeft: number, width: number, name: string) {
    this.name = name;
    this.positionLeft = positionLeft;
    this.width = width;
  }
}
