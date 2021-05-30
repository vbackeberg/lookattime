import TimeEventModel from "@/models/time-event-model";
import store from "@/store/store";

/**
 * Hide time events that are outside the viewport and shows time events that are inside the viewport.
 */
export default class TimeEventHider {
  private static margin = 1500;

  public static changeTimeEventVisibility(
    viewportLeftEdge: number,
    viewportRightEdge: number
  ) {
    const firstWithinBounds = this.getFirstWithinBounds(viewportLeftEdge);
    const lastWithinBounds = this.getLastWithinBounds(viewportRightEdge);

    for (let i = 0; i < firstWithinBounds; i++) {
      store.state.timeEvents[i].show = false;
    }

    for (let j = firstWithinBounds; j <= lastWithinBounds; j++) {
      store.state.timeEvents[j].show = true;
    }

    for (
      let k = lastWithinBounds + 1, n = store.state.timeEvents.length;
      k < n;
      k++
    ) {
      store.state.timeEvents[k].show = false;
    }
  }

  private static getFirstWithinBounds(viewportLeftEdge: number): number {
    const firstWithinBounds = store.state.timeEvents.findIndex(
      timeEvent =>
        timeEvent.positionCenter + TimeEventModel.expandedWidthOffset >
        viewportLeftEdge - this.margin
    );

    return firstWithinBounds > -1 ? firstWithinBounds : 0;
  }

  private static getLastWithinBounds(viewportRightEdge: number): number {
    const firstOutsideBounds = store.state.timeEvents.findIndex(
      timeEvent =>
        timeEvent.positionCenter - TimeEventModel.expandedWidthOffset >
        viewportRightEdge + this.margin
    );

    return firstOutsideBounds > 0
      ? firstOutsideBounds - 1
      : store.state.timeEvents.length - 1;
  }
}
