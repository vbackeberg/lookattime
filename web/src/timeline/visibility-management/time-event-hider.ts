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

    for (let i = firstWithinBounds; i <= lastWithinBounds; i++) {
      store.state.timeEvents[i].show = true;
    }

    for (
      let i = lastWithinBounds + 1, n = store.state.timeEvents.length;
      i < n;
      i++
    ) {
      store.state.timeEvents[i].show = false;
    }
  }

  private static getFirstWithinBounds(viewportLeftEdge: number): number {
    return store.state.timeEvents.findIndex(
      timeEvent =>
        timeEvent.positionCenter + TimeEventModel.expandedWidthOffset >
        viewportLeftEdge - this.margin
    );
  }

  private static getLastWithinBounds(viewportRightEdge: number): number {
    const firstOutsideBounds = store.state.timeEvents.findIndex(
      timeEvent =>
        timeEvent.positionCenter - TimeEventModel.expandedWidthOffset >
        viewportRightEdge + this.margin
    );

    return firstOutsideBounds > -1
      ? firstOutsideBounds - 1
      : store.state.timeEvents.length - 1;
  }
}
