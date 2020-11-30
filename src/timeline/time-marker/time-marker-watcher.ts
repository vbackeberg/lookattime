import store from "@/store";
import PositionTranslator from "../position-translator";
import TimeMarkerCreator from "./time-marker-creator";

export default class TimeMarkerWatcher {
  private timeMarkerCreator: TimeMarkerCreator;
  constructor() {
    this.timeMarkerCreator = TimeMarkerCreator.Instance;
  }

  public watch(newDistance: number, oldDistance: number) {
    if (store.state.boxes.length < 2) return;

    const maxDistance = 500;
    const minDistance = 200;

    // On zoom in:
    if (newDistance > oldDistance) {
      // TODO Check if markers have been moved outside
      // the spacer-bounded area and remove them.
    }

    // On zoom out:
    if (newDistance < oldDistance) {
      const relativeLeftEdge = PositionTranslator.toRelativePosition(
        Math.min(store.getters.spacerLeft.positionLeft, 0)
      );
      store.commit(
        "unshiftTimeMarkers",
        this.timeMarkerCreator.createMarkersLeft(
          store.state.timeMarkers[0],
          relativeLeftEdge,
          store.state.timeMarkerDepth
        )
      );

      const relativeRightEdge = PositionTranslator.toRelativePosition(
        Math.max(
          store.getters.spacerRight.positionLeft +
            store.getters.spacerRight.width,
          store.state.spacerPageEdge.positionLeft +
            store.state.spacerPageEdge.width
        )
      );

      store.commit(
        "pushTimeMarkers",
        this.timeMarkerCreator.createMarkersRight(
          store.state.timeMarkers[store.state.timeMarkers.length - 1],
          relativeRightEdge,
          store.state.timeMarkerDepth
        )
      );
    }

    if (newDistance > maxDistance) {
      // Add in between
    }

    if (newDistance < minDistance) {
      // remove markers at current depth
      // increase depth by ^10
    }
  }

  private static instance: TimeMarkerWatcher;
  public static get Instance() {
    return this.instance || (this.instance = new this());
  }
}
