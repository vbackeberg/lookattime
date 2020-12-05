import store from "@/store";
import { Constants } from "./constants";
import TimeMarkerCreator from "./time-marker-creator";

export default class TimeMarkerWatcher {
  private timeMarkerCreator: TimeMarkerCreator;
  constructor() {
    this.timeMarkerCreator = TimeMarkerCreator.Instance;
  }

  public watch(newDistance: number, oldDistance: number) {
    if (store.state.boxes.length < 2 || store.state.timeMarkers.length < 2)
      return;

    const maxDistance = 500;
    const minDistance = 200;

    // On zoom in:
    if (newDistance > oldDistance) {
      this.timeMarkerCreator.removeMarkersLeft();
      this.timeMarkerCreator.removeMarkersRight();
    }

    // On zoom out:
    else if (newDistance < oldDistance) {
      this.timeMarkerCreator.createMarkersLeft();
      this.timeMarkerCreator.createMarkersRight();
    }

    if (newDistance > maxDistance) {
      // Add in between
    }

    if (newDistance < minDistance) {
      store.commit(
        "setTimeMarkerDepth",
        store.state.timeMarkerDepth * Constants.MARKER_BASE
      );

      const markers = store.state.timeMarkers.filter(
        marker => marker.depth >= store.state.timeMarkerDepth
      );

      store.commit("setTimeMarkers", markers);
    }
  }

  private static instance: TimeMarkerWatcher;
  public static get Instance() {
    return this.instance || (this.instance = new this());
  }
}
