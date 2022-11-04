/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Constants } from "@/timeline/zooming/constants";
import ImageReferenceModel from "./image-reference-model";

export default class TimeEventModel {
  static boxWidth = 300;
  static bubbleWidth = 60;
  static boxWidthOffset = 150;
  private _positionCenter!: number;

  /**
   * Contains a zoom level for each expansion state. The values define at
   * which zoom level each expansion state bounds to the next smaller or bigger
   * state.
   */
  expansionZoomLevels = [
    Constants.MAX_ZOOM_LEVEL,
    Constants.MAX_ZOOM_LEVEL,
    Constants.MAX_ZOOM_LEVEL,
    Constants.MAX_ZOOM_LEVEL
  ];

  /**
   * Contains the time event element and certain child elements that are
   * modified when changing the expansion state.
   */
  zoomContainerHtmlElement?: HTMLElement;

  id: string;
  text: string;
  date: number;
  importance: number;
  imageReferences: ImageReferenceModel[];
  title: string;

  constructor(
    positionCenter: number, // TODO derive from date
    id: string,
    text: string,
    date: number,
    importance: number,
    imageReferences: ImageReferenceModel[],
    title: string
  ) {
    this.positionCenter = positionCenter;
    this.id = id;
    this.text = text;
    this.date = date;
    this.importance = importance;
    this.imageReferences = imageReferences;
    this.title = title;
  }

  /**
   * Set positionCenter and translateX the time event.
   *
   * The HTML element will only be present after the Vue
   * component has been mounted, so we check for its presence.
   */
  public set positionCenter(newPositionCenter: number) {
    this._positionCenter = newPositionCenter;
    if (this.zoomContainerHtmlElement) {
      this.zoomContainerHtmlElement.style.transform =
        "translateX(" + newPositionCenter + "px)";
    }
  }

  public get positionCenter(): number {
    return this._positionCenter;
  }
}
