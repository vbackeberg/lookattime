import store from "@/store/store";
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
      store.dispatch("setTimeMarkers", store.state.timeMarkers.slice(index)); //TODO Performance issue
    }
  }

  public removeMarkersRight() {
    const index = store.state.timeMarkers.findIndex(
      marker => marker.positionCenter > store.getters.rightEdge
    );

    if (index > -1) {
      store.dispatch("setTimeMarkers", store.state.timeMarkers.slice(0, index)); //TODO Performance issue
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

    store.dispatch("setTimeMarkers", markers);
  }

  private static instance: TimeMarkerRemover;
  public static get Instance() {
    return this.instance || (this.instance = new this());
  }
}
