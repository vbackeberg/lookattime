import TimeMarkerModel from "@/models/time-marker-model";
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

    // On zoom in:
    if (newDistance > oldDistance) {
      this.timeMarkerRemover.removeMarkersLeft();
      this.timeMarkerRemover.removeMarkersRight();

      if (newDistance > Constants.MAX_DISTANCE) {
        if (store.state.timeMarkerDepth === 1) {
          // If depth < 1 change time system to the next lower system.
          // Ex.: From years to months. From seconds to milliseconds
        }

        this.timeMarkerCreator.addMarkersBetween();
      }
    }

    // On zoom out:
    else if (newDistance < oldDistance) {
      this.timeMarkerCreator.addMarkersLeft();
      this.timeMarkerCreator.addMarkersRight();

      if (newDistance < Constants.MIN_DISTANCE) {
        if (!Number.isSafeInteger(store.state.timeMarkerDepth)) {
          // Change time system to the next higher system.
          // Ex.: From months to years. From milliseconds to seconds.
          // Or throw exception
        }
        this.timeMarkerRemover.removeMarkersLowestDepth();
      }
    }
  }

  private static instance: TimeMarkerWatcher;
  public static get Instance() {
    return this.instance || (this.instance = new this());
  }
}
