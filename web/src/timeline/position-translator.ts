import { useLookAtTime } from "@/store/store";

/**
 * Converts a date into absolute positions on screen and vice versa.
 */
export default class PositionTranslator {
  private static store = useLookAtTime();
  public static toAbsolutePosition(date: number): number {
    return date / this.store.zoomLevel + this.store.timelineZero;
  }

  public static toDate(absolutePosition: number): number {
    return Math.round(
      (absolutePosition - this.store.timelineZero) * this.store.zoomLevel
    );
  }
}
