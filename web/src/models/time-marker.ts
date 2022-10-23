import PositionTranslator from "@/timeline/position-translator";
import { Constants } from "@/timeline/zooming/constants";
import { Temporal } from "@js-temporal/polyfill";

export default class TimeMarker {
  static width = 2;
  static widthOffset = TimeMarker.width / 2;
  private _positionCenter!: number;
  date: number;
  htmlElement: HTMLElement;
  constructor(date: number) {
    this.date = date;
    this.htmlElement = this.createHTMLElement();
    this.positionCenter = PositionTranslator.toAbsolutePosition(date);
  }

  public set positionCenter(newPositionCenter: number) {
    this._positionCenter = newPositionCenter;
    this.htmlElement.style.transform =
      "translateX(" + (newPositionCenter - TimeMarker.widthOffset) + "px)";
  }

  public get positionCenter(): number {
    return this._positionCenter;
  }

  private createHTMLElement(): HTMLElement {
    const element = document.createElement("svg");
    element.setAttribute("class", "time-marker zoom-transition zoomable");

    return element;
  }
}
