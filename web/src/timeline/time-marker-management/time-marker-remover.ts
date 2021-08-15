import TimeMarker from "@/models/time-marker";
import store from "@/store/store";
import Viewport from "../viewport/viewport-right-edge";
import { Constants } from "./constants";

/**
 * Removes time markers from the sides and from between.
 */
export default class TimeMarkerRemover {
  private timelineElement: HTMLElement;

  constructor() {
    this.timelineElement = store.state.timelineElement;
  }

  public removeMarkersLeft() {
    const index = store.state.timeMarkers.findIndex(
      marker => marker.positionCenter > 0
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
      marker => marker.positionCenter > Viewport.rightEdge()
    );

    if (index > -1) {
      for (let i = index; i < store.state.timeMarkers.length; i++) {
        store.state.timeMarkers[i].htmlElement.remove();
      }

      store.state.timeMarkers = store.state.timeMarkers.slice(0, index);
    }
  }

  public removeMarkersLowestDepth() {
    store.state.timeMarkerDepth =
      store.state.timeMarkerDepth * Constants.DEPTH_BASE;

    let markers: TimeMarker[] = [];

    for (let i = 0; i < store.state.timeMarkers.length; i++) {
      if (store.state.timeMarkers[i].depth >= store.state.timeMarkerDepth) {
        markers.push(store.state.timeMarkers[i]);
      } else {
        store.state.timeMarkers[i].htmlElement.remove();
      }
    }

    store.state.timeMarkers = markers;
  }

  public removeAllMarkers() {
    store.state.timeMarkers.forEach(marker => {
      marker.htmlElement.remove();
    });

    store.state.timeMarkers = [];
  }

  private static instance: TimeMarkerRemover;
  public static get Instance() {
    return this.instance || (this.instance = new this());
  }
}
