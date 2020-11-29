import TimeMarkerModel from "@/models/time-marker-model";
import store from "@/store";
import { v4 as uuid } from "uuid";
export default class TimeMarkerCreator {
  public createTimeMarkers() {
    const relativeLeftEdge = Math.min(
      (store.getters.spacerLeft.positionLeft - store.state.timelineZero) /
        store.state.zoomLevel,
      (0 - store.state.timelineZero) / store.state.zoomLevel
    );

    const relativeRightEdge = Math.max(
      (store.getters.spacerRight.positionLeft +
        store.getters.spacerRight.width -
        store.state.timelineZero) /
        store.state.zoomLevel,
      (store.state.spacerPageEdge.positionLeft +
        store.state.spacerPageEdge.width -
        store.state.timelineZero) /
        store.state.zoomLevel
    );

    const timeMarkers = [] as TimeMarkerModel[];
    const base = 10;

    const firstMarker = this.createFirstMarker(
      relativeRightEdge,
      relativeLeftEdge,
      base,
      base
    );
    timeMarkers.push(firstMarker);

    const secondMarker = this.createSecondMarker(
      firstMarker.date,
      relativeLeftEdge,
      relativeRightEdge,
      firstMarker.depth,
      base
    );
    timeMarkers.push(secondMarker);

    timeMarkers.unshift(
      ...this.createMarkersLeft(
        secondMarker.date < firstMarker.date ? secondMarker : firstMarker,
        relativeLeftEdge,
        secondMarker.depth
      )
    );

    timeMarkers.push(
      ...this.createMarkersRight(
        secondMarker.date > firstMarker.date ? secondMarker : firstMarker,
        relativeRightEdge,
        secondMarker.depth
      )
    );

    store.commit("setTimeMarkers", timeMarkers);
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

  public createMarkersLeft(
    leftmostMarker: TimeMarkerModel,
    relativeLeftEdge: number,
    markerDistance: number
  ): TimeMarkerModel[] {
    // first marker, 1899, 10
    const distanceToEdge = leftmostMarker.date - relativeLeftEdge; // 1900 - 1899 = 1
    const numberOfMarkers = Math.floor(distanceToEdge / markerDistance); // floor (1 / 10) = 0
    const absoluteMarkerDistance = markerDistance * store.state.zoomLevel;
    const markers = [] as TimeMarkerModel[];

    for (let i = 1; i <= numberOfMarkers; i++) {
      markers.push(
        new TimeMarkerModel(
          leftmostMarker.positionCenter - absoluteMarkerDistance * i,
          uuid(),
          leftmostMarker.date - markerDistance * i,
          markerDistance // relative marker distance = depth = power
        )
      );
    }

    return markers;
  }

  public createMarkersRight(
    rightmostMarker: TimeMarkerModel,
    relativeRightEdge: number,
    markerDistance: number
  ): TimeMarkerModel[] {
    // second marker, 1950, 10
    const distanceToEdge = relativeRightEdge - rightmostMarker.date; // 1950 - 1910 = 40
    const numberOfMarkers = Math.floor(distanceToEdge / markerDistance); // floor (40 / 10) = 4
    const absoluteMarkerDistance = markerDistance * store.state.zoomLevel;
    const markers = [] as TimeMarkerModel[];

    for (let i = 1; i <= numberOfMarkers; i++) {
      markers.push(
        new TimeMarkerModel(
          rightmostMarker.positionCenter + absoluteMarkerDistance * i,
          uuid(),
          rightmostMarker.date + markerDistance * i,
          markerDistance // relative marker distance = depth = power
        )
      );
    }
    return markers;
  }

  private static instance: TimeMarkerCreator;
  public static get Instance() {
    return this.instance || (this.instance = new this());
  }
}
