import TimeMarkerModel from "@/models/time-marker-model";
import store from "@/store";
import { v4 as uuid } from "uuid";
import PositionTranslator from "../position-translator";
import { Constants } from "./constants";
import { round } from "mathjs";
export default class TimeMarkerCreator {
  public initiateTimeMarkers() {
    const relativeLeftEdge = PositionTranslator.toRelativePosition(
      Math.min(store.getters.spacerLeft.positionLeft, 0)
    );

    const relativeRightEdge = PositionTranslator.toRelativePosition(
      Math.max(
        store.getters.spacerRight.positionLeft +
          store.getters.spacerRight.width,
        store.state.spacerPageEdge.positionLeft +
          store.state.spacerPageEdge.width
      )
    );

    const markers = [] as TimeMarkerModel[];

    const firstMarker = this.createFirstMarker(
      relativeRightEdge,
      relativeLeftEdge
    );

    const secondMarker = this.createSecondMarker(
      firstMarker.date,
      relativeLeftEdge,
      relativeRightEdge,
      firstMarker.depth
    );
    markers.push(secondMarker);

    store.commit("setTimeMarkers", markers);
    store.commit("setTimeMarkerDepth", secondMarker.depth);

    this.createMarkersLeft();
    this.createMarkersRight();
  }

  private createFirstMarker(
    relativeRightEdge: number,
    relativeLeftEdge: number
  ): TimeMarkerModel {
    let depth = 1;

    while (Math.floor(relativeRightEdge / depth) * depth > relativeLeftEdge) {
      depth *= Constants.DEPTH_BASE;
    }
    depth /= Constants.DEPTH_BASE;

    const date =
      Math.floor(relativeRightEdge / depth) *
      depth;

    return new TimeMarkerModel(
      PositionTranslator.toAbsolutePosition(date),
      uuid(),
      date,
      depth
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
          power / Constants.DEPTH_BASE
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

  public createMarkersLeft() {
    const leftEdge = Math.min(0, store.getters.spacerLeft.positionLeft);
    const lowestMarker = store.state.timeMarkers[0];
    const distanceToEdge = lowestMarker.positionCenter - leftEdge;
    const numberOfMarkers = Math.floor(
      distanceToEdge / store.getters.timeMarkerDistance
    );
    const markers = [] as TimeMarkerModel[];

    for (let i = 1; i <= numberOfMarkers; i++) {
      const date = lowestMarker.date - store.state.timeMarkerDepth * i;
      markers.push(
        new TimeMarkerModel(
          lowestMarker.positionCenter - store.getters.timeMarkerDistance * i,
          uuid(),
          date,
          this.depthOf(date)
        )
      );
    }

    store.commit("unshiftTimeMarkers", markers);
  }

  public createMarkersRight() {
    const rightEdge = Math.max(
      store.getters.spacerRight.positionLeft + store.getters.spacerRight.width,
      store.state.spacerPageEdge.positionLeft + store.state.spacerPageEdge.width
    );
    const highestMarker =
      store.state.timeMarkers[store.state.timeMarkers.length - 1];
    const distanceToEdge = rightEdge - highestMarker.positionCenter;
    const numberOfMarkers = Math.floor(
      distanceToEdge / store.getters.timeMarkerDistance
    );
    const markers = [] as TimeMarkerModel[];

    for (let i = 1; i <= numberOfMarkers; i++) {
      const date = highestMarker.date + store.state.timeMarkerDepth * i;
      markers.push(
        new TimeMarkerModel(
          highestMarker.positionCenter + store.getters.timeMarkerDistance * i,
          uuid(),
          date,
          this.depthOf(date)
        )
      );
    }

    store.commit("pushTimeMarkers", markers);
  }

  private depthOf(date: number) {
    let depth = store.state.timeMarkerDepth;

    while (date % depth === 0) {
      depth *= Constants.DEPTH_BASE;
    }

    return depth /= Constants.DEPTH_BASE;
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
