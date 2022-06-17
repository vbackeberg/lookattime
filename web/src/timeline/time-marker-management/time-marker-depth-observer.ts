import store from "@/store/store";
import SpaceObserver from "../space-management/space-observer";
import { Constants } from "../zooming/constants";
import { Ti } from "./zoom-level-translation";

export default class TimeMarkerDepthObserver {
  private zoomLevelMarkerDepthTranslation = Array<[number, Function]>(
    [Constants.MAX_ZOOM_LEVEL, Ti.setMarkersHours],
    [24, Ti.setMarkersDays],
    [12, Ti.setMarkersHalfDays],
    [6, Ti.setMarkersHours],
    [Constants.MIN_ZOOM_LEVEL, Ti.setMarkersHalfHours]
  );

  public observe() {
    console.log("Tim ma de obs observed zl: " + store.state.zoomLevel);
    this.removeAllMarkers();

    const markerDepth = this.zoomLevelMarkerDepthTranslation.find(
      tuple => tuple[0] <= store.state.zoomLevel
    );

    if (markerDepth) {
      markerDepth[1]();
    }

    this.addHTMLElements(
      ...store.state.timeMarkers.map(marker => marker.htmlElement)
    );
  }

  public removeAllMarkers() {
    store.state.timeMarkers.forEach(marker => {
      marker.htmlElement.remove();
    });

    store.state.timeMarkers = [];
  }

  private addHTMLElements(...elements: HTMLElement[]) {
    const documentFragment = document.createDocumentFragment();

    for (let i = 0; i < elements.length; i++) {
      documentFragment.appendChild(elements[i]);
    }

    store.state.timelineElement
      .querySelector("#time-marker-area")
      ?.appendChild(documentFragment);
  }

  constructor() {
    SpaceObserver.Instance.eventTarget.addEventListener(
      "space-management-end",
      () => {
        this.observe();
      }
    );
  }

  private static instance: TimeMarkerDepthObserver;

  public static get Instance(): TimeMarkerDepthObserver {
    return this.instance || (this.instance = new this());
  }
}

// [1800, "seconds"],
// [1, "days"],
// [2, "days"],
// [1, "months"]
