import store from "@/store";
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
      // TODO: Instead of 0, compare with scroll left.
      const leftEdge = Math.min(store.getters.spacerLeft.positionLeft, 0);
      if (store.state.timeMarkers[0].positionCenter - leftEdge > newDistance) {
        store.commit(
          "unshiftTimeMarkers",
          this.timeMarkerCreator.createMarkersLeft // TODO call function
        );
      }

      const rightEdge = Math.max(
        store.getters.spacerRight.positionLeft +
          store.getters.spacerRight.width,
        store.state.spacerPageEdge.positionLeft +
          store.state.spacerPageEdge.width
      );
      if (
        rightEdge -
          store.state.timeMarkers[store.state.timeMarkers.length - 1]
            .positionCenter >
        newDistance
      ) {
        store.commit(
          "pushTimeMarkers",
          this.timeMarkerCreator.createMarkersRight // TODO call function
        );
      }
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
