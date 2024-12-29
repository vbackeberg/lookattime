import { useLookAtTime } from "@/store/store";

/**
 * Helper to remove all time markers.
 */
export default class TimeMarkerRemover {
  private constructor(private store = useLookAtTime()) { }

  /**
   * First removes the HTML element of each marker, then removes the
   * marker itself.
   */
  public removeAllMarkers() {
    this.store.timeMarkers.forEach(marker => {
      marker.htmlElement.remove();
    });

    this.store.timeMarkers = [];
  }

  private static instance: TimeMarkerRemover;
  public static get Instance(): TimeMarkerRemover {
    return this.instance || (this.instance = new this());
  }
}
