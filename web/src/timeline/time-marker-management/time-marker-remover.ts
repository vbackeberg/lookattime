import store from "@/store/store";
import { Constants } from "./constants";

/**
 * Removes time markers from the sides and from between.
 */
export default class TimeMarkerRemover {
  private timeMarkerAreaElement: HTMLElement;

  constructor() {
    this.timeMarkerAreaElement = document.getElementById(
      "time-marker-area"
    ) as HTMLElement;
  }

  public removeMarkersLeft() {
    const index = store.state.timeMarkers.findIndex(
      marker => marker.positionCenter > store.getters.leftEdge
    );

    if (index > 0) {
      for (let i = 0; i < index; i++) {
        this.removeHTMLElement(store.state.timeMarkers[i].id);
      }
      
      store.state.timeMarkers = store.state.timeMarkers.slice(index);
    }
  }

  public removeMarkersRight() {
    const index = store.state.timeMarkers.findIndex(
      marker => marker.positionCenter > store.getters.rightEdge
    );

    if (index > -1) {
      for (let i = index; i < store.state.timeMarkers.length; i++) {
        this.removeHTMLElement(store.state.timeMarkers[i].id);
      }
      store.state.timeMarkers = store.state.timeMarkers.slice(0, index);
    }
  }

  public removeMarkersLowestDepth() {
    store.commit(
      "setTimeMarkerDepth",
      store.state.timeMarkerDepth * Constants.DEPTH_BASE
    );

    const markers = store.state.timeMarkers.filter(
      marker => marker.depth >= store.state.timeMarkerDepth
    );

    store.state.timeMarkers = markers;
  }

  private removeHTMLElement(id: string) {
    document.getElementById(id)?.remove();
  }

  private static instance: TimeMarkerRemover;
  public static get Instance() {
    return this.instance || (this.instance = new this());
  }
}
