import store from "@/store/store";

/**
 * Hides time markers that are outside the viewport and shows time markers that are inside the viewport.
 */
export default class TimeMarkerHider {
  public static changeTimeMarkerVisibility(
    viewportLeftEdge: number,
    viewportRightEdge: number
  ) {
    const firstWithinBounds = this.getFirstWithinBounds(viewportLeftEdge);
    const lastWithinBounds = this.getLastWithinBounds(viewportRightEdge);

    for (let i = 0; i < firstWithinBounds; i++) {
      store.state.timeMarkers[i].show = false;
    }

    for (let j = firstWithinBounds; j <= lastWithinBounds; j++) {
      store.state.timeMarkers[j].show = true;
    }

    for (
      let k = lastWithinBounds + 1, n = store.state.timeMarkers.length;
      k < n;
      k++
    ) {
      store.state.timeMarkers[k].show = false;
    }
  }

  private static getFirstWithinBounds(viewportLeftEdge: number): number {
    return store.state.timeMarkers.findIndex(
      marker => marker.positionCenter > viewportLeftEdge
    );
  }

  private static getLastWithinBounds(viewportRightEdge: number): number {
    const firstOutsideBounds = store.state.timeMarkers.findIndex(
      marker => marker.positionCenter > viewportRightEdge
    );

    return firstOutsideBounds > -1 // TODO: Can firstOutsideBounds be index 0?
      ? firstOutsideBounds - 1
      : store.state.timeMarkers.length - 1;
  }
}
