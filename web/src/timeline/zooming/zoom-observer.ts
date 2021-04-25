import store from "@/store/store";
import Zoomer from "./zoomer";

/**
 * Observes mouse wheel events and calls zoomer with zoom factor according to wheel spin direction.
 */
export default class ZoomObserver {
  private timelineElement: HTMLElement;
  private zoomer: Zoomer;
  private constructor() {
    this.zoomer = Zoomer.Instance;

    this.timelineElement = store.state.timelineElement;
    this.timelineElement.addEventListener("wheel", (e: WheelEvent) => {
      if (e.shiftKey || e.metaKey || e.ctrlKey || e.altKey) {
        return;
      }
      this.changeZoom(e);
    });
  }

  private changeZoom(e: WheelEvent) {
    if (e.deltaY < 0) {
      this.zoomer.zoom(1.1, e.pageX + this.timelineElement.scrollLeft);
    } else if (e.deltaY > 0) {
      this.zoomer.zoom(0.92, e.pageX + this.timelineElement.scrollLeft);
    }
  }

  private static instance: ZoomObserver;
  public static get Instance() {
    return this.instance || (this.instance = new this());
  }
}
