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
  private _htmlElements?: TimeEventHtmlElements;

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
      if (this._htmlElements?.parent) {
      this._htmlElements.parent.style.transform =
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
    if (this._expansionState !== newExpansionState) {
      switch (newExpansionState) {
        case ExpansionState.Box:
          this.applyBoxStyles();
          break;

        case ExpansionState.Bubble:
          this.applyBubblyStyles();
          break;

        default:
          this.applyDotStyles();
          break;
      }

      this._expansionState = newExpansionState;
    }
  }

  private applyBoxStyles() {
    this._htmlElements!.bufferTop.classList.remove(
      "buffer-top-bubble",
      "buffer-top-dot"
    );
    this._htmlElements!.bufferTop.classList.add("buffer-top-box");

    this._htmlElements!.content.classList.remove("bubble", "dot");
    this._htmlElements!.content.classList.add("box");

    this._htmlElements!.card.classList.remove("display-none");
    this._htmlElements!.cardImage.classList.remove("display-none");
    this._htmlElements!.cardText.classList.remove("display-none");
    this._htmlElements!.cardTitle.classList.remove("display-none");
    this._htmlElements!.buttonFull.classList.remove("display-none");

    this._htmlElements!.connector.classList.remove(
      "connector-bubble",
      "connector-dot"
    );
    this._htmlElements!.connector.classList.add("connector-box");
  }

  private applyBubblyStyles() {
    this._htmlElements!.bufferTop.classList.remove(
      "buffer-top-box",
      "buffer-top-dot"
    );
    this._htmlElements!.bufferTop.classList.add("buffer-top-bubble");

    this._htmlElements!.content.classList.remove("box", "dot");
    this._htmlElements!.content.classList.add("bubble");

    this._htmlElements!.card.classList.remove("display-none");
    this._htmlElements!.cardImage.classList.remove("display-none");
    this._htmlElements!.cardTitle.classList.add("display-none");
    this._htmlElements!.buttonFull.classList.add("display-none");
    this._htmlElements!.cardText.classList.add("display-none");

    this._htmlElements!.connector.classList.remove(
      "connector-box",
      "connector-dot"
    );
    this._htmlElements!.connector.classList.add("connector-bubble");
  }

  private applyDotStyles() {
    this._htmlElements!.bufferTop.classList.remove(
      "buffer-top-bubble",
      "buffer-top-box"
    );
    this._htmlElements!.bufferTop.classList.add("buffer-top-dot");

    this._htmlElements!.content.classList.remove("bubble", "box");
    this._htmlElements!.content.classList.add("dot");

    this._htmlElements!.card.classList.add("display-none");
    this._htmlElements!.cardImage.classList.add("display-none");
    this._htmlElements!.cardTitle.classList.add("display-none");
    this._htmlElements!.buttonFull.classList.add("display-none");
    this._htmlElements!.cardText.classList.add("display-none");

    this._htmlElements!.connector.classList.remove(
      "connector-bubble",
      "connector-box"
    );
    this._htmlElements!.connector.classList.add("connector-dot");
  }

  public set htmlElement(newHtmlElement: HTMLElement) {
    const parent = newHtmlElement;

    this._htmlElements = {
      parent: parent,
      bufferTop: parent.getElementsByClassName("buffer-top")[0] as HTMLElement,
      content: parent.getElementsByClassName("content")[0] as HTMLElement,
      card: parent.getElementsByClassName("card")[0] as HTMLElement,
      cardImage: parent.getElementsByClassName("card-image")[0] as HTMLElement,
      cardTitle: parent.getElementsByClassName("card-title")[0] as HTMLElement,
      buttonFull: parent.getElementsByClassName("btn-full")[0] as HTMLElement,
      cardText: parent.getElementsByClassName("card-text")[0] as HTMLElement,
      connector: parent.getElementsByClassName("connector")[0] as HTMLElement
    };
  }
}

/**
 * The HTML elements associated with this time event.
 */
interface TimeEventHtmlElements {
  parent?: HTMLElement;
  bufferTop: HTMLElement;
  content: HTMLElement;
  card: HTMLElement;
  cardImage: HTMLElement;
  cardTitle: HTMLElement;
  buttonFull: HTMLElement;
  cardText: HTMLElement;
  connector: HTMLElement;
}
