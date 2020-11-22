import TimeMarkerModel from "@/models/time-marker-model";
import store from "@/store";
import { v4 as uuid } from "uuid";

export default class TimeMarkerCreator {
  public addTimeMarkers() {
    const relativeLeftEdge =
      (store.getters.spacerLeft.positionLeft - store.state.timelineZero) /
      store.state.zoomLevel;

    const relativeRightEdge =
      (store.getters.spacerRight.positionLeft +
        store.getters.spacerRight.width -
        store.state.timelineZero) /
      store.state.zoomLevel;

    let timeMarkerRelativePosition;

    if (relativeRightEdge > 0) {
      timeMarkerRelativePosition = this.round(
        relativeLeftEdge,
        relativeRightEdge
      );

      const timeMarker = new TimeMarkerModel(
        store.state.timelineZero +
          timeMarkerRelativePosition * store.state.zoomLevel,
        uuid(),
        timeMarkerRelativePosition
      );

      store.state.timeMarkers.push(timeMarker);
    }
    // TODO: if rel right edge < 0
  }

  private round(relativeLeftEdge: number, relativeRightEdge: number): number {
    let result = relativeRightEdge;

    let i = 10;
    while (Math.floor(result / i) * i > relativeLeftEdge) {
      result = Math.floor(result / i) * i;
      i *= 10;
    }
    return result;
  }

  private static instance: TimeMarkerCreator;
  public static get Instance() {
    return this.instance || (this.instance = new this());
  }
}
