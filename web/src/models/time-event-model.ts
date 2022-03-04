/* eslint-disable @typescript-eslint/no-non-null-assertion */
import store from "@/store/store";
import { Constants } from "@/timeline/zooming/constants";
import ImageReferenceModel from "./image-reference-model";
import ExpansionState from "./time-event/expansion-state";

export default class TimeEventModel {
  static boxWidth = 300;
  static bubbleWidth = 60;
  static boxWidthOffset = 150;
  private _positionCenter!: number;

  /**
   * Defines whether the time event should look like a box, bubble, dot or flat.
   */
  private _expansionState: ExpansionState = ExpansionState.Flat;

  /**
   * Contains a zoom level for each expansion state. The values define at
   * which zoom level each expansion state bounds to the next smaller or bigger
   * state.
   */
  private _expansionZoomLevels = [
    Constants.MAX_ZOOM_LEVEL,
    Constants.MAX_ZOOM_LEVEL,
    Constants.MAX_ZOOM_LEVEL,
    Constants.MAX_ZOOM_LEVEL
  ];

  /**
   * Contains the time event element and certain child elements that are
   * modified when changing the expansion state.
   */
  htmlElement?: HTMLElement;

  id: string;
  text: string;
  date: number;
  importance: number;
  imageReferences: ImageReferenceModel[];
  title: string;

  constructor(
    positionCenter: number,
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

    document.addEventListener("update-expansion-states", () => {
      this.updateExpansionState();
    });
  }

  /**
   * Set positionCenter and translateX the time event.
   *
   * The HTML element will only be present after the Vue
   * component has been mounted, so we check for its presence.
   */
  public set positionCenter(newPositionCenter: number) {
    this._positionCenter = newPositionCenter;
    if (this.htmlElement) {
      this.htmlElement.style.transform =
        "translateX(" + newPositionCenter + "px)";
    }
  }

  public get positionCenter(): number {
    return this._positionCenter;
  }

  public set expansionZoomLevels(newExpansionZoomLevels: number[]) {
    this._expansionZoomLevels = newExpansionZoomLevels;
  }

  /**
   * Sets the expansion state according to the current zoom level.
   *
   * This will call the expansion state setter which applies CSS
   * transformations to the time event.
   */
  private updateExpansionState() {
    this.expansionState = this._expansionZoomLevels.findIndex(
      zoomLevel => store.state.zoomLevel <= zoomLevel
    );
  }

  /**
   * The setter applies appropriate CSS classes and removes elements
   * to modify visual appearance of time event.
   */
  public set expansionState(newExpansionState: ExpansionState) {
    if (this._expansionState !== newExpansionState && this.htmlElement) {
      switch (newExpansionState) {
        case ExpansionState.Box:
          this.applyBoxStyles();
          break;

        case ExpansionState.Bubble:
          this.applyBubbleStyles();
          break;

        default:
          this.applyDotStyles();
          break;
      }

      this._expansionState = newExpansionState;
    }
  }

  private applyBoxStyles() {
    this.htmlElement!.classList.remove("bubble");
    this.htmlElement!.classList.remove("dot");
    this.htmlElement!.classList.add("box");
  }

  private applyBubbleStyles() {
    this.htmlElement!.classList.remove("box");
    this.htmlElement!.classList.remove("dot");
    this.htmlElement!.classList.add("bubble");
  }

  private applyDotStyles() {
    this.htmlElement!.classList.remove("box");
    this.htmlElement!.classList.remove("bubble");
    this.htmlElement!.classList.add("dot");
  }
}
