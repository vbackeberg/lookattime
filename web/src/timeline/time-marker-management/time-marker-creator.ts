import TimeMarkerModel from "@/models/time-marker-model";
import store from "@/store";
import { v4 as uuid } from "uuid";
import PositionTranslator from "../position-translator";
import { Constants } from "./constants";

/**
 * Initiates the time marker array. Adds a marker at date 0 and expands markers to both sides.
 */
export default class TimeMarkerCreator {
  public initiateTimeMarkers() {
    const firstMarker = this.createFirstMarker();
    const secondMarker = this.createSecondMarker();

    store.commit("setTimeMarkers", [firstMarker, secondMarker]);
    store.commit("setTimeMarkerDepth", secondMarker.depth);

    this.addMarkersLeft();
    this.addMarkersRight();
  }

  private createFirstMarker() {
    return new TimeMarkerModel(
      store.state.timelineZero,
      uuid(),
      0,
      Number.MAX_SAFE_INTEGER
    );
  }

  private createSecondMarker() {
    const highestDate = PositionTranslator.toRelativePosition(
      store.state.timelineElement.scrollLeft +
        store.state.timelineElement.clientWidth
    );

    let depth = 1;

    while (depth < highestDate) {
      depth *= Constants.DEPTH_BASE;
    }
    depth /= Constants.DEPTH_BASE;

    return new TimeMarkerModel(
      PositionTranslator.toAbsolutePosition(depth),
      uuid(),
      depth,
      depth
    );
  }

  public addMarkersLeft() {
    const leftEdge = Math.min(0, store.getters.spacerLeft.positionLeft); // Use store left edge
    const lowestMarker = store.state.timeMarkers[0];
    const distanceToEdge = lowestMarker.positionCenter - leftEdge;
    const numberOfMarkers = Math.floor(
      distanceToEdge / store.getters.timeMarkerDistance
    );

    if (numberOfMarkers > 0) {
      const markers = [] as TimeMarkerModel[];

      for (let i = numberOfMarkers; i > 0; i--) {
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

      store.dispatch("unshiftTimeMarkers", markers);
    }
  }

  public addMarkersRight() {
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

    if (numberOfMarkers > 0) {
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

      store.dispatch("pushTimeMarkers", markers);
    }
  }

  public addMarkersBetween() {
    store.commit(
      "setTimeMarkerDepth",
      store.state.timeMarkerDepth / Constants.DEPTH_BASE
    );

    const markers = [] as TimeMarkerModel[];
    for (let i = 0, n = store.state.timeMarkers.length; i < n - 1; i++) {
      markers[i * 10] = store.state.timeMarkers[i];
      for (let m = 1; m < 10; m++) {
        markers[i * 10 + m] = new TimeMarkerModel(
          store.state.timeMarkers[i].positionCenter +
            (store.getters.timeMarkerDistance / 10) * m,
          uuid(),
          store.state.timeMarkers[i].date + store.state.timeMarkerDepth * m,
          store.state.timeMarkerDepth
        );
      }
    }
    markers[markers.length] =
      store.state.timeMarkers[store.state.timeMarkers.length - 1];

    store.commit("setTimeMarkers", markers);
    store.dispatch("setTimeMarkers", markers);
  }

  public addSingleMarkerLeft() {
    store.commit("unshiftTimeMarkers", [
      new TimeMarkerModel(
        PositionTranslator.toAbsolutePosition(
          store.state.timeMarkers[0].date - store.state.timeMarkerDepth
        ),
        uuid(),
        store.state.timeMarkers[0].date - store.state.timeMarkerDepth,
        store.state.timeMarkerDepth
      )
    ]);
  }

  private depthOf(date: number) {
    if (date === 0) {
      return Number.MAX_SAFE_INTEGER;
    }

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
