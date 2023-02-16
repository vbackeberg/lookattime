import store from "@/store/store";

export default class Viewport {
  /**
   * @returns scrollLeft + clientWidth
   */
  static rightEdge(): number {
    return (
      store.state.timelineElement.scrollLeft +
      store.state.timelineElement.clientWidth
    );
  }
}
