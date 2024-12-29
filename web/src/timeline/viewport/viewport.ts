import { useLookAtTime } from "@/store/store";

export default class Viewport {
  private constructor (private store = useLookAtTime()) {};

  /**
   * @returns scrollLeft + clientWidth
   */
  rightEdge(): number {
    return (
      this.store.timelineElement!.scrollLeft +
      this.store.timelineElement!.clientWidth
    );
  }

  private static instance: Viewport;
  public static get Instance() {
    return this.instance || (this.instance = new this());
  }}
