import store from "@/store/store";

export default class Viewport { // TODO: rename file name
  static rightEdge(): number {
    return (
      store.state.timelineElement.scrollLeft +
      store.state.timelineElement.clientWidth
    );
  }
}
