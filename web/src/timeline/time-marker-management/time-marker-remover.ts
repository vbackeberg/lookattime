import TimeMarker from "@/models/time-marker";
import store from "@/store/store";
import Viewport from "../viewport/viewport";
import { Constants } from "./constants";

/**
 * Removes time markers from the sides and from between.
 */
export default class TimeMarkerRemover {
  private timelineElement: HTMLElement;

  constructor() {
    this.timelineElement = store.state.timelineElement;
  }

  /**
   * Remove all markers that have a position below zero.
   */
  public removeMarkersLeft() {
    const index = store.state.timeMarkers.findIndex(
      marker => marker.positionCenter > 0
    );

    if (index > 0) {
      for (let i = 0; i < index; i++) {
        store.state.timeMarkers[i].htmlElement.remove();
      }

      store.state.timeMarkers = store.state.timeMarkers.slice(index);
    }
  }

  /**
   * Remove all markers that exceed the right edge of the timeline.
   * The right edge of the timeline is the maximum of
   * - the current viewport's right edge,
   * - the position of spacer right.
   */
  public removeMarkersRight() {
    const index = store.state.timeMarkers.findIndex(
      marker =>
        marker.positionCenter >
        Math.max(
          Viewport.rightEdge(),
          store.state.spacerRight.positionLeft + store.state.spacerRight.width
        )
    );

    if (index > -1) {
      for (let i = index; i < store.state.timeMarkers.length; i++) {
        store.state.timeMarkers[i].htmlElement.remove();
      }

      store.state.timeMarkers = store.state.timeMarkers.slice(0, index);
    }
  }

  public removeMarkersLowestDepth() {
    store.state.timeMarkerDepth =
      store.state.timeMarkerDepth * Constants.DEPTH_BASE;

    let markers: TimeMarker[] = [];

    for (let i = 0; i < store.state.timeMarkers.length; i++) {
      if (store.state.timeMarkers[i].depth >= store.state.timeMarkerDepth) {
        markers.push(store.state.timeMarkers[i]);
      } else {
        store.state.timeMarkers[i].htmlElement.remove();
      }
    }

    store.state.timeMarkers = markers;
  }

  public removeAllMarkers() {
    store.state.timeMarkers.forEach(marker => {
      marker.htmlElement.remove();
    });

    store.state.timeMarkers = [];
  }

  private static instance: TimeMarkerRemover;
  public static get Instance() {
    return this.instance || (this.instance = new this());
  }
}
