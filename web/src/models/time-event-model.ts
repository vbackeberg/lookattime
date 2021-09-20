import store from "@/store/store";
import ImageReferenceModel from "./image-reference-model";
import ExpansionState from "./time-event/expansion-state";

interface HtmlElements {
  parent?: HTMLElement;
  bufferTop: HTMLElement;
  content: HTMLElement;
  card: HTMLElement;
  cardImage: HTMLElement;
  cardText: HTMLElement;
  connector: HTMLElement;
}

export default class TimeEventModel {
  static boxWidth = 300;
  static bubbleWidth = 50;
  static boxWidthOffset = 150;
  private _positionCenter!: number;

  /**
   * Defines whether the time event should look like a box, bubble, dot or flat.
   */
  private _expansionState: ExpansionState = -1;

  /**
   * Contains the time event element and certain child elements that are
   * modified when chainging the expansion state.
   */
  private _htmlElements?: HtmlElements;

  id: string;
  text: string;
  date: number;
  importance: number;
  imageReferences: ImageReferenceModel[];
  title: string;
  collisionZoomLevels = [0, 0, 0, 0];

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
  }
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

  public updateExpansionState() {
    this.expansionState = this.collisionZoomLevels.findIndex(
      zoomLevel => zoomLevel <= store.state.zoomLevel
    );
  }

  public set htmlElement(newHtmlElement: HTMLElement) {
    const parent = newHtmlElement;

    this._htmlElements = {
      parent: parent,
      bufferTop: <HTMLElement>parent.getElementsByClassName("buffer-top")[0],
      content: <HTMLElement>parent.getElementsByClassName("content")[0],
      card: <HTMLElement>parent.getElementsByClassName("card")[0],
      cardImage: <HTMLElement>parent.getElementsByClassName("card-image")[0],
      cardText: <HTMLElement>parent.getElementsByClassName("card-text")[0],
      connector: <HTMLElement>parent.getElementsByClassName("connector")[0]
    };
  }

  public get htmlElement(): HTMLElement {
    return this._htmlElements?.parent as HTMLElement;
  }

  public set expansionState(newExpansionState: ExpansionState) {
    if (this._expansionState !== newExpansionState) {
      switch (newExpansionState) {
        case ExpansionState.Box:
          this._htmlElements!.bufferTop.classList.remove("buffer-top-bubble");
          this._htmlElements!.bufferTop.classList.add("buffer-top-box");

          this._htmlElements!.content.classList.remove("bubble");
          this._htmlElements!.content.classList.add("box");

          this._htmlElements!.card.style.display = "flex";
          this._htmlElements!.cardImage.style.display = "block";
          this._htmlElements!.cardText.style.display = "block";

          this._htmlElements!.connector.classList.remove("connector-bubble");
          this._htmlElements!.connector.classList.add("connector-box");

          break;

        case ExpansionState.Bubble:
          this._htmlElements!.bufferTop.classList.remove(
            "buffer-top-box",
            "buffer-top-dot"
          );
          this._htmlElements!.bufferTop.classList.add("buffer-top-bubble");

          this._htmlElements!.content.classList.remove("box", "dot");
          this._htmlElements!.content.classList.add("bubble");

          this._htmlElements!.card.style.display = "flex";
          this._htmlElements!.cardImage.style.display = "none";
          this._htmlElements!.cardText.style.display = "none";

          this._htmlElements!.connector.classList.remove(
            "connector-box",
            "connector-dot"
          );
          this._htmlElements!.connector.classList.add("connector-bubble");

          break;

        default:
          this._htmlElements!.bufferTop.classList.remove(
            "buffer-top-bubble",
            "buffer-top-box"
          );
          this._htmlElements!.bufferTop.classList.add("buffer-top-dot");

          this._htmlElements!.content.classList.remove("bubble", "box");
          this._htmlElements!.content.classList.add("dot");

          this._htmlElements!.card.style.display = "none";
          this._htmlElements!.cardImage.style.display = "none";
          this._htmlElements!.cardText.style.display = "none";

          this._htmlElements!.connector.classList.remove("connector-bubble");
          this._htmlElements!.connector.classList.add("connector-dot");

          break;
      }

      this._expansionState = newExpansionState;
    }
  }

  public get expansionState(): ExpansionState {
    return this._expansionState;
  }
}
