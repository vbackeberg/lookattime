import store from "@/store/store";

/**
 * Converts a date into absolute positions on screen and vice versa.
 */
export default class PositionTranslator {
  public static toAbsolutePosition(date: number): number {
    return date / store.state.zoomLevel + store.state.timelineZero;
  }

  public static toDate(absolutePosition: number): number {
    return (
      (absolutePosition - store.state.timelineZero) * store.state.zoomLevel
    );
  }
}
