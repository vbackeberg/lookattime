export default class Spacer {
  id: string;
  private _positionLeft!: number;
  width: number;
  htmlElement!: HTMLElement;
  constructor(positionLeft: number, width: number, id: string) {
    this.id = id;
    this.width = width; // TODO constant set to 1
    this.htmlElement = document.getElementById(id) as HTMLElement;
    this.positionLeft = positionLeft;
  }

  public set positionLeft(newPositionLeft: number) {
    this._positionLeft = newPositionLeft;
    this.htmlElement.style.transform = "translateX(" + newPositionLeft + "px)";
  }

  public get positionLeft(): number {
    return this._positionLeft;
  }
}
