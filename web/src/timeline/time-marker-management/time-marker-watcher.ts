import store from "@/store";
import { Constants } from "./constants";
import TimeMarkerCreator from "./time-marker-creator";
import TimeMarkerRemover from "./time-marker-remover";

/**
 * Manages the time marker array from changes in the time marker distance.
 */
export default class TimeMarkerWatcher {
  private timeMarkerCreator: TimeMarkerCreator;
  private timeMarkerRemover: TimeMarkerRemover;

  constructor() {
    this.timeMarkerCreator = TimeMarkerCreator.Instance;
    this.timeMarkerRemover = TimeMarkerRemover.Instance;
  }

  public watch(newDistance: number, oldDistance: number) {
    if (store.state.timeMarkers.length === 1) {
      this.timeMarkerCreator.addSingleMarkerLeft();
      return;
    }

    if (newDistance > oldDistance) {
      this.onZoomIn(newDistance);
    } else if (newDistance < oldDistance) {
      this.onZoomOut(newDistance);
    }
  }
  private onZoomIn(newDistance: number) {
    if (store.state.timeMarkers.length > 2) {
      this.timeMarkerRemover.removeMarkersLeft();
      this.timeMarkerRemover.removeMarkersRight();
    }

    if (newDistance > Constants.MAX_DISTANCE) {
      if (store.state.timeMarkerDepth === 1) {
        return;
        // TODO: If depth < 1 change time system to the next lower system.
        // Ex.: From years to months. From seconds to milliseconds
      }

      this.timeMarkerCreator.addMarkersBetween();
    }
  }

  private onZoomOut(newDistance: number) {
    this.timeMarkerCreator.addMarkersLeft();
    this.timeMarkerCreator.addMarkersRight();

    if (newDistance < Constants.MIN_DISTANCE) {
      if (store.state.timeMarkerDepth === Number.MAX_SAFE_INTEGER) {
        return;

        // TODO: Change time system to the next higher system.
        // Ex.: From months to years. From milliseconds to seconds.
        // Or throw exception
      }

      this.timeMarkerRemover.removeMarkersLowestDepth();
    }
  }

  private static instance: TimeMarkerWatcher;
  public static get Instance() {
    return this.instance || (this.instance = new this());
  }
}
