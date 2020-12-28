import store from "@/store";

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

    console.log("index first marker within bounds " + firstWithinBounds);
    console.log("index last marker within bounds " + lastWithinBounds);

    for (let i = 0; i < firstWithinBounds; i++) {
      store.state.timeMarkers[i].show = false;
    }

    for (let i = firstWithinBounds; i <= lastWithinBounds; i++) {
      store.state.timeMarkers[i].show = true;
    }

    for (
      let i = lastWithinBounds + 1, n = store.state.timeMarkers.length;
      i < n;
      i++
    ) {
      store.state.timeMarkers[i].show = false;
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

    return firstOutsideBounds > -1
      ? firstOutsideBounds - 1
      : store.state.timeMarkers.length - 1;
  }
}
