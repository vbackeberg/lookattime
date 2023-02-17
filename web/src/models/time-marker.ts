import PositionTranslator from "@/timeline/position-translator";
import TimeDepth from "@/timeline/time-depth/time-depth";
import { Temporal } from "@js-temporal/polyfill";

export default class TimeMarker {
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
    container.setAttribute("class", "time-marker-container");

    container.insertAdjacentHTML(
      "afterbegin",
      `
        <svg class="time-marker"></svg>
        <div class="time-marker-date">${TimeDepth.currentDepth[2](
          Temporal.Instant.fromEpochSeconds(this.date)
        )}</div>
      `
    );

    return container;
  }
}
