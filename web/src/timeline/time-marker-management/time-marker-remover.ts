import TimeMarkerModel from "@/models/time-marker-model";
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
        store.state.timeMarkers[i].htmlElement.remove();
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
        store.state.timeMarkers[i].htmlElement.remove();
      }

      store.state.timeMarkers = store.state.timeMarkers.slice(0, index);
    }
  }

  public removeMarkersLowestDepth() {
    store.commit(
      "setTimeMarkerDepth",
      store.state.timeMarkerDepth * Constants.DEPTH_BASE
    );

    let markers: TimeMarkerModel[] = [];

    for (let i = 0; i < store.state.timeMarkers.length; i++) {
      if (store.state.timeMarkers[i].depth >= store.state.timeMarkerDepth) {
        markers.push(store.state.timeMarkers[i]);
      } else {
        store.state.timeMarkers[i].htmlElement.remove();
      }
    }

    store.state.timeMarkers = markers;
  }

  private static instance: TimeMarkerRemover;
  public static get Instance() {
    return this.instance || (this.instance = new this());
  }
}
