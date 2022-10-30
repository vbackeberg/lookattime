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
      "translateX(" + newPositionCenter + "px)";
  }

  public get positionCenter(): number {
    return this._positionCenter;
  }

  private createHTMLElement(): HTMLElement {
    const container = document.createElement("div");
    container.setAttribute(
      "class",
      "time-marker-container zoom-transition zoomable"
    );
    const element = document.createElement("svg");
    element.setAttribute("class", "time-marker zoom-transition zoomable");

    container.insertAdjacentHTML(
      "afterbegin",
      `
        <svg class="time-marker"></svg>
        <div class="time-marker-date">${Temporal.Instant.fromEpochSeconds(
          this.date
        ).toString({
          timeZone: Constants.TIME_ZONE
        })}</div>
      `
    );

    return container;
  }
}
