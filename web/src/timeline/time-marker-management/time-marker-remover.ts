import store from "@/store";
import { Constants } from "./constants";

/**
 * Removes time markers from the sides and from between.
 */
export default class TimeMarkerRemover {
  public removeMarkersLeft() {
    const index = store.state.timeMarkers.findIndex(
      marker => marker.positionCenter > store.getters.leftEdge
    );

    if (index > 0) {
      store.commit("setTimeMarkers", store.state.timeMarkers.slice(index));
    }
  }

  public removeMarkersRight() {
    const index = store.state.timeMarkers.findIndex(
      marker => marker.positionCenter > store.getters.rightEdge
    );

    if (index > -1) {
      store.commit("setTimeMarkers", store.state.timeMarkers.slice(0, index));
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

    store.commit("setTimeMarkers", markers);
  }

  private static instance: TimeMarkerRemover;
  public static get Instance() {
    return this.instance || (this.instance = new this());
  }
}
