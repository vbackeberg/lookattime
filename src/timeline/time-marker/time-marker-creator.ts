import TimeMarkerModel from "@/models/time-marker-model";
import store from "@/store";
import { v4 as uuid } from "uuid";
import PositionTranslator from "../position-translator";
import { Constants } from "./constants";
import { round } from "mathjs";
export default class TimeMarkerCreator {
  public createTimeMarkers() {
    const relativeLeftEdge = PositionTranslator.toRelativePosition(
      Math.min(store.getters.spacerLeft.positionLeft, 0) // TODO: Instead of 0, compare with scroll left.
    );

    const relativeRightEdge = PositionTranslator.toRelativePosition(
      Math.max(
        store.getters.spacerRight.positionLeft +
          store.getters.spacerRight.width,
        store.state.spacerPageEdge.positionLeft +
          store.state.spacerPageEdge.width
      )
    );

    const timeMarkers = [] as TimeMarkerModel[];

    const firstMarker = this.createFirstMarker(
      relativeRightEdge,
      relativeLeftEdge,
      -this.countDecimals(relativeRightEdge)
    );
    timeMarkers.push(firstMarker);

    const secondMarker = this.createSecondMarker(
      firstMarker.date,
      relativeLeftEdge,
      relativeRightEdge,
      firstMarker.depth
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
    store.commit("setTimeMarkerDepth", secondMarker.depth);
  }

  private createFirstMarker(
    relativeRightEdge: number,
    relativeLeftEdge: number,
    exponent: number
  ): TimeMarkerModel {
    // Additional rounding fixes Chrome bug: https://stackoverflow.com/questions/55958535
    const depth = round(
      Constants.MARKER_BASE ** (exponent + 1),
      Math.abs(exponent + 1)
    );

    if (Math.floor(relativeRightEdge / depth) * depth > relativeLeftEdge) {
      return this.createFirstMarker(
        relativeRightEdge,
        relativeLeftEdge,
        exponent + 1
      );
    }

    const highestPossibleDepth = Constants.MARKER_BASE ** exponent;
    const date =
      Math.floor(relativeRightEdge / highestPossibleDepth) *
      highestPossibleDepth;

    return new TimeMarkerModel(
      PositionTranslator.toAbsolutePosition(date),
      uuid(),
      date,
      highestPossibleDepth
    );
  }

  private createSecondMarker(
    firstMarkerDate: number,
    relativeLeftEdge: number,
    relativeRightEdge: number,
    power: number
  ): TimeMarkerModel {
    let secondMarkerDate = firstMarkerDate - power;
    if (secondMarkerDate < relativeLeftEdge) {
      secondMarkerDate = firstMarkerDate + power;
      if (secondMarkerDate > relativeRightEdge) {
        return this.createSecondMarker(
          firstMarkerDate,
          relativeLeftEdge,
          relativeRightEdge,
          power / Constants.MARKER_BASE
        );
      }
    }
    return new TimeMarkerModel(
      PositionTranslator.toAbsolutePosition(secondMarkerDate),
      uuid(),
      secondMarkerDate,
      power
    );
  }

  public createMarkersLeft(
    leftmostMarker: TimeMarkerModel,
    relativeLeftEdge: number,
    depth: number
  ): TimeMarkerModel[] {
    const distanceToEdge = leftmostMarker.date - relativeLeftEdge;
    const numberOfMarkers = Math.floor(distanceToEdge / depth);
    const absoluteMarkerDistance = depth * store.state.zoomLevel;
    const markers = [] as TimeMarkerModel[];

    for (let i = 1; i <= numberOfMarkers; i++) {
      markers.push(
        new TimeMarkerModel(
          leftmostMarker.positionCenter - absoluteMarkerDistance * i,
          uuid(),
          leftmostMarker.date - depth * i,
          depth
        )
      );
    }

    return markers;
  }

  public createMarkersRight(
    rightmostMarker: TimeMarkerModel,
    relativeRightEdge: number,
    depth: number
  ): TimeMarkerModel[] {
    const distanceToEdge = relativeRightEdge - rightmostMarker.date;
    const numberOfMarkers = Math.floor(distanceToEdge / depth);
    const absoluteMarkerDistance = depth * store.state.zoomLevel;
    const markers = [] as TimeMarkerModel[];

    for (let i = 1; i <= numberOfMarkers; i++) {
      markers.push(
        new TimeMarkerModel(
          rightmostMarker.positionCenter + absoluteMarkerDistance * i,
          uuid(),
          rightmostMarker.date + depth * i,
          depth
        )
      );
    }
    return markers;
  }

  public removeMarkersLeft() {
    const leftEdge = Math.min(0, store.getters.spacerLeft.positionLeft);

    const index = store.state.timeMarkers.findIndex(
      marker => marker.positionCenter > leftEdge
    );

    console.log("Remove markers below index: " + index);

    if (index > 0) {
      store.commit("setTimeMarkers", store.state.timeMarkers.slice(index));
    }
  }

  public removeMarkersRight() {
    const rightEdge = Math.max(
      store.getters.spacerRight.positionLeft + store.getters.spacerRight.width,
      store.state.spacerPageEdge.positionLeft + store.state.spacerPageEdge.width
    );

    const index = store.state.timeMarkers.findIndex(
      marker => marker.positionCenter > rightEdge
    );

    console.log("Remove markers above index: " + index);

    if (index > -1) {
      store.commit("setTimeMarkers", store.state.timeMarkers.slice(0, index));
    }
  }

  private countDecimals(number: number) {
    if (!isFinite(number)) return 0;

    let factor = 1;
    let numberOfDecimals = 0;
    while (Math.round(number * factor) / factor !== number) {
      factor *= 10;
      numberOfDecimals++;
    }
    return numberOfDecimals;
  }

  private static instance: TimeMarkerCreator;
  public static get Instance() {
    return this.instance || (this.instance = new this());
  }
}
