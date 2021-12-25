import store from "@/store/store";
import Big from "big.js";

export default class PositionTranslator {
  public static toAbsolutePosition(relativePosition: bigint): number {
    return relativePosition / store.state.zoomLevel + store.state.timelineZero;
  }

  public static toRelativePosition(absolutePosition: number): bigint {
    return (
      (absolutePosition - store.state.timelineZero) / store.state.zoomLevel
    );
  }
}
