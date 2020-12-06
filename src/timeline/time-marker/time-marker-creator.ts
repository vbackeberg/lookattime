import TimeMarkerModel from "@/models/time-marker-model";
import store from "@/store";
import { v4 as uuid } from "uuid";
import PositionTranslator from "../position-translator";
import { Constants } from "./constants";
export default class TimeMarkerCreator {
  public initiateTimeMarkers() {
    const relativeLeftEdge = PositionTranslator.toRelativePosition(store.getters.leftEdge);
    const relativeRightEdge = PositionTranslator.toRelativePosition(store.getters.rightEdge);

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
    markers.push(firstMarker, secondMarker);
    markers.sort((a, b) => a.date - b.date);

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
    depth: number
  ): TimeMarkerModel {
    let secondMarkerDate = firstMarkerDate - depth;
    if (secondMarkerDate < relativeLeftEdge) {
      secondMarkerDate = firstMarkerDate + depth;
      if (secondMarkerDate > relativeRightEdge) {
        return this.createSecondMarker(
          firstMarkerDate,
          relativeLeftEdge,
          relativeRightEdge,
          depth / Constants.DEPTH_BASE
        );
      }
    }
    return new TimeMarkerModel(
      PositionTranslator.toAbsolutePosition(secondMarkerDate),
      uuid(),
      secondMarkerDate,
      depth
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

    return (depth /= Constants.DEPTH_BASE);
  }
  
  private static instance: TimeMarkerCreator;
  public static get Instance() {
    return this.instance || (this.instance = new this());
  }
}
