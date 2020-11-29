import store from "@/store";

export default class PositionTranslator {
  public static toAbsolutePosition(relativePosition: number): number {
    return store.state.timelineZero + relativePosition * store.state.zoomLevel;
  }

  // to relative Position
}
