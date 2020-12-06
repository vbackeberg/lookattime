import store from "@/store";
import { Constants } from "./constants";
import TimeMarkerCreator from "./time-marker-creator";
import TimeMarkerRemover from "./time-marker-remover";

export default class TimeMarkerWatcher {
  private timeMarkerCreator: TimeMarkerCreator;
  private timeMarkerRemover: TimeMarkerRemover;

  constructor() {
    this.timeMarkerCreator = TimeMarkerCreator.Instance;
    this.timeMarkerRemover = TimeMarkerRemover.Instance;
  }

  public watch(newDistance: number, oldDistance: number) {
    if (store.state.boxes.length < 2 || store.state.timeMarkers.length < 2)
      return;

    const maxDistance = 1000;
    const minDistance = 100;

    // On zoom in:
    if (newDistance > oldDistance) {
      this.timeMarkerRemover.removeMarkersLeft();
      this.timeMarkerRemover.removeMarkersRight();

      if (newDistance > maxDistance) {
        // Add in between
        // Decrease depth.
        // If depth < 1 change time system to the next lower system.
        // Ex.: From years to months. From seconds to milliseconds
      }
    }

    // On zoom out:
    else if (newDistance < oldDistance) {
      this.timeMarkerCreator.addMarkersLeft();
      this.timeMarkerCreator.addMarkersRight();

      if (newDistance < minDistance) {
        store.commit(
          "setTimeMarkerDepth",
          store.state.timeMarkerDepth * Constants.DEPTH_BASE
        );
        const markers = store.state.timeMarkers.filter(
          marker => marker.depth >= store.state.timeMarkerDepth
        );
        store.commit("setTimeMarkers", markers);
      }
    }
  }

  private static instance: TimeMarkerWatcher;
  public static get Instance() {
    return this.instance || (this.instance = new this());
  }
}
