import store from "@/store";
import { Constants } from "./constants";

export default class TimeMarkerRemover {
  public removeMarkersLeft() {
    const index = store.state.timeMarkers.findIndex(
      marker => marker.positionCenter > store.getters.leftEdge
    );

    if (index > 0) {
      console.log("Remove markers below index: " + index);
      store.commit("setTimeMarkers", store.state.timeMarkers.slice(index));
    }
  }

  public removeMarkersRight() {
    const index = store.state.timeMarkers.findIndex(
      marker => marker.positionCenter > store.getters.rightEdge
    );

    if (index > -1) {
      console.log("Remove markers above index: " + index);
      store.commit("setTimeMarkers", store.state.timeMarkers.slice(0, index));
    }
  }

  public removeMarkersLowestDepth() {
    store.commit(
      "setTimeMarkerDepth",
      store.state.timeMarkerDepth * Constants.DEPTH_BASE
    );

    const start = Date.now();

    const markers = store.state.timeMarkers.filter(
      marker => marker.depth >= store.state.timeMarkerDepth
    );

    console.log("remove between took: " + (Date.now() - start));
    store.commit("setTimeMarkers", markers);
    console.log("remove between and commit took: " + (Date.now() - start));
  }

  private static instance: TimeMarkerRemover;
  public static get Instance() {
    return this.instance || (this.instance = new this());
  }
}
