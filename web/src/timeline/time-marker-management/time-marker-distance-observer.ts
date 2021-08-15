import store from "@/store/store";
import PositionTranslator from "../position-translator";
import SpaceObserver from "../space-management/space-observer";
import { Constants } from "./constants";
import TimeMarkerCreator from "./time-marker-creator";
import TimeMarkerRemover from "./time-marker-remover";

/**
 * Manages the time marker array from changes in the time marker distance.
 */
export default class TimeMarkerDistanceObserver {
  private timeMarkerCreator: TimeMarkerCreator;
  private timeMarkerRemover: TimeMarkerRemover;
  private lastTimeMarkerDistance = 0;

  constructor() {
    this.timeMarkerCreator = TimeMarkerCreator.Instance;
    this.timeMarkerRemover = TimeMarkerRemover.Instance;

    SpaceObserver.Instance.eventTarget.addEventListener(
      "space-management-end",
      () => {
        this.observe();
      }
    );
  }

  public observe() {
    if (store.state.timeMarkers.length === 0) {
      TimeMarkerCreator.Instance.initiateTimeMarkers();
    }

    if (store.state.timeMarkers.length === 1) {
      this.timeMarkerCreator.addSingleMarkerLeft();
    }

    const newDistance = this.timeMarkerDistance();

    if (newDistance === this.lastTimeMarkerDistance) {
      return;
    }

    if (newDistance > this.lastTimeMarkerDistance) {
      this.onZoomIn(newDistance);
    } else if (newDistance < this.lastTimeMarkerDistance) {
      this.onZoomOut(newDistance);
    }

    this.lastTimeMarkerDistance = newDistance;
    this.observe();
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
      if (store.state.timeMarkerDepth === Constants.MAX_DEPTH) {
        return;

        // TODO: Change time system to the next higher system.
        // Ex.: From months to years. From milliseconds to seconds.
        // Or throw exception
      }

      this.timeMarkerRemover.removeMarkersLowestDepth();
    }
  }

  private timeMarkerDistance() {
    return (
      PositionTranslator.toAbsolutePosition(store.state.timeMarkerDepth * 2) -
      PositionTranslator.toAbsolutePosition(store.state.timeMarkerDepth)
    );
  }

  private static instance: TimeMarkerDistanceObserver;
  public static get Instance() {
    return this.instance || (this.instance = new this());
  }
}
