export default class TimeMarkerModel {
  static width = 2;
  static widthOffset = TimeMarkerModel.width / 2;
  private _positionCenter!: number;
  id: string;
  date: number;
  depth: number;
  htmlElement: HTMLElement;
  constructor(
    positionCenter: number,
    id: string,
    date: number,
    depth: number,
    htmlElement: HTMLElement
  ) {
    this.id = id;
    this.date = date;
    this.depth = depth;
    this.htmlElement = htmlElement;
    this.positionCenter = positionCenter;
  }

  public set positionCenter(newPositionCenter: number) {
    this._positionCenter = newPositionCenter;
    this.htmlElement.style.transform =
      "translateX(" + (newPositionCenter - TimeMarkerModel.widthOffset) + "px)";
  }

  public get positionCenter(): number {
    return this._positionCenter;
  }
}
