import { useLookAtTime } from "@/store/store";
import Zoomer from "./zoomer";
import type { FullscreenToggled } from "@/components/timeline/time-event/fullscreen/fullscreen-toggled";

/**
 * Observes mouse wheel events and calls zoomer with zoom factor according to wheel spin direction.
 */
export default class ZoomObserver {
  private timelineElement: HTMLElement;
  private zoomer: Zoomer;
  private store = useLookAtTime();
  private constructor() {
    this.zoomer = Zoomer.Instance;

    this.timelineElement = this.store.timelineElement!;
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

    if (this.store.timeEvents.length === 0) {
      return;
    }

    if (e.deltaY < 0) {
      // zoom out
      this.zoomer.zoom(0.92, e.pageX + this.timelineElement.scrollLeft);
    } else if (e.deltaY > 0) {
      // zoom in
      this.zoomer.zoom(1.1, e.pageX + this.timelineElement.scrollLeft);
    }
  };

  private pauseOnFullscreen() {
    document.addEventListener("fullscreen-toggled", (e) => {
      (e as CustomEvent<FullscreenToggled>).detail.isFullscreen
        ? this.timelineElement.removeEventListener("wheel", this.changeZoom)
        : this.observe();
    });
  }

  private static instance: ZoomObserver;
  public static get Instance(): ZoomObserver {
    return this.instance || (this.instance = new this());
  }
}
