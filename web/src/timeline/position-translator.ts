import store from "@/store/store";

/**
 * Converts dates into absolute positions on screen and vice versa.
 */
export default class PositionTranslator {
  public static toAbsolutePosition(relativePosition: number): number {
    return relativePosition * store.state.zoomLevel + store.state.timelineZero;
  }

  public static toRelativePosition(absolutePosition: number): number {
    return (
      (absolutePosition - store.state.timelineZero) / store.state.zoomLevel
    );
  }
}
