import { useLookAtTime } from "@/store/store";

/**
 * Converts a date into absolute positions on screen and vice versa.
 */
export default class PositionTranslator {
  private constructor(private store = useLookAtTime()) { }
  public toAbsolutePosition(date: number): number {
    return date / this.store.zoomLevel + this.store.timelineZero;
  }

  public toDate(absolutePosition: number): number {
    return Math.round(
      (absolutePosition - this.store.timelineZero) * this.store.zoomLevel
    );
  }

  private static instance: PositionTranslator;
  public static get Instance() {
    return this.instance || (this.instance = new this());
  }
}
