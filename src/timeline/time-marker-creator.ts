import TimeMarkerModel from "@/models/time-marker-model";
import store from "@/store";
import { v4 as uuid } from "uuid";

export default class TimeMarkerCreator {
  public addTimeMarkers() {
    const relativeLeftEdge =
      (store.getters.spacerLeft.positionLeft - store.state.timelineZero) /
      store.state.zoomLevel;

    const relativeRightEdge =
      (store.getters.spacerRight.positionLeft +
        store.getters.spacerRight.width -
        store.state.timelineZero) /
      store.state.zoomLevel;

    this.initiateMarkers(relativeRightEdge, relativeLeftEdge);
  }

  private initiateMarkers(relativeRightEdge: number, relativeLeftEdge: number) {
    store.state.timeMarkers = [] as TimeMarkerModel[];
    const base = 10;

    const firstMarker = this.createFirstMarker(
      relativeRightEdge,
      relativeLeftEdge,
      base,
      base
    );
    store.state.timeMarkers.push(firstMarker);

    const secondMarker = this.createSecondMarker(
      firstMarker.date,
      relativeLeftEdge,
      relativeRightEdge,
      firstMarker.depth,
      base
    );
    store.state.timeMarkers.push(secondMarker);
  }

  private createFirstMarker(
    relativeRightEdge: number,
    relativeLeftEdge: number,
    power: number,
    base: number
  ): TimeMarkerModel {
    if (
      Math.floor(relativeRightEdge / (power * base)) * (power * base) >
      relativeLeftEdge
    ) {
      return this.createFirstMarker(
        relativeRightEdge,
        relativeLeftEdge,
        power * base,
        base
      );
    }

    const lowestDepthDate = Math.floor(relativeRightEdge / power) * power;

    return new TimeMarkerModel(
      store.state.timelineZero + lowestDepthDate * store.state.zoomLevel,
      uuid(),
      lowestDepthDate,
      power
    );
  }

  private createSecondMarker(
    firstMarkerDate: number,
    relativeLeftEdge: number,
    relativeRightEdge: number,
    power: number,
    base: number
  ): TimeMarkerModel {
    let secondMarkerDate = firstMarkerDate - power; // 1. 1900 - 100 / 10^0 = 1800    | 2. 1900 - 100 / 10^1 = 1890
    if (secondMarkerDate < relativeLeftEdge) {
      // 1. 1800 < 1899   | 2. 1890 < 1899
      secondMarkerDate = firstMarkerDate + power; // 1. 1900 + 100 / 10^0= 2000   | 2. 1900 + 100 / 10^1 = 1910
      if (secondMarkerDate > relativeRightEdge) {
        // 1. 2000 > 1950   | 2. 1910 !> 1950
        return this.createSecondMarker(
          firstMarkerDate,
          relativeLeftEdge,
          relativeRightEdge,
          power / base,
          base
        );
      }
    }
    return new TimeMarkerModel(
      store.state.timelineZero + secondMarkerDate * store.state.zoomLevel,
      uuid(),
      secondMarkerDate,
      power
    ); // 2. return 1910
  }

  private static instance: TimeMarkerCreator;
  public static get Instance() {
    return this.instance || (this.instance = new this());
  }
}
