import store from "@/store/store";

/**
 * Helper to remove all time markers.
 */
export default class TimeMarkerRemover {
  /**
   * First removes the HTML element of each marker, then removes the
   * marker itself.
   */
  public static removeAllMarkers() {
    store.state.timeMarkers.forEach(marker => {
      marker.htmlElement.remove();
    });

    store.state.timeMarkers = [];
  }
}
