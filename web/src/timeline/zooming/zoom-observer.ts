import store from "@/store/store";
import FullscreenEventTarget from "../fullscreen-event-target";
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
    this.observe();
    this.pauseOnFullscreen();
  }

  private observe() {
    this.timelineElement.addEventListener("wheel", this.changeZoom);
  }

  private changeZoom = (e: WheelEvent) => {
    if (e.shiftKey || e.metaKey || e.ctrlKey || e.altKey) {
      return;
    }

    e.preventDefault();

    if (store.state.timeEvents.length === 0) {
      return;
    }

    if (e.deltaY < 0) {
      this.zoomer.zoom(0.92, e.pageX + this.timelineElement.scrollLeft);
    } else if (e.deltaY > 0) {
      this.zoomer.zoom(1.1, e.pageX + this.timelineElement.scrollLeft);
    }
  };

  private pauseOnFullscreen() {
    FullscreenEventTarget.Instance.addEventListener("fullscreen-toggled", e => {
      (<CustomEvent>e).detail.isFullscreen
        ? this.timelineElement.removeEventListener("wheel", this.changeZoom)
        : this.observe();
    });
  }

  private static instance: ZoomObserver;
  public static get Instance() {
    return this.instance || (this.instance = new this());
  }
}
