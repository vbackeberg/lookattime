import store from "@/store/store";

// TODO rename because viewport is the wrong term
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
